<template>
<!--   <van-tabbar v-model="active" route safe-area-inset-bottom>
    <van-tabbar-item v-for="(item, index) in tabbarItems" :key="index" :to="item.path" :icon="item.icon">
      {{ item.title }}
    </van-tabbar-item>
  </van-tabbar> -->
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const active = ref(0);

interface TabbarItem {
  title: string;
  icon: string;
  path: string;
}

// 底部导航栏项目配置
const tabbarItems = reactive<TabbarItem[]>([
  {
    title: '个人事项',
    icon: 'todo-list-o',
    path: '/personal/todo'
  },
  {
    title: '基础资料',
    icon: 'label-o',
    path: '/basic/equipment'
  },
  {
    title: '设备点检',
    icon: 'flag-o',
    path: '/check/list'
  },
  {
    title: '设备巡检',
    icon: 'search',
    path: '/patrol/list'
  },
  {
    title: '设备维修',
    icon: 'toolbox-o',
    path: '/repair/maintenance'
  }
]);

// 根据当前路由设置激活的标签
const currentPath = route.path;
const activeIndex = tabbarItems.findIndex(item => currentPath.includes(item.path.split('/')[1]));
if (activeIndex !== -1) {
  active.value = activeIndex;
}
</script>

<style scoped>
.van-tabbar {
  border-top: 1px solid #f5f5f5;
}
</style> 