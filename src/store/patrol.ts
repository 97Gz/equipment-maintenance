import { defineStore } from 'pinia';
import request from '@/utils/request';
import { showToast } from 'vant';
import type { PatrolPlan, PatrolPlanItem, PatrolRecord, PatrolRecordItem } from '@/utils/mock/patrol';

// 定义巡检Store
export const usePatrolStore = defineStore('patrol', {
  state: () => ({
    planList: [] as PatrolPlan[],
    currentPlan: null as PatrolPlan | null,
    recordList: [] as PatrolRecord[],
    currentRecord: null as PatrolRecord | null
  }),

  getters: {
    // 获取巡检方案列表
    getPlanList: (state) => state.planList,
    
    // 获取当前巡检方案
    getCurrentPlan: (state) => state.currentPlan,
    
    // 获取巡检单列表
    getRecordList: (state) => state.recordList,
    
    // 获取当前巡检单
    getCurrentRecord: (state) => state.currentRecord
  },

  actions: {
    // 获取巡检方案列表
    async fetchPlanList() {
      try {
        const response = await request.get('/api/patrol/plan/list');
        this.planList = response.data;
        return response.data;
      } catch (error) {
        console.error('获取巡检方案列表失败', error);
        showToast('获取巡检方案列表失败');
        throw error;
      }
    },

    // 获取巡检方案详情
    async fetchPlanDetail(id: string) {
      try {
        const response = await request.get(`/api/patrol/plan/detail/${id}`);
        this.currentPlan = response.data;
        return response.data;
      } catch (error) {
        console.error('获取巡检方案详情失败', error);
        showToast('获取巡检方案详情失败');
        throw error;
      }
    },

    // 保存巡检方案（新增或更新）
    async savePlan(plan: Partial<PatrolPlan>) {
      try {
        const response = await request.post('/api/patrol/plan/save', plan);
        showToast('保存成功');
        return response.data;
      } catch (error) {
        console.error('保存巡检方案失败', error);
        showToast('保存巡检方案失败');
        throw error;
      }
    },

    // 删除巡检方案
    async deletePlan(id: string) {
      try {
        const response = await request.delete(`/api/patrol/plan/delete/${id}`);
        showToast('删除成功');
        return response.data;
      } catch (error) {
        console.error('删除巡检方案失败', error);
        showToast('删除巡检方案失败');
        throw error;
      }
    },

    // 获取巡检单列表
    async fetchRecordList() {
      try {
        const response = await request.get('/api/patrol/record/list');
        this.recordList = response.data;
        return response.data;
      } catch (error) {
        console.error('获取巡检单列表失败', error);
        showToast('获取巡检单列表失败');
        throw error;
      }
    },

    // 获取巡检单详情
    async fetchRecordDetail(id: string) {
      try {
        const response = await request.get(`/api/patrol/record/detail/${id}`);
        this.currentRecord = response.data;
        return response.data;
      } catch (error) {
        console.error('获取巡检单详情失败', error);
        showToast('获取巡检单详情失败');
        throw error;
      }
    },

    // 保存巡检单（新增或更新）
    async saveRecord(record: Partial<PatrolRecord>) {
      try {
        const response = await request.post('/api/patrol/record/save', record);
        showToast('保存成功');
        return response.data;
      } catch (error) {
        console.error('保存巡检单失败', error);
        showToast('保存巡检单失败');
        throw error;
      }
    },

    // 删除巡检单
    async deleteRecord(id: string) {
      try {
        const response = await request.delete(`/api/patrol/record/delete/${id}`);
        showToast('删除成功');
        return response.data;
      } catch (error) {
        console.error('删除巡检单失败', error);
        showToast('删除巡检单失败');
        throw error;
      }
    },
    
    // 计算下一次巡检时间
    calculateNextPatrolTime(plan: Partial<PatrolPlan>): string {
      if (!plan.firstTime) {
        return '';
      }
      
      const firstDate = new Date(plan.firstTime);
      let nextDate = new Date(firstDate);
      
      if (plan.frequencyType === 'interval' && plan.intervalDays) {
        // 固定时间间隔
        nextDate.setDate(firstDate.getDate() + plan.intervalDays);
      } else if (plan.frequencyType === 'weekly' && typeof plan.weekDay === 'number') {
        // 每周几
        const currentDay = firstDate.getDay(); // 0-6, 0是周日
        const targetDay = plan.weekDay; // 0-6, 0是周日
        const daysToAdd = (targetDay + 7 - currentDay) % 7 || 7; // 如果当天是目标日期，则加7天
        nextDate.setDate(firstDate.getDate() + daysToAdd);
      } else if (plan.frequencyType === 'monthly' && typeof plan.monthDay === 'number') {
        // 每月几号
        const targetDay = plan.monthDay;
        nextDate.setMonth(firstDate.getMonth() + 1); // 下个月
        nextDate.setDate(Math.min(targetDay, new Date(nextDate.getFullYear(), nextDate.getMonth() + 1, 0).getDate())); // 确保日期有效
      }
      
      return nextDate.toISOString().split('T')[0]; // 返回YYYY-MM-DD格式
    }
  }
}); 