import { defineStore } from 'pinia';
import { equipmentNameApi } from '../../utils/mock/api';

// 设备名称接口
export interface EquipmentName {
  id: string;
  name: string;
  typeId: string;
  typeName: string;
  createTime?: string;
  updateTime?: string;
}

// 设备名称存储
export const useEquipmentNameStore = defineStore('equipmentName', {
  state: () => ({
    equipmentNameList: [] as EquipmentName[],
    currentEquipmentName: null as EquipmentName | null
  }),
  
  getters: {
    // 获取设备名称列表
    getEquipmentNameList: (state) => state.equipmentNameList,
    
    // 获取当前选中的设备名称
    getCurrentEquipmentName: (state) => state.currentEquipmentName
  },
  
  actions: {
    // 获取设备名称列表
    async fetchEquipmentNameList() {
      try {
        // 直接从mock API获取数据
        const result = await equipmentNameApi.getList();
        if (result.code === 200) {
          this.equipmentNameList = result.data;
        } else {
          throw new Error(result.message || '获取设备名称列表失败');
        }
      } catch (error) {
        console.error('获取设备名称列表失败', error);
        throw error;
      }
    },
    
    // 获取设备名称详情
    async fetchEquipmentNameDetail(id: string) {
      try {
        // 直接从mock API获取数据
        const result = await equipmentNameApi.getDetail(id);
        if (result.code === 200) {
          this.currentEquipmentName = result.data;
          return result.data;
        } else {
          throw new Error(result.message || '获取设备名称详情失败');
        }
      } catch (error) {
        console.error('获取设备名称详情失败', error);
        throw error;
      }
    },
    
    // 保存设备名称
    async saveEquipmentName(equipmentName: Partial<EquipmentName>) {
      try {
        // 直接从mock API获取数据
        const result = await equipmentNameApi.save(equipmentName);
        if (result.code === 200) {
          // 如果是更新操作
          if (equipmentName.id) {
            const index = this.equipmentNameList.findIndex(item => item.id === equipmentName.id);
            if (index !== -1) {
              this.equipmentNameList[index] = { ...this.equipmentNameList[index], ...equipmentName } as EquipmentName;
            }
          } else {
            // 如果是新增操作，刷新列表
            await this.fetchEquipmentNameList();
          }
          return result.data;
        } else {
          throw new Error(result.message || '保存设备名称失败');
        }
      } catch (error) {
        console.error('保存设备名称失败', error);
        throw error;
      }
    },
    
    // 删除设备名称
    async deleteEquipmentName(id: string) {
      try {
        // 直接从mock API获取数据
        const result = await equipmentNameApi.delete(id);
        if (result.code === 200) {
          const index = this.equipmentNameList.findIndex(item => item.id === id);
          if (index !== -1) {
            this.equipmentNameList.splice(index, 1);
          }
          return true;
        } else {
          throw new Error(result.message || '删除设备名称失败');
        }
      } catch (error) {
        console.error('删除设备名称失败', error);
        throw error;
      }
    }
  }
}); 