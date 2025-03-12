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
              label="车间名称"
              placeholder="请输入车间名称"
              :readonly="isViewMode"
              :rules="[{ required: true, message: '请输入车间名称' }]"
            />
            <van-field
              v-if="!isNewWorkshop"
              v-model="formData.id"
              name="id"
              label="车间编码"
              readonly
            />
            <van-field
              v-if="!isNewWorkshop"
              v-model="formData.createTime"
              name="createTime"
              label="创建时间"
              readonly
            />
            <van-field
              v-if="!isNewWorkshop"
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
import { useWorkshopStore } from '@/store/basic/workshop';

const route = useRoute();
const router = useRouter();
const workshopStore = useWorkshopStore();
const loading = ref(false);
const formRef = ref(null);

// 判断是新增还是编辑
const isNewWorkshop = computed(() => {
  return route.name === 'WorkshopAdd' || route.path.includes('/add');
});

// 判断是查看模式还是编辑模式
const isViewMode = computed(() => {
  return route.name === 'WorkshopDetail' && !route.path.includes('/edit') && !route.path.includes('/add');
});

// 获取页面标题
const getPageTitle = () => {
  if (isNewWorkshop.value) {
    return '新增车间';
  } else if (isViewMode.value) {
    return '车间详情';
  } else {
    return '编辑车间';
  }
};

// 表单数据
const formData = ref({
  id: '',
  name: '',
  createTime: '',
  updateTime: ''
});

// 表单提交
const onSubmit = async () => {
  try {
    // 验证表单
    if (!formData.value.name) {
      showToast('请输入车间名称');
      return;
    }
    
    // 开始提交
    loading.value = true;
    
    await workshopStore.saveWorkshop({
      id: isNewWorkshop.value ? undefined : formData.value.id,
      name: formData.value.name
    });
    
    showSuccessToast(isNewWorkshop.value ? '车间添加成功' : '车间已更新');
    
    // 返回车间列表页
    setTimeout(() => {
      router.push('/basic/workshop');
    }, 1500);
  } catch (error) {
    console.error('保存车间失败', error);
    showToast('保存失败');
  } finally {
    loading.value = false;
  }
};

// 获取车间详情
const fetchWorkshopDetail = async (id: string) => {
  try {
    loading.value = true;
    const workshop = await workshopStore.fetchWorkshopDetail(id);
    if (workshop) {
      formData.value = { ...workshop };
    } else {
      showToast('车间不存在');
      router.back();
    }
  } catch (error) {
    console.error('获取车间详情失败', error);
    showToast('获取车间详情失败');
    router.back();
  } finally {
    loading.value = false;
  }
};

// 页面加载时获取车间详情
onMounted(() => {
  if (!isNewWorkshop.value) {
    const id = route.params.id as string;
    fetchWorkshopDetail(id);
  }
});
</script>

<style scoped>
/* 使用全局样式 */
</style> 