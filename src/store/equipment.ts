import { defineStore } from 'pinia';
import { getEquipmentList, getEquipmentDetail } from '../api/equipment';

export interface Equipment {
  id: string;
  code: string;         // 设备编号
  type: string;          // 设备类型
  name: string;          // 设备名称
  status: 'normal' | 'warning' | 'repairing' | 'standby' | 'disabled' | 'scrapped';  // 设备状态：正常运行、带病运行、维修中、备用、停用、报废
  model: string;         // 规格型号
  image?: string;        // 设备图片
  workshop: string;      // 使用车间
  location: string;      // 安装地点
  manager: string;       // 设备负责人
  managerContact: string; // 设备负责人联系方式
  manufacturer: string;  // 生产厂商
  purchaseDate: string;  // 购买日期
  supplier: {            // 供应商信息
    id: string;
    code: string;
    name: string;
  };
  enableDate: string;    // 启用日期
  checkInfo: {           // 点检信息
    standardName: string; // 点检标准名称
    standardCode: string; // 点检标准编码
    lastCheckTime: string; // 最近点检时间
  };
  patrolInfo: {          // 巡检信息
    planName: string;     // 巡检方案名称
    planCode: string;     // 巡检方案编码
    scheduledDate: string; // 规定巡检日期
    lastPatrolTime: string; // 最近巡检时间
    dailyCount: number;    // 当天规定巡检次数
  };
  repairInfo: {           // 维修信息
    lastRepairTime: string; // 最近维修日期
  };
  maintenanceInfo: {       // 保养信息
    lastMaintenanceTime: string; // 最近保养日期
  };
  scrapInfo: {             // 报废信息
    scrapTime: string;     // 报废时间
  };
}

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
        console.log('Store: 开始获取设备列表');
        
        const response = await getEquipmentList();
        console.log('Store: 设备列表API响应:', response);
        
        if (response.code === 200) {
          this.equipmentList = response.data;
          console.log('Store: 设备列表数据已更新:', this.equipmentList);
        } else {
          console.error('Store: 获取设备列表失败:', response.message);
          throw new Error(response.message || '获取设备列表失败');
        }
      } catch (error) {
        console.error('Store: 获取设备列表异常', error);
        throw error;
      }
    },
    
    // 获取设备详情
    async fetchEquipmentDetail(id: string) {
      try {
        console.log('Store: 开始获取设备详情, id:', id);
        
        const response = await getEquipmentDetail(id);
        console.log('Store: 设备详情API响应:', response);
        
        if (response.code === 200) {
          this.currentEquipment = response.data;
          console.log('Store: 当前设备数据已更新:', this.currentEquipment);
          return response.data;
        } else {
          console.error('Store: 获取设备详情失败:', response.message);
          throw new Error(response.message || '获取设备详情失败');
        }
      } catch (error) {
        console.error('Store: 获取设备详情异常', error);
        throw error;
      }
    },
    
    // 清除当前设备
    clearCurrentEquipment() {
      this.currentEquipment = null;
    }
  }
}); 