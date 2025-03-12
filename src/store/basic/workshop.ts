import { defineStore } from 'pinia';
import { workshopApi } from '../../utils/mock/api';

// 车间接口
export interface Workshop {
  id: string;
  name: string;
  createTime?: string;
  updateTime?: string;
}

// 车间存储
export const useWorkshopStore = defineStore('workshop', {
  state: () => ({
    workshopList: [] as Workshop[],
    currentWorkshop: null as Workshop | null
  }),
  
  getters: {
    // 获取车间列表
    getWorkshopList: (state) => state.workshopList,
    
    // 获取当前选中的车间
    getCurrentWorkshop: (state) => state.currentWorkshop
  },
  
  actions: {
    // 获取车间列表
    async fetchWorkshopList() {
      try {
        // 直接从mock API获取数据
        const result = await workshopApi.getList();
        if (result.code === 200) {
          this.workshopList = result.data;
        } else {
          throw new Error(result.message || '获取车间列表失败');
        }
      } catch (error) {
        console.error('获取车间列表失败', error);
        throw error;
      }
    },
    
    // 获取车间详情
    async fetchWorkshopDetail(id: string) {
      try {
        // 直接从mock API获取数据
        const result = await workshopApi.getDetail(id);
        if (result.code === 200) {
          this.currentWorkshop = result.data;
          return result.data;
        } else {
          throw new Error(result.message || '获取车间详情失败');
        }
      } catch (error) {
        console.error('获取车间详情失败', error);
        throw error;
      }
    },
    
    // 保存车间
    async saveWorkshop(workshop: Partial<Workshop>) {
      try {
        // 直接从mock API获取数据
        const result = await workshopApi.save(workshop);
        if (result.code === 200) {
          // 如果是更新操作
          if (workshop.id) {
            const index = this.workshopList.findIndex(item => item.id === workshop.id);
            if (index !== -1) {
              this.workshopList[index] = { ...this.workshopList[index], ...workshop } as Workshop;
            }
          } else {
            // 如果是新增操作，刷新列表
            await this.fetchWorkshopList();
          }
          return result.data;
        } else {
          throw new Error(result.message || '保存车间失败');
        }
      } catch (error) {
        console.error('保存车间失败', error);
        throw error;
      }
    },
    
    // 删除车间
    async deleteWorkshop(id: string) {
      try {
        // 直接从mock API获取数据
        const result = await workshopApi.delete(id);
        if (result.code === 200) {
          const index = this.workshopList.findIndex(item => item.id === id);
          if (index !== -1) {
            this.workshopList.splice(index, 1);
          }
          return true;
        } else {
          throw new Error(result.message || '删除车间失败');
        }
      } catch (error) {
        console.error('删除车间失败', error);
        throw error;
      }
    }
  }
}); 