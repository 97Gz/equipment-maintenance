import { defineStore } from 'pinia';
import { maintenancePlanApi } from '../../utils/mock/api';

// 维护计划接口
export interface MaintenancePlan {
  id: string;
  equipmentId: string;
  equipmentName: string;
  planName: string;
  planType: string;
  planDate: string;
  planPerson: string;
  description: string;
  status: string;
  createTime?: string;
  updateTime?: string;
}

// 计划类型枚举
export enum PlanType {
  REGULAR = '定期维护',
  SPECIAL = '专项维护',
  INSPECTION = '例行检查'
}

// 计划状态枚举
export enum PlanStatus {
  PENDING = '待执行',
  PROCESSING = '执行中',
  COMPLETED = '已完成',
  CANCELLED = '已取消'
}

// 维护计划存储
export const useMaintenancePlanStore = defineStore('maintenancePlan', {
  state: () => ({
    maintenancePlanList: [] as MaintenancePlan[],
    currentMaintenancePlan: null as MaintenancePlan | null
  }),
  
  getters: {
    // 获取维护计划列表
    getMaintenancePlanList: (state) => state.maintenancePlanList,
    
    // 获取当前选中的维护计划
    getCurrentMaintenancePlan: (state) => state.currentMaintenancePlan
  },
  
  actions: {
    // 获取维护计划列表
    async fetchMaintenancePlanList(equipmentId?: string) {
      try {
        // 直接从mock API获取数据
        const result = await maintenancePlanApi.getList(equipmentId);
        if (result.code === 200) {
          this.maintenancePlanList = result.data;
        } else {
          throw new Error(result.message || '获取维护计划列表失败');
        }
      } catch (error) {
        console.error('获取维护计划列表失败', error);
        throw error;
      }
    },
    
    // 获取维护计划详情
    async fetchMaintenancePlanDetail(id: string) {
      try {
        // 直接从mock API获取数据
        const result = await maintenancePlanApi.getDetail(id);
        if (result.code === 200) {
          this.currentMaintenancePlan = result.data;
          return result.data;
        } else {
          throw new Error(result.message || '获取维护计划详情失败');
        }
      } catch (error) {
        console.error('获取维护计划详情失败', error);
        throw error;
      }
    },
    
    // 保存维护计划
    async saveMaintenancePlan(maintenancePlan: Partial<MaintenancePlan>) {
      try {
        // 直接从mock API获取数据
        const result = await maintenancePlanApi.save(maintenancePlan);
        if (result.code === 200) {
          // 如果是更新操作
          if (maintenancePlan.id) {
            const index = this.maintenancePlanList.findIndex(item => item.id === maintenancePlan.id);
            if (index !== -1) {
              this.maintenancePlanList[index] = { ...this.maintenancePlanList[index], ...maintenancePlan } as MaintenancePlan;
            }
          } else {
            // 如果是新增操作，刷新列表
            await this.fetchMaintenancePlanList();
          }
          return result.data;
        } else {
          throw new Error(result.message || '保存维护计划失败');
        }
      } catch (error) {
        console.error('保存维护计划失败', error);
        throw error;
      }
    },
    
    // 删除维护计划
    async deleteMaintenancePlan(id: string) {
      try {
        // 直接从mock API获取数据
        const result = await maintenancePlanApi.delete(id);
        if (result.code === 200) {
          const index = this.maintenancePlanList.findIndex(item => item.id === id);
          if (index !== -1) {
            this.maintenancePlanList.splice(index, 1);
          }
          return true;
        } else {
          throw new Error(result.message || '删除维护计划失败');
        }
      } catch (error) {
        console.error('删除维护计划失败', error);
        throw error;
      }
    }
  }
}); 