import { defineStore } from 'pinia';
import { mockEquipmentList, equipmentFixApi } from '../utils/mock/equipment-fix';

// 创建设备Store
export const useEquipmentFixStore = defineStore('equipment-fix', {
  state: () => ({
    equipmentList: [] as any[],
    currentEquipment: null as any
  }),
  
  getters: {
    // 获取设备列表
    getEquipmentList: (state) => state.equipmentList,
    
    // 获取当前选中的设备
    getCurrentEquipment: (state) => state.currentEquipment
  },
  
  actions: {
    // 获取设备列表
    async fetchEquipmentList() {
      try {
        console.log('EquipmentFixStore: 开始获取设备列表');
        
        const response = await equipmentFixApi.getList();
        console.log('EquipmentFixStore: 设备列表响应:', response);
        
        if (response.code === 200) {
          this.equipmentList = response.data;
          console.log('EquipmentFixStore: 设备列表数据已更新:', this.equipmentList);
        } else {
          console.error('EquipmentFixStore: 获取设备列表失败:', response.message);
          throw new Error(response.message || '获取设备列表失败');
        }
      } catch (error) {
        console.error('EquipmentFixStore: 获取设备列表异常', error);
        throw error;
      }
    },
    
    // 获取设备详情
    async fetchEquipmentDetail(id: string) {
      try {
        console.log('EquipmentFixStore: 开始获取设备详情, id:', id);
        
        const response = await equipmentFixApi.getDetail(id);
        console.log('EquipmentFixStore: 设备详情响应:', response);
        
        if (response.code === 200) {
          this.currentEquipment = response.data;
          console.log('EquipmentFixStore: 当前设备数据已更新:', this.currentEquipment);
          return response.data;
        } else {
          console.error('EquipmentFixStore: 获取设备详情失败:', response.message);
          throw new Error(response.message || '获取设备详情失败');
        }
      } catch (error) {
        console.error('EquipmentFixStore: 获取设备详情异常', error);
        throw error;
      }
    },
    
    // 清除当前设备
    clearCurrentEquipment() {
      this.currentEquipment = null;
    }
  }
}); 