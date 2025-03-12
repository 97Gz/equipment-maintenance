import { defineStore } from 'pinia';
import { sparePartApi } from '../../utils/mock/api';

// 备件接口
export interface SparePart {
  id: string;
  name: string;
  model: string;
  specification: string;
  unit: string;
  price: number;
  quantity: number;
  warehouseId: string;
  warehouseName: string;
  supplierId: string;
  supplierName: string;
  createTime?: string;
  updateTime?: string;
}

// 备件存储
export const useSparePartStore = defineStore('sparePart', {
  state: () => ({
    sparePartList: [] as SparePart[],
    currentSparePart: null as SparePart | null
  }),
  
  getters: {
    // 获取备件列表
    getSparePartList: (state) => state.sparePartList,
    
    // 获取当前选中的备件
    getCurrentSparePart: (state) => state.currentSparePart
  },
  
  actions: {
    // 获取备件列表
    async fetchSparePartList() {
      try {
        // 直接从mock API获取数据
        const result = await sparePartApi.getList();
        if (result.code === 200) {
          this.sparePartList = result.data;
        } else {
          throw new Error(result.message || '获取备件列表失败');
        }
      } catch (error) {
        console.error('获取备件列表失败', error);
        throw error;
      }
    },
    
    // 获取备件详情
    async fetchSparePartDetail(id: string) {
      try {
        // 直接从mock API获取数据
        const result = await sparePartApi.getDetail(id);
        if (result.code === 200) {
          this.currentSparePart = result.data;
          return result.data;
        } else {
          throw new Error(result.message || '获取备件详情失败');
        }
      } catch (error) {
        console.error('获取备件详情失败', error);
        throw error;
      }
    },
    
    // 保存备件
    async saveSparePart(sparePart: Partial<SparePart>) {
      try {
        // 直接从mock API获取数据
        const result = await sparePartApi.save(sparePart);
        if (result.code === 200) {
          // 如果是更新操作
          if (sparePart.id) {
            const index = this.sparePartList.findIndex(item => item.id === sparePart.id);
            if (index !== -1) {
              this.sparePartList[index] = { ...this.sparePartList[index], ...sparePart } as SparePart;
            }
          } else {
            // 如果是新增操作，刷新列表
            await this.fetchSparePartList();
          }
          return result.data;
        } else {
          throw new Error(result.message || '保存备件失败');
        }
      } catch (error) {
        console.error('保存备件失败', error);
        throw error;
      }
    },
    
    // 删除备件
    async deleteSparePart(id: string) {
      try {
        // 直接从mock API获取数据
        const result = await sparePartApi.delete(id);
        if (result.code === 200) {
          const index = this.sparePartList.findIndex(item => item.id === id);
          if (index !== -1) {
            this.sparePartList.splice(index, 1);
          }
          return true;
        } else {
          throw new Error(result.message || '删除备件失败');
        }
      } catch (error) {
        console.error('删除备件失败', error);
        throw error;
      }
    }
  }
}); 