<template>
  <van-tabbar v-model="active" route safe-area-inset-bottom fixed>
    <van-tabbar-item to="/dashboard" icon="chart-trending-o">仪表盘</van-tabbar-item>
    <van-tabbar-item to="/menu" icon="apps-o">菜单</van-tabbar-item>
    <van-tabbar-item to="/profile" icon="contact">个人信息</van-tabbar-item>
  </van-tabbar>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const active = ref(0);

// 根据当前路由设置激活的标签
onMounted(() => {
  setActiveTab();
});

watch(() => route.path, () => {
  setActiveTab();
});

// 设置当前激活的标签页
const setActiveTab = () => {
  const currentPath = route.path;
  
  if (currentPath.includes('/dashboard')) {
    active.value = 0;
  } else if (currentPath.includes('/menu') 
    || currentPath.includes('/home')
    || currentPath.includes('/personal')
    || currentPath.includes('/basic')
    || currentPath.includes('/check')
    || currentPath.includes('/patrol')
    || currentPath.includes('/repair')
    || currentPath.includes('/maintenance')) {
    active.value = 1;
  } else if (currentPath.includes('/profile')) {
    active.value = 2;
  }
};
</script>

<style scoped>
.van-tabbar {
  border-top: 1px solid var(--border-color);
  box-shadow: 0 -1px 4px rgba(0, 0, 0, 0.05);
}

:deep(.van-tabbar-item) {
  color: var(--text-color-secondary);
}

:deep(.van-tabbar-item--active) {
  color: var(--primary-color);
}
</style> 