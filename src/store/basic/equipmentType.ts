import { defineStore } from 'pinia';
import axios from 'axios';
import { equipmentTypeApi } from '../../utils/mock/api';

// 设备类型接口
export interface EquipmentType {
  id: string;
  typeName: string;
  createTime?: string;
  updateTime?: string;
}

// 设备类型存储
export const useEquipmentTypeStore = defineStore('equipmentType', {
  state: () => ({
    equipmentTypeList: [] as EquipmentType[],
    currentEquipmentType: null as EquipmentType | null
  }),
  
  getters: {
    // 获取设备类型列表
    getEquipmentTypeList: (state) => state.equipmentTypeList,
    
    // 获取当前选中的设备类型
    getCurrentEquipmentType: (state) => state.currentEquipmentType
  },
  
  actions: {
    // 获取设备类型列表
    async fetchEquipmentTypeList() {
      try {
        // 直接从mock API获取数据
        const result = await equipmentTypeApi.getList();
        if (result.code === 200) {
          this.equipmentTypeList = result.data;
        } else {
          throw new Error(result.message || '获取设备类型列表失败');
        }
      } catch (error) {
        console.error('获取设备类型列表失败', error);
        throw error;
      }
    },
    
    // 获取设备类型详情
    async fetchEquipmentTypeDetail(id: string) {
      try {
        // 直接从mock API获取数据
        const result = await equipmentTypeApi.getDetail(id);
        if (result.code === 200) {
          this.currentEquipmentType = result.data;
          return result.data;
        } else {
          throw new Error(result.message || '获取设备类型详情失败');
        }
      } catch (error) {
        console.error('获取设备类型详情失败', error);
        throw error;
      }
    },
    
    // 保存设备类型
    async saveEquipmentType(equipmentType: Partial<EquipmentType>) {
      try {
        // 直接从mock API获取数据
        const result = await equipmentTypeApi.save(equipmentType);
        if (result.code === 200) {
          // 如果是更新操作
          if (equipmentType.id) {
            const index = this.equipmentTypeList.findIndex(item => item.id === equipmentType.id);
            if (index !== -1) {
              this.equipmentTypeList[index] = { ...this.equipmentTypeList[index], ...equipmentType } as EquipmentType;
            }
          } else {
            // 如果是新增操作，刷新列表
            await this.fetchEquipmentTypeList();
          }
          return result.data;
        } else {
          throw new Error(result.message || '保存设备类型失败');
        }
      } catch (error) {
        console.error('保存设备类型失败', error);
        throw error;
      }
    },
    
    // 删除设备类型
    async deleteEquipmentType(id: string) {
      try {
        // 直接从mock API获取数据
        const result = await equipmentTypeApi.delete(id);
        if (result.code === 200) {
          const index = this.equipmentTypeList.findIndex(item => item.id === id);
          if (index !== -1) {
            this.equipmentTypeList.splice(index, 1);
          }
          return true;
        } else {
          throw new Error(result.message || '删除设备类型失败');
        }
      } catch (error) {
        console.error('删除设备类型失败', error);
        throw error;
      }
    }
  }
}); 