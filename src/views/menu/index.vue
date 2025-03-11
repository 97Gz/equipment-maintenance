<template>
  <div class="menu-container">
    <nav-bar title="功能菜单" :show-back="false" />
    
    <div class="content">
      <div class="greeting">
        <p class="welcome">您好，欢迎使用设备管理系统</p>
        <p class="date">{{ currentDate }}</p>
      </div>
      
      <div class="menu-section">
        <h2 class="section-title">个人事项</h2>
        <div class="menu-grid">
          <div class="menu-item" @click="navigateTo('/personal/todo')">
            <van-icon name="cluster-o" size="28" />
            <span>我的待办</span>
          </div>
          <div class="menu-item" @click="navigateTo('/personal/initiated')">
            <van-icon name="send-gift-o" size="28" />
            <span>我发起的</span>
          </div>
          <div class="menu-item" @click="navigateTo('/personal/processed')">
            <van-icon name="completed" size="28" />
            <span>我处理的</span>
          </div>
        </div>
      </div>
      
      <!-- 功能区块 -->
      <div class="menu-section">
        <h2 class="section-title">设备管理</h2>
        <div class="menu-grid">
          <div class="menu-item" @click="navigateTo('/basic/equipment')">
            <van-icon name="notes-o" size="28" />
            <span>设备档案</span>
          </div>
        </div>
      </div>
      
      <div class="menu-section">
        <h2 class="section-title">设备点检</h2>
        <div class="menu-grid">
          <div class="menu-item" @click="navigateTo('/check/list')">
            <van-icon name="flag-o" size="28" />
            <span>点检单</span>
          </div>
          <div class="menu-item" @click="navigateTo('/check/standard')">
            <van-icon name="balance-list-o" size="28" />
            <span>点检标准</span>
          </div>
          <div class="menu-item" @click="navigateTo('/check/statistics')">
            <van-icon name="bar-chart-o" size="28" />
            <span>点检统计</span>
          </div>
        </div>
      </div>
      
      <div class="menu-section">
        <h2 class="section-title">设备巡检</h2>
        <div class="menu-grid">
          <div class="menu-item" @click="navigateTo('/patrol/list')">
            <van-icon name="search" size="28" />
            <span>巡检单</span>
          </div>
          <div class="menu-item" @click="navigateTo('/patrol/plan')">
            <van-icon name="todo-list-o" size="28" />
            <span>巡检方案</span>
          </div>
          <div class="menu-item" @click="navigateTo('/patrol/statistics')">
            <van-icon name="chart-trending-o" size="28" />
            <span>巡检统计</span>
          </div>
        </div>
      </div>
      
      <div class="menu-section">
        <h2 class="section-title">设备维修</h2>
        <div class="menu-grid">
          <div class="menu-item" @click="navigateTo('/repair/maintenance')">
            <van-icon name="service-o" size="28" />
            <span>维修单</span>
          </div>
          <div class="menu-item" @click="navigateTo('/repair/scrap')">
            <van-icon name="delete-o" size="28" />
            <span>报废单</span>
          </div>
          <div class="menu-item" @click="navigateTo('/repair/statistics')">
            <van-icon name="chart-trending-o" size="28" />
            <span>维修统计</span>
          </div>
        </div>
      </div>
      
      <div class="menu-section">
        <h2 class="section-title">设备保养</h2>
        <div class="menu-grid">
          <div class="menu-item" @click="navigateTo('/maintenance/plan')">
            <van-icon name="calendar-o" size="28" />
            <span>保养计划</span>
          </div>
          <div class="menu-item" @click="navigateTo('/maintenance/list')">
            <van-icon name="newspaper-o" size="28" />
            <span>保养单</span>
          </div>
          <div class="menu-item" @click="navigateTo('/maintenance/level')">
            <van-icon name="filter-o" size="28" />
            <span>保养等级</span>
          </div>
          <div class="menu-item" @click="navigateTo('/maintenance/calendar')">
            <van-icon name="calendar-o" size="28" />
            <span>保养日历</span>
          </div>
        </div>
      </div>
    </div>
    <tab-bar />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import NavBar from '@/components/NavBar.vue';
import TabBar from '@/components/TabBar.vue';

const router = useRouter();

// 获取当前日期
const currentDate = computed(() => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const week = ['日', '一', '二', '三', '四', '五', '六'][date.getDay()];
  
  return `${year}年${month}月${day}日 星期${week}`;
});

// 导航到指定路由
const navigateTo = (path: string) => {
  router.push(path);
};
</script>

<style scoped>
.menu-container {
  padding-top: 46px;
  padding-bottom: 50px;
  min-height: 100vh;
  background-color: var(--background-color);
}

.content {
  padding: 8px;
}

.greeting {
  background-color: var(--primary-color);
  color: white;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  background-image: linear-gradient(to right, var(--primary-color), #5089e3);
}

.welcome {
  font-size: 18px;
  font-weight: 500;
  margin: 0 0 8px 0;
}

.date {
  font-size: 14px;
  margin: 0;
  opacity: 0.9;
}

.menu-section {
  margin-bottom: 16px;
}

.section-title {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-color);
  margin: 0 0 8px 0;
  padding-left: 8px;
  border-left: 3px solid var(--primary-color);
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.menu-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: var(--card-background);
  border-radius: 8px;
  padding: 16px 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.2s ease;
}

.menu-item:hover, .menu-item:active {
  background-color: var(--primary-light);
}

.menu-item span {
  margin-top: 8px;
  font-size: 13px;
  color: var(--text-color);
}

.van-icon {
  color: var(--primary-color);
}

@media (max-width: 360px) {
  .menu-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style> 