import { defineStore } from 'pinia';
import { maintenanceRecordApi } from '../../utils/mock/api';

// 维护记录接口
export interface MaintenanceRecord {
  id: string;
  equipmentId: string;
  equipmentName: string;
  maintenanceType: string;
  maintenanceDate: string;
  maintenanceResult: string;
  maintenancePerson: string;
  description: string;
  cost: number;
  nextMaintenanceDate: string;
  createTime?: string;
  updateTime?: string;
}

// 维护类型枚举
export enum MaintenanceType {
  REGULAR = '定期维护',
  REPAIR = '故障维修',
  INSPECTION = '例行检查'
}

// 维护结果枚举
export enum MaintenanceResult {
  COMPLETED = '已完成',
  PENDING = '待处理',
  FAILED = '未解决'
}

// 维护记录存储
export const useMaintenanceRecordStore = defineStore('maintenanceRecord', {
  state: () => ({
    maintenanceRecordList: [] as MaintenanceRecord[],
    currentMaintenanceRecord: null as MaintenanceRecord | null
  }),
  
  getters: {
    // 获取维护记录列表
    getMaintenanceRecordList: (state) => state.maintenanceRecordList,
    
    // 获取当前选中的维护记录
    getCurrentMaintenanceRecord: (state) => state.currentMaintenanceRecord
  },
  
  actions: {
    // 获取维护记录列表
    async fetchMaintenanceRecordList(equipmentId?: string) {
      try {
        // 直接从mock API获取数据
        const result = await maintenanceRecordApi.getList(equipmentId);
        if (result.code === 200) {
          this.maintenanceRecordList = result.data;
        } else {
          throw new Error(result.message || '获取维护记录列表失败');
        }
      } catch (error) {
        console.error('获取维护记录列表失败', error);
        throw error;
      }
    },
    
    // 获取维护记录详情
    async fetchMaintenanceRecordDetail(id: string) {
      try {
        // 直接从mock API获取数据
        const result = await maintenanceRecordApi.getDetail(id);
        if (result.code === 200) {
          this.currentMaintenanceRecord = result.data;
          return result.data;
        } else {
          throw new Error(result.message || '获取维护记录详情失败');
        }
      } catch (error) {
        console.error('获取维护记录详情失败', error);
        throw error;
      }
    },
    
    // 保存维护记录
    async saveMaintenanceRecord(maintenanceRecord: Partial<MaintenanceRecord>) {
      try {
        // 直接从mock API获取数据
        const result = await maintenanceRecordApi.save(maintenanceRecord);
        if (result.code === 200) {
          // 如果是更新操作
          if (maintenanceRecord.id) {
            const index = this.maintenanceRecordList.findIndex(item => item.id === maintenanceRecord.id);
            if (index !== -1) {
              this.maintenanceRecordList[index] = { ...this.maintenanceRecordList[index], ...maintenanceRecord } as MaintenanceRecord;
            }
          } else {
            // 如果是新增操作，刷新列表
            await this.fetchMaintenanceRecordList();
          }
          return result.data;
        } else {
          throw new Error(result.message || '保存维护记录失败');
        }
      } catch (error) {
        console.error('保存维护记录失败', error);
        throw error;
      }
    },
    
    // 删除维护记录
    async deleteMaintenanceRecord(id: string) {
      try {
        // 直接从mock API获取数据
        const result = await maintenanceRecordApi.delete(id);
        if (result.code === 200) {
          const index = this.maintenanceRecordList.findIndex(item => item.id === id);
          if (index !== -1) {
            this.maintenanceRecordList.splice(index, 1);
          }
          return true;
        } else {
          throw new Error(result.message || '删除维护记录失败');
        }
      } catch (error) {
        console.error('删除维护记录失败', error);
        throw error;
      }
    }
  }
}); 