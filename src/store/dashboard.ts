import { defineStore } from 'pinia';
import axios from 'axios';

// 设备状态数据接口
export interface EquipmentStatusData {
  value: number;
  name: string;
  itemStyle: {
    color: string;
  };
}

// 点检趋势数据接口
export interface CheckTrendData {
  dates: string[];
  planCount: number[];
  actualCount: number[];
}

// 巡检分布数据接口
export interface PatrolDistributionData {
  dates: string[];
  areas: {
    name: string;
    data: number[];
  }[];
}

// 近期点检记录接口
export interface RecentCheckItem {
  equipmentName: string;
  checkTime: string;
  operator: string;
  result: string;
}

// 仪表盘数据接口
export interface DashboardData {
  equipmentStatus: EquipmentStatusData[];
  checkTrend: CheckTrendData;
  patrolDistribution: PatrolDistributionData;
  recentCheckList: RecentCheckItem[];
}

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    dashboardData: null as DashboardData | null,
    loading: false
  }),
  
  getters: {
    // 获取仪表盘数据
    getDashboardData: (state) => state.dashboardData,
    
    // 获取加载状态
    isLoading: (state) => state.loading
  },
  
  actions: {
    // 获取仪表盘数据
    async fetchDashboardData() {
      try {
        this.loading = true;
        const response = await axios.get('/api/dashboard/data');
        if (response.data.code === 200) {
          this.dashboardData = response.data.data;
        }
        return response.data;
      } catch (error) {
        console.error('获取仪表盘数据失败', error);
        throw error;
      } finally {
        this.loading = false;
      }
    }
  }
}); 