import { defineStore } from 'pinia';
import { spareUseApi } from '../../utils/mock/api';

// 备件使用记录接口
export interface SpareUse {
  id: string;
  sparePartId: string;
  sparePartName: string;
  equipmentId: string;
  equipmentName: string;
  useDate: string;
  useQuantity: number;
  usePerson: string;
  useReason: string;
  createTime?: string;
  updateTime?: string;
}

// 备件使用记录存储
export const useSpareUseStore = defineStore('spareUse', {
  state: () => ({
    spareUseList: [] as SpareUse[],
    currentSpareUse: null as SpareUse | null
  }),
  
  getters: {
    // 获取备件使用记录列表
    getSpareUseList: (state) => state.spareUseList,
    
    // 获取当前选中的备件使用记录
    getCurrentSpareUse: (state) => state.currentSpareUse
  },
  
  actions: {
    // 获取备件使用记录列表
    async fetchSpareUseList(sparePartId?: string, equipmentId?: string) {
      try {
        // 直接从mock API获取数据
        const result = await spareUseApi.getList(sparePartId, equipmentId);
        if (result.code === 200) {
          this.spareUseList = result.data;
        } else {
          throw new Error(result.message || '获取备件使用记录列表失败');
        }
      } catch (error) {
        console.error('获取备件使用记录列表失败', error);
        throw error;
      }
    },
    
    // 获取备件使用记录详情
    async fetchSpareUseDetail(id: string) {
      try {
        // 直接从mock API获取数据
        const result = await spareUseApi.getDetail(id);
        if (result.code === 200) {
          this.currentSpareUse = result.data;
          return result.data;
        } else {
          throw new Error(result.message || '获取备件使用记录详情失败');
        }
      } catch (error) {
        console.error('获取备件使用记录详情失败', error);
        throw error;
      }
    },
    
    // 保存备件使用记录
    async saveSpareUse(spareUse: Partial<SpareUse>) {
      try {
        // 直接从mock API获取数据
        const result = await spareUseApi.save(spareUse);
        if (result.code === 200) {
          // 如果是更新操作
          if (spareUse.id) {
            const index = this.spareUseList.findIndex(item => item.id === spareUse.id);
            if (index !== -1) {
              this.spareUseList[index] = { ...this.spareUseList[index], ...spareUse } as SpareUse;
            }
          } else {
            // 如果是新增操作，刷新列表
            await this.fetchSpareUseList();
          }
          return result.data;
        } else {
          throw new Error(result.message || '保存备件使用记录失败');
        }
      } catch (error) {
        console.error('保存备件使用记录失败', error);
        throw error;
      }
    },
    
    // 删除备件使用记录
    async deleteSpareUse(id: string) {
      try {
        // 直接从mock API获取数据
        const result = await spareUseApi.delete(id);
        if (result.code === 200) {
          const index = this.spareUseList.findIndex(item => item.id === id);
          if (index !== -1) {
            this.spareUseList.splice(index, 1);
          }
          return true;
        } else {
          throw new Error(result.message || '删除备件使用记录失败');
        }
      } catch (error) {
        console.error('删除备件使用记录失败', error);
        throw error;
      }
    }
  }
});