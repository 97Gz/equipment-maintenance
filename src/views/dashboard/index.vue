<template>
  <div class="dashboard-container">
    <nav-bar title="仪表盘" :show-back="false" />
    
    <div class="content">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <template v-if="loading">
          <div class="loading-container">
            <van-loading type="spinner" color="var(--primary-color)" size="36" />
            <p class="loading-text">加载中...</p>
          </div>
        </template>
        
        <template v-else-if="dashboardData">
          <!-- 设备状态分布 饼图 -->
          <div class="chart-card">
            <div class="chart-title">设备状态分布</div>
            <div class="chart-container" ref="statusChartRef"></div>
          </div>
          
          <!-- 点检次数趋势 曲线图 -->
          <div class="chart-card">
            <div class="chart-title">点检次数趋势</div>
            <div class="chart-container" ref="checkTrendChartRef"></div>
          </div>
          
          <!-- 巡检分布 曲线图 -->
          <div class="chart-card">
            <div class="chart-title">巡检分布</div>
            <div class="chart-container" ref="patrolChartRef"></div>
          </div>
          
          <!-- 近期点检记录 -->
          <div class="data-card">
            <div class="card-header">
              <div class="card-title">近期点检记录</div>
              <van-button type="primary" size="small" plain round @click="navigateTo('/check/list')">查看更多</van-button>
            </div>
            <van-cell-group inset>
              <van-cell 
                v-for="(item, index) in dashboardData.recentCheckList" 
                :key="index"
                :title="item.equipmentName"
                :label="`${item.checkTime} | ${item.operator}`"
                :value="item.result"
                :value-class="item.result === '合格' ? 'status-normal' : 'status-warning'"
              />
            </van-cell-group>
          </div>
        </template>
      </van-pull-refresh>
    </div>
    
    <tab-bar />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { showToast } from 'vant';
import NavBar from '@/components/NavBar.vue';
import TabBar from '@/components/TabBar.vue';
import { useDashboardStore } from '@/store/dashboard';

const router = useRouter();
const dashboardStore = useDashboardStore();
const loading = ref(true);
const refreshing = ref(false);
const dashboardData = ref(dashboardStore.getDashboardData);

// 导入echarts
// 实际使用时需要安装并导入echarts
const echarts = window.echarts;

// 图表DOM引用
const statusChartRef = ref<HTMLElement | null>(null);
const checkTrendChartRef = ref<HTMLElement | null>(null);
const patrolChartRef = ref<HTMLElement | null>(null);

// 图表实例
let statusChart: any = null;
let checkTrendChart: any = null;
let patrolChart: any = null;

// 导航到指定路由
const navigateTo = (path: string) => {
  router.push(path);
};

// 获取仪表盘数据
const fetchData = async () => {
  try {
    loading.value = true;
    await dashboardStore.fetchDashboardData();
    dashboardData.value = dashboardStore.getDashboardData;
    
    // 数据加载完成后初始化图表
    setTimeout(() => {
      initCharts();
    }, 100);
  } catch (error) {
    showToast('获取数据失败');
    console.error('获取仪表盘数据失败', error);
  } finally {
    loading.value = false;
    refreshing.value = false;
  }
};

// 下拉刷新
const onRefresh = () => {
  fetchData();
};

// 初始化图表
const initCharts = () => {
  if (!dashboardData.value || typeof echarts === 'undefined') return;
  
  // 初始化设备状态分布饼图
  if (statusChartRef.value) {
    statusChart = echarts.init(statusChartRef.value);
    statusChart.setOption({
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'horizontal',
        bottom: 0,
        data: dashboardData.value.equipmentStatus.map(item => item.name)
      },
      series: [
        {
          name: '设备状态',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '18',
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: dashboardData.value.equipmentStatus
        }
      ]
    });
  }
  
  // 初始化点检次数趋势曲线图
  if (checkTrendChartRef.value) {
    checkTrendChart = echarts.init(checkTrendChartRef.value);
    checkTrendChart.setOption({
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['计划点检', '实际点检'],
        bottom: 0
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        top: '10%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: dashboardData.value.checkTrend.dates
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '计划点检',
          type: 'line',
          data: dashboardData.value.checkTrend.planCount,
          smooth: true,
          lineStyle: {
            color: '#3c78d8'
          }
        },
        {
          name: '实际点检',
          type: 'line',
          data: dashboardData.value.checkTrend.actualCount,
          smooth: true,
          lineStyle: {
            color: '#34b37c'
          }
        }
      ]
    });
  }
  
  // 初始化巡检分布曲线图
  if (patrolChartRef.value) {
    patrolChart = echarts.init(patrolChartRef.value);
    
    const series = dashboardData.value.patrolDistribution.areas.map(area => {
      return {
        name: area.name,
        type: 'line',
        stack: 'Total',
        data: area.data,
        smooth: true,
        areaStyle: {}
      };
    });
    
    patrolChart.setOption({
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: dashboardData.value.patrolDistribution.areas.map(area => area.name),
        bottom: 0
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        top: '10%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: dashboardData.value.patrolDistribution.dates
      },
      yAxis: {
        type: 'value'
      },
      series: series
    });
  }
  
  // 窗口大小改变时，重新调整图表大小
  window.addEventListener('resize', handleResize);
};

// 处理窗口大小改变
const handleResize = () => {
  statusChart?.resize();
  checkTrendChart?.resize();
  patrolChart?.resize();
};

// 组件卸载时移除事件监听
onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  statusChart?.dispose();
  checkTrendChart?.dispose();
  patrolChart?.dispose();
});

// 页面加载时获取数据并初始化图表
onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.dashboard-container {
  padding-top: 46px;
  padding-bottom: 50px;
  min-height: 100vh;
  background-color: var(--background-color);
}

.content {
  padding: 8px;
}

.chart-card, .data-card {
  background-color: var(--card-background);
  border-radius: 8px;
  margin-bottom: 12px;
  padding: 12px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.chart-title, .card-title {
  font-size: 15px;
  font-weight: 500;
  color: var(--text-color);
  margin-bottom: 8px;
}

.chart-container {
  height: 180px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
}

.loading-text {
  margin-top: 12px;
  color: var(--text-color-secondary);
  font-size: 14px;
}

.status-normal {
  color: var(--success-color) !important;
}

.status-warning {
  color: var(--warning-color) !important;
}

:deep(.van-cell-group--inset) {
  margin: 0;
}
</style> 