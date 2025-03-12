<template>
  <div class="page-container">
    <nav-bar :title="getPageTitle()" />
    
    <div class="content" v-if="!loading">
      <van-form ref="formRef">
        <!-- 基本信息 -->
        <div class="form-section">
          <div class="section-title">基本信息</div>
          <van-cell-group inset>
            <van-field
              v-model="formData.name"
              name="name"
              label="仓库名称"
              placeholder="请输入仓库名称"
              :readonly="isViewMode"
              :rules="[{ required: true, message: '请输入仓库名称' }]"
            />
            <van-field
              v-model="formData.location"
              name="location"
              label="仓库位置"
              placeholder="请输入仓库位置"
              :readonly="isViewMode"
            />
            <van-field
              v-model="formData.manager"
              name="manager"
              label="管理员"
              placeholder="请输入管理员姓名"
              :readonly="isViewMode"
            />
            <van-field
              v-if="!isNewWarehouse"
              v-model="formData.id"
              name="id"
              label="仓库编码"
              readonly
            />
            <van-field
              v-if="!isNewWarehouse"
              v-model="formData.createTime"
              name="createTime"
              label="创建时间"
              readonly
            />
            <van-field
              v-if="!isNewWarehouse"
              v-model="formData.updateTime"
              name="updateTime"
              label="更新时间"
              readonly
            />
          </van-cell-group>
        </div>
      </van-form>
    </div>
    
    <!-- 加载状态 -->
    <div class="loading-container" v-if="loading">
      <van-loading type="spinner" color="var(--primary-color)" size="36" />
      <p class="loading-text">加载中...</p>
    </div>
    
    <!-- 固定在底部的保存按钮 -->
    <div class="fixed-bottom" v-if="!loading && !isViewMode">
      <van-button round block type="primary" @click="onSubmit">保存</van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { showToast, showSuccessToast } from 'vant';
import NavBar from '@/components/NavBar.vue';
import { useWarehouseStore } from '@/store/basic/warehouse';

const route = useRoute();
const router = useRouter();
const warehouseStore = useWarehouseStore();
const loading = ref(false);
const formRef = ref(null);

// 判断是新增还是编辑
const isNewWarehouse = computed(() => {
  return route.name === 'WarehouseAdd' || route.path.includes('/add');
});

// 判断是查看模式还是编辑模式
const isViewMode = computed(() => {
  return route.name === 'WarehouseDetail' && !route.path.includes('/edit') && !route.path.includes('/add');
});

// 获取页面标题
const getPageTitle = () => {
  if (isNewWarehouse.value) {
    return '新增仓库';
  } else if (isViewMode.value) {
    return '仓库详情';
  } else {
    return '编辑仓库';
  }
};

// 表单数据
const formData = ref({
  id: '',
  name: '',
  location: '',
  manager: '',
  createTime: '',
  updateTime: ''
});

// 表单提交
const onSubmit = async () => {
  try {
    // 验证表单
    if (!formData.value.name) {
      showToast('请输入仓库名称');
      return;
    }
    
    // 开始提交
    loading.value = true;
    
    await warehouseStore.saveWarehouse({
      id: isNewWarehouse.value ? undefined : formData.value.id,
      name: formData.value.name,
      location: formData.value.location,
      manager: formData.value.manager
    });
    
    showSuccessToast(isNewWarehouse.value ? '仓库添加成功' : '仓库已更新');
    
    // 返回仓库列表页
    setTimeout(() => {
      router.push('/basic/warehouse');
    }, 1500);
  } catch (error) {
    console.error('保存仓库失败', error);
    showToast('保存失败');
  } finally {
    loading.value = false;
  }
};

// 获取仓库详情
const fetchWarehouseDetail = async (id: string) => {
  try {
    loading.value = true;
    const warehouse = await warehouseStore.fetchWarehouseDetail(id);
    if (warehouse) {
      formData.value = { ...warehouse };
    } else {
      showToast('仓库不存在');
      router.back();
    }
  } catch (error) {
    console.error('获取仓库详情失败', error);
    showToast('获取仓库详情失败');
    router.back();
  } finally {
    loading.value = false;
  }
};

// 页面加载时获取仓库详情
onMounted(() => {
  if (!isNewWarehouse.value) {
    const id = route.params.id as string;
    fetchWarehouseDetail(id);
  }
});
</script>

<style scoped>
/* 使用全局样式 */
</style> 