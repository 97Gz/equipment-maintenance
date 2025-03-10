<template>
  <div class="home-container">
    <van-nav-bar title="设备管理系统" fixed />
    
    <div class="content">
      <div class="welcome-banner">
        <van-image
          src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"
          round
          width="50"
          height="50"
        />
        <div class="welcome-text">
          <h3>欢迎，{{ userInfo.name }}</h3>
          <p>今天是 {{ currentDate }}</p>
        </div>
      </div>
      
      <div class="menu-section" v-for="(section, index) in menuSections" :key="index">
        <h2 class="section-title">{{ section.title }}</h2>
        <div class="menu-grid">
          <van-grid :column-num="3" :border="false" :gutter="10">
            <van-grid-item
              v-for="(menu, menuIndex) in section.menus"
              :key="menuIndex"
              :icon="menu.icon"
              :text="menu.text"
              :to="menu.path"
            />
          </van-grid>
        </div>
      </div>
    </div>
    
    <tab-bar />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/user';
import TabBar from '@/components/TabBar.vue';

const router = useRouter();
const userStore = useUserStore();

// 用户信息
const userInfo = computed(() => userStore.userInfo);

// 当前日期
const currentDate = computed(() => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
});

// 菜单配置
const menuSections = [
  {
    title: '个人事项',
    menus: [
      { text: '我的待办', icon: 'todo-list-o', path: '/personal/todo' },
      { text: '我发起的', icon: 'send-gift-o', path: '/personal/initiated' },
      { text: '我处理的', icon: 'checked', path: '/personal/processed' }
    ]
  },
  {
    title: '基础资料',
    menus: [
      { text: '设备档案', icon: 'label-o', path: '/basic/equipment' }
    ]
  },
  {
    title: '设备点检',
    menus: [
      { text: '设备点检单', icon: 'notes-o', path: '/check/list' },
      { text: '点检标准', icon: 'flag-o', path: '/check/standard' },
      { text: '点检统计', icon: 'chart-trending-o', path: '/check/statistics' }
    ]
  },
  {
    title: '设备巡检',
    menus: [
      { text: '设备巡检单', icon: 'search', path: '/patrol/list' },
      { text: '巡检方案', icon: 'guide-o', path: '/patrol/plan' },
      { text: '巡检统计', icon: 'bar-chart-o', path: '/patrol/statistics' }
    ]
  },
  {
    title: '设备报修维修',
    menus: [
      { text: '设备维修单', icon: 'service-o', path: '/repair/maintenance' },
      { text: '设备报废单', icon: 'delete-o', path: '/repair/scrap' },
      { text: '维修统计', icon: 'chart-trending-o', path: '/repair/statistics' }
    ]
  },
  {
    title: '设备维护保养',
    menus: [
      { text: '保养计划表', icon: 'calendar-o', path: '/maintenance/plan' },
      { text: '设备保养单', icon: 'setting-o', path: '/maintenance/list' },
      { text: '保养等级与频次', icon: 'filter-o', path: '/maintenance/level' },
      { text: '设备保养日历', icon: 'clock-o', path: '/maintenance/calendar' }
    ]
  }
];

// 页面加载
onMounted(async () => {
  if (!userStore.isLogin) {
    try {
      await userStore.getUserInfo();
    } catch (error) {
      console.error('获取用户信息失败', error);
      router.push('/login');
    }
  }
});
</script>

<style scoped>
.home-container {
  padding-top: 46px;
  padding-bottom: 50px;
  background-color: #f8fafc;
  min-height: 100vh;
}

.content {
  padding: 16px;
}

.welcome-banner {
  display: flex;
  align-items: center;
  background-color: #1a56db;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.welcome-text {
  margin-left: 12px;
  color: white;
}

.welcome-text h3 {
  font-size: 18px;
  margin: 0 0 4px 0;
  font-weight: 600;
}

.welcome-text p {
  font-size: 14px;
  margin: 0;
  opacity: 0.8;
}

.menu-section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 16px;
  color: #334155;
  margin: 0 0 12px 0;
  font-weight: 600;
  position: relative;
  padding-left: 12px;
}

.section-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 16px;
  background-color: #1a56db;
  border-radius: 2px;
}

.menu-grid {
  background-color: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
}

:deep(.van-grid-item__content) {
  padding: 16px 8px;
}

:deep(.van-grid-item__icon) {
  font-size: 28px;
  color: #1a56db;
}

:deep(.van-grid-item__text) {
  color: #334155;
  font-size: 14px;
  margin-top: 8px;
}
</style> 