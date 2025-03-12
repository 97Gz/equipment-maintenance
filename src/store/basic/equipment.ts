import { defineStore } from 'pinia';
import { equipmentApi } from '../../utils/mock/api';

// 设备接口
export interface Equipment {
  id: string;
  name: string;
  typeId: string;
  typeName: string;
  workshopId: string;
  workshopName: string;
  status: string;
  purchaseDate: string;
  warrantyPeriod: string;
  maintenanceCycle: number;
  lastMaintenanceDate: string;
  nextMaintenanceDate: string;
  createTime?: string;
  updateTime?: string;
}

// 设备状态枚举
export enum EquipmentStatus {
  NORMAL = '正常',
  MAINTENANCE = '维修中',
  FAULT = '故障',
  SCRAPPED = '已报废'
}

// 设备存储
export const useEquipmentStore = defineStore('equipment', {
  state: () => ({
    equipmentList: [] as Equipment[],
    currentEquipment: null as Equipment | null
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
        // 直接从mock API获取数据
        const result = await equipmentApi.getList();
        if (result.code === 200) {
          this.equipmentList = result.data;
        } else {
          throw new Error(result.message || '获取设备列表失败');
        }
      } catch (error) {
        console.error('获取设备列表失败', error);
        throw error;
      }
    },
    
    // 获取设备详情
    async fetchEquipmentDetail(id: string) {
      try {
        // 直接从mock API获取数据
        const result = await equipmentApi.getDetail(id);
        if (result.code === 200) {
          this.currentEquipment = result.data;
          return result.data;
        } else {
          throw new Error(result.message || '获取设备详情失败');
        }
      } catch (error) {
        console.error('获取设备详情失败', error);
        throw error;
      }
    },
    
    // 保存设备
    async saveEquipment(equipment: Partial<Equipment>) {
      try {
        // 直接从mock API获取数据
        const result = await equipmentApi.save(equipment);
        if (result.code === 200) {
          // 如果是更新操作
          if (equipment.id) {
            const index = this.equipmentList.findIndex(item => item.id === equipment.id);
            if (index !== -1) {
              this.equipmentList[index] = { ...this.equipmentList[index], ...equipment } as Equipment;
            }
          } else {
            // 如果是新增操作，刷新列表
            await this.fetchEquipmentList();
          }
          return result.data;
        } else {
          throw new Error(result.message || '保存设备失败');
        }
      } catch (error) {
        console.error('保存设备失败', error);
        throw error;
      }
    },
    
    // 删除设备
    async deleteEquipment(id: string) {
      try {
        // 直接从mock API获取数据
        const result = await equipmentApi.delete(id);
        if (result.code === 200) {
          const index = this.equipmentList.findIndex(item => item.id === id);
          if (index !== -1) {
            this.equipmentList.splice(index, 1);
          }
          return true;
        } else {
          throw new Error(result.message || '删除设备失败');
        }
      } catch (error) {
        console.error('删除设备失败', error);
        throw error;
      }
    }
  }
}); 