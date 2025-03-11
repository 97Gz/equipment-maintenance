<template>
  <div class="equipment-check">
    <nav-bar title="设备点检" />
    
    <div class="content">
      <div class="loading-container">
        <van-loading type="spinner" color="var(--primary-color)" size="36" />
        <p class="loading-text">正在跳转到点检单页面...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import NavBar from '@/components/NavBar.vue';

const route = useRoute();
const router = useRouter();

// 页面加载时自动跳转到点检单新增页面
onMounted(() => {
  const equipmentId = route.params.id as string;
  if (equipmentId) {
    // 延迟跳转，以显示加载动画
    setTimeout(() => {
      router.replace(`/check/record/add?equipmentId=${equipmentId}`);
    }, 800);
  } else {
    // 如果没有设备ID，返回设备列表
    router.replace('/basic/equipment');
  }
});
</script>

<style scoped>
.equipment-check {
  padding-top: 46px;
  min-height: 100vh;
  background-color: var(--background-color);
}

.content {
  padding: 8px;
  height: calc(100vh - 46px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.loading-text {
  margin-top: 16px;
  color: var(--text-color-secondary);
  font-size: 14px;
}
</style> 