import { defineStore } from 'pinia';
import axios from 'axios';
import { 
  getStandardList, 
  getStandardDetail, 
  saveStandard, 
  deleteStandard,
  getRecordList,
  getRecordDetail,
  saveRecord,
  deleteRecord
} from '../api/check';

// 点检项目接口（标准中的项目）
export interface CheckItem {
  id?: string;
  name: string;
  method: string;
  minValue?: string;
  maxValue?: string;
  unit?: string;
}

// 点检记录项目接口
export interface CheckRecordItem {
  name: string;
  method: string;
  standardRange: string;
  result: string;
  remark: string;
}

// 点检标准接口
export interface CheckStandard {
  id: string;
  name: string;
  code: string;
  equipmentType: string;
  description?: string;
  createTime?: string;
  items: CheckItem[];
}

// 点检记录接口
export interface CheckRecord {
  id: string;
  equipmentId: string;
  equipmentCode: string;
  equipmentName: string;
  workshop: string;
  location: string;
  standardId: string;
  standardName: string;
  standardCode: string;
  checkTime: string;
  checker: string;
  result: string;
  status: string;
  createTime?: string;
  items: CheckRecordItem[];
}

export const useCheckStore = defineStore('check', {
  state: () => ({
    standardList: [] as CheckStandard[],
    currentStandard: null as CheckStandard | null,
    recordList: [] as CheckRecord[],
    currentRecord: null as CheckRecord | null
  }),
  
  getters: {
    // 获取点检标准列表
    getStandardList: (state) => state.standardList,
    
    // 获取当前选中的点检标准
    getCurrentStandard: (state) => state.currentStandard,
    
    // 获取点检记录列表
    getRecordList: (state) => state.recordList,
    
    // 获取当前选中的点检记录
    getCurrentRecord: (state) => state.currentRecord
  },
  
  actions: {
    // 获取点检标准列表
    async fetchStandardList() {
      try {
        const response = await getStandardList();
        if (response.code === 200) {
          this.standardList = response.data;
        } else {
          throw new Error(response.message || '获取点检标准列表失败');
        }
      } catch (error) {
        console.error('获取点检标准列表失败', error);
        throw error;
      }
    },
    
    // 获取点检标准详情
    async fetchStandardDetail(id: string) {
      try {
        const response = await getStandardDetail(id);
        if (response.code === 200) {
          this.currentStandard = response.data;
          return response.data;
        } else {
          throw new Error(response.message || '获取点检标准详情失败');
        }
      } catch (error) {
        console.error('获取点检标准详情失败', error);
        throw error;
      }
    },
    
    // 保存点检标准
    async saveStandard(standard: Partial<CheckStandard>) {
      try {
        const response = await saveStandard(standard);
        if (response.code === 200) {
          // 如果是更新操作
          if (standard.id) {
            const index = this.standardList.findIndex(item => item.id === standard.id);
            if (index !== -1) {
              this.standardList[index] = { ...this.standardList[index], ...standard } as CheckStandard;
            }
          } else {
            // 如果是新增操作，刷新列表
            await this.fetchStandardList();
          }
          return response.data;
        } else {
          throw new Error(response.message || '保存点检标准失败');
        }
      } catch (error) {
        console.error('保存点检标准失败', error);
        throw error;
      }
    },
    
    // 删除点检标准
    async deleteStandard(id: string) {
      try {
        const response = await deleteStandard(id);
        if (response.code === 200) {
          const index = this.standardList.findIndex(item => item.id === id);
          if (index !== -1) {
            this.standardList.splice(index, 1);
          }
          return true;
        } else {
          throw new Error(response.message || '删除点检标准失败');
        }
      } catch (error) {
        console.error('删除点检标准失败', error);
        throw error;
      }
    },
    
    // 获取点检记录列表
    async fetchRecordList() {
      try {
        const response = await getRecordList();
        if (response.code === 200) {
          this.recordList = response.data;
        } else {
          throw new Error(response.message || '获取点检记录列表失败');
        }
      } catch (error) {
        console.error('获取点检记录列表失败', error);
        throw error;
      }
    },
    
    // 获取点检记录详情
    async fetchRecordDetail(id: string) {
      try {
        const response = await getRecordDetail(id);
        if (response.code === 200) {
          this.currentRecord = response.data;
          return response.data;
        } else {
          throw new Error(response.message || '获取点检记录详情失败');
        }
      } catch (error) {
        console.error('获取点检记录详情失败', error);
        throw error;
      }
    },
    
    // 保存点检记录
    async saveRecord(record: Partial<CheckRecord>) {
      try {
        const response = await saveRecord(record);
        if (response.code === 200) {
          // 如果是更新操作
          if (record.id) {
            const index = this.recordList.findIndex(item => item.id === record.id);
            if (index !== -1) {
              this.recordList[index] = { ...this.recordList[index], ...record } as CheckRecord;
            }
          } else {
            // 如果是新增操作，刷新列表
            await this.fetchRecordList();
          }
          return response.data;
        } else {
          throw new Error(response.message || '保存点检记录失败');
        }
      } catch (error) {
        console.error('保存点检记录失败', error);
        throw error;
      }
    },
    
    // 删除点检记录
    async deleteRecord(id: string) {
      try {
        const response = await deleteRecord(id);
        if (response.code === 200) {
          const index = this.recordList.findIndex(item => item.id === id);
          if (index !== -1) {
            this.recordList.splice(index, 1);
          }
          return true;
        } else {
          throw new Error(response.message || '删除点检记录失败');
        }
      } catch (error) {
        console.error('删除点检记录失败', error);
        throw error;
      }
    }
  }
}); 