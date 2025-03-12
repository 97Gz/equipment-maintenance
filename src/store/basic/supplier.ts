import { defineStore } from 'pinia';
import { supplierApi } from '../../utils/mock/api';

// 供应商接口
export interface Supplier {
  id: string;
  name: string;
  contact: string;
  phone: string;
  address: string;
  createTime?: string;
  updateTime?: string;
}

// 供应商存储
export const useSupplierStore = defineStore('supplier', {
  state: () => ({
    supplierList: [] as Supplier[],
    currentSupplier: null as Supplier | null
  }),
  
  getters: {
    // 获取供应商列表
    getSupplierList: (state) => state.supplierList,
    
    // 获取当前选中的供应商
    getCurrentSupplier: (state) => state.currentSupplier
  },
  
  actions: {
    // 获取供应商列表
    async fetchSupplierList() {
      try {
        // 直接从mock API获取数据
        const result = await supplierApi.getList();
        if (result.code === 200) {
          this.supplierList = result.data;
        } else {
          throw new Error(result.message || '获取供应商列表失败');
        }
      } catch (error) {
        console.error('获取供应商列表失败', error);
        throw error;
      }
    },
    
    // 获取供应商详情
    async fetchSupplierDetail(id: string) {
      try {
        // 直接从mock API获取数据
        const result = await supplierApi.getDetail(id);
        if (result.code === 200) {
          this.currentSupplier = result.data;
          return result.data;
        } else {
          throw new Error(result.message || '获取供应商详情失败');
        }
      } catch (error) {
        console.error('获取供应商详情失败', error);
        throw error;
      }
    },
    
    // 保存供应商
    async saveSupplier(supplier: Partial<Supplier>) {
      try {
        // 直接从mock API获取数据
        const result = await supplierApi.save(supplier);
        if (result.code === 200) {
          // 如果是更新操作
          if (supplier.id) {
            const index = this.supplierList.findIndex(item => item.id === supplier.id);
            if (index !== -1) {
              this.supplierList[index] = { ...this.supplierList[index], ...supplier } as Supplier;
            }
          } else {
            // 如果是新增操作，刷新列表
            await this.fetchSupplierList();
          }
          return result.data;
        } else {
          throw new Error(result.message || '保存供应商失败');
        }
      } catch (error) {
        console.error('保存供应商失败', error);
        throw error;
      }
    },
    
    // 删除供应商
    async deleteSupplier(id: string) {
      try {
        // 直接从mock API获取数据
        const result = await supplierApi.delete(id);
        if (result.code === 200) {
          const index = this.supplierList.findIndex(item => item.id === id);
          if (index !== -1) {
            this.supplierList.splice(index, 1);
          }
          return true;
        } else {
          throw new Error(result.message || '删除供应商失败');
        }
      } catch (error) {
        console.error('删除供应商失败', error);
        throw error;
      }
    }
  }
}); 