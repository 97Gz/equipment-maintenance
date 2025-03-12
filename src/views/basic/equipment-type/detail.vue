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
              v-model="formData.typeName"
              name="typeName"
              label="类型名称"
              placeholder="请输入设备类型名称"
              :readonly="isViewMode"
              :rules="[{ required: true, message: '请输入设备类型名称' }]"
            />
            <van-field
              v-if="!isNewType"
              v-model="formData.id"
              name="id"
              label="类型编码"
              readonly
            />
            <van-field
              v-if="!isNewType"
              v-model="formData.createTime"
              name="createTime"
              label="创建时间"
              readonly
            />
            <van-field
              v-if="!isNewType"
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
import { useEquipmentTypeStore } from '@/store/basic/equipmentType';

const route = useRoute();
const router = useRouter();
const equipmentTypeStore = useEquipmentTypeStore();
const loading = ref(false);
const formRef = ref(null);

// 判断是新增还是编辑
const isNewType = computed(() => {
  return route.name === 'EquipmentTypeAdd' || route.path.includes('/add');
});

// 判断是查看模式还是编辑模式
const isViewMode = computed(() => {
  return route.name === 'EquipmentTypeDetail' && !route.path.includes('/edit') && !route.path.includes('/add');
});

// 获取页面标题
const getPageTitle = () => {
  if (isNewType.value) {
    return '新增设备类型';
  } else if (isViewMode.value) {
    return '设备类型详情';
  } else {
    return '编辑设备类型';
  }
};

// 表单数据
const formData = ref({
  id: '',
  typeName: '',
  createTime: '',
  updateTime: ''
});

// 表单提交
const onSubmit = async () => {
  try {
    // 验证表单
    if (!formData.value.typeName) {
      showToast('请输入设备类型名称');
      return;
    }
    
    // 开始提交
    loading.value = true;
    
    await equipmentTypeStore.saveEquipmentType({
      id: isNewType.value ? undefined : formData.value.id,
      typeName: formData.value.typeName
    });
    
    showSuccessToast(isNewType.value ? '设备类型添加成功' : '设备类型已更新');
    
    // 返回设备类型列表页
    setTimeout(() => {
      router.push('/basic/equipment-type');
    }, 1500);
  } catch (error) {
    console.error('保存设备类型失败', error);
    showToast('保存失败');
  } finally {
    loading.value = false;
  }
};

// 获取设备类型详情
const fetchTypeDetail = async (id: string) => {
  try {
    loading.value = true;
    const equipmentType = await equipmentTypeStore.fetchEquipmentTypeDetail(id);
    if (equipmentType) {
      formData.value = { ...equipmentType };
    } else {
      showToast('设备类型不存在');
      router.back();
    }
  } catch (error) {
    console.error('获取设备类型详情失败', error);
    showToast('获取设备类型详情失败');
    router.back();
  } finally {
    loading.value = false;
  }
};

// 页面加载时获取设备类型详情
onMounted(() => {
  if (!isNewType.value) {
    const id = route.params.id as string;
    fetchTypeDetail(id);
  }
});
</script>

<style scoped>
/* 使用全局样式 */
</style> 