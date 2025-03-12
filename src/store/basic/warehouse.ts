import { defineStore } from 'pinia';
import { warehouseApi } from '../../utils/mock/api';

// 仓库接口
export interface Warehouse {
  id: string;
  name: string;
  location: string;
  manager: string;
  createTime?: string;
  updateTime?: string;
}

// 仓库存储
export const useWarehouseStore = defineStore('warehouse', {
  state: () => ({
    warehouseList: [] as Warehouse[],
    currentWarehouse: null as Warehouse | null
  }),
  
  getters: {
    // 获取仓库列表
    getWarehouseList: (state) => state.warehouseList,
    
    // 获取当前选中的仓库
    getCurrentWarehouse: (state) => state.currentWarehouse
  },
  
  actions: {
    // 获取仓库列表
    async fetchWarehouseList() {
      try {
        // 直接从mock API获取数据
        const result = await warehouseApi.getList();
        if (result.code === 200) {
          this.warehouseList = result.data;
        } else {
          throw new Error(result.message || '获取仓库列表失败');
        }
      } catch (error) {
        console.error('获取仓库列表失败', error);
        throw error;
      }
    },
    
    // 获取仓库详情
    async fetchWarehouseDetail(id: string) {
      try {
        // 直接从mock API获取数据
        const result = await warehouseApi.getDetail(id);
        if (result.code === 200) {
          this.currentWarehouse = result.data;
          return result.data;
        } else {
          throw new Error(result.message || '获取仓库详情失败');
        }
      } catch (error) {
        console.error('获取仓库详情失败', error);
        throw error;
      }
    },
    
    // 保存仓库
    async saveWarehouse(warehouse: Partial<Warehouse>) {
      try {
        // 直接从mock API获取数据
        const result = await warehouseApi.save(warehouse);
        if (result.code === 200) {
          // 如果是更新操作
          if (warehouse.id) {
            const index = this.warehouseList.findIndex(item => item.id === warehouse.id);
            if (index !== -1) {
              this.warehouseList[index] = { ...this.warehouseList[index], ...warehouse } as Warehouse;
            }
          } else {
            // 如果是新增操作，刷新列表
            await this.fetchWarehouseList();
          }
          return result.data;
        } else {
          throw new Error(result.message || '保存仓库失败');
        }
      } catch (error) {
        console.error('保存仓库失败', error);
        throw error;
      }
    },
    
    // 删除仓库
    async deleteWarehouse(id: string) {
      try {
        // 直接从mock API获取数据
        const result = await warehouseApi.delete(id);
        if (result.code === 200) {
          const index = this.warehouseList.findIndex(item => item.id === id);
          if (index !== -1) {
            this.warehouseList.splice(index, 1);
          }
          return true;
        } else {
          throw new Error(result.message || '删除仓库失败');
        }
      } catch (error) {
        console.error('删除仓库失败', error);
        throw error;
      }
    }
  }
}); 