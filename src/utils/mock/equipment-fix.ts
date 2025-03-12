import { defineStore } from 'pinia';

// 设备列表的mock数据
export const mockEquipmentList = [
  {
    id: '1',
    code: 'CNC-001',
    name: '数控车床',
    type: '机床设备',
    model: 'CNC-1000',
    status: 'normal' as 'normal' | 'warning' | 'repairing' | 'standby' | 'disabled' | 'scrapped',
    workshop: '机加工车间',
    location: 'A区1号',
    manager: '张三',
    managerContact: '13800138001',
    manufacturer: '上海机械设备有限公司',
    purchaseDate: '2022-01-01',
    enableDate: '2022-01-15',
    supplier: {
      id: '1',
      name: '上海机械设备有限公司',
      code: 'SUP001'
    },
    checkInfo: {
      standardName: '数控车床点检标准',
      standardCode: 'STD-CNC-001',
      lastCheckTime: '2023-06-01 09:00:00'
    },
    patrolInfo: {
      planName: '机床设备巡检方案',
      planCode: 'PLN-CNC-001',
      scheduledDate: '每周一、三、五',
      lastPatrolTime: '2023-06-05 10:30:00',
      dailyCount: 3
    },
    repairInfo: {
      lastRepairTime: '2023-05-10 14:20:00'
    },
    maintenanceInfo: {
      lastMaintenanceTime: '2023-04-15 09:45:00'
    },
    scrapInfo: {
      scrapTime: ''
    },
    createTime: '2023-01-01 12:00:00',
    updateTime: '2023-01-01 12:00:00'
  },
  {
    id: '2',
    code: 'MILL-001',
    name: '铣床',
    type: '机床设备',
    model: 'ML-500',
    status: 'warning' as 'normal' | 'warning' | 'repairing' | 'standby' | 'disabled' | 'scrapped',
    workshop: '机加工车间',
    location: 'A区2号',
    manager: '李四',
    managerContact: '13800138002',
    manufacturer: '北京工业设备制造有限公司',
    purchaseDate: '2022-02-01',
    enableDate: '2022-02-15',
    supplier: {
      id: '2',
      name: '北京工业设备制造有限公司',
      code: 'SUP002'
    },
    checkInfo: {
      standardName: '铣床点检标准',
      standardCode: 'STD-MILL-001',
      lastCheckTime: '2023-06-02 10:30:00'
    },
    patrolInfo: {
      planName: '机床设备巡检方案',
      planCode: 'PLN-CNC-001',
      scheduledDate: '每周二、四',
      lastPatrolTime: '2023-06-06 11:15:00',
      dailyCount: 2
    },
    repairInfo: {
      lastRepairTime: '2023-05-20 16:30:00'
    },
    maintenanceInfo: {
      lastMaintenanceTime: '2023-04-20 10:00:00'
    },
    scrapInfo: {
      scrapTime: ''
    },
    createTime: '2023-01-02 12:00:00',
    updateTime: '2023-01-02 12:00:00'
  },
  {
    id: '3',
    code: 'ELEC-001',
    name: '配电柜',
    type: '电力设备',
    model: 'PD-2000',
    status: 'normal' as 'normal' | 'warning' | 'repairing' | 'standby' | 'disabled' | 'scrapped',
    workshop: '电气车间',
    location: 'B区1号',
    manager: '王五',
    managerContact: '13800138003',
    manufacturer: '广州精密仪器有限公司',
    purchaseDate: '2022-03-01',
    enableDate: '2022-03-15',
    supplier: {
      id: '3',
      name: '广州精密仪器有限公司',
      code: 'SUP003'
    },
    checkInfo: {
      standardName: '电气设备点检标准',
      standardCode: 'STD-ELEC-001',
      lastCheckTime: '2023-06-03 14:15:00'
    },
    patrolInfo: {
      planName: '电气设备巡检方案',
      planCode: 'PLN-ELEC-001',
      scheduledDate: '每天',
      lastPatrolTime: '2023-06-07 09:00:00',
      dailyCount: 1
    },
    repairInfo: {
      lastRepairTime: '2023-05-05 11:30:00'
    },
    maintenanceInfo: {
      lastMaintenanceTime: '2023-04-25 14:20:00'
    },
    scrapInfo: {
      scrapTime: ''
    },
    createTime: '2023-01-03 12:00:00',
    updateTime: '2023-01-03 12:00:00'
  }
];

// 设备API
export const equipmentFixApi = {
  // 获取设备列表
  getList: async () => {
    return {
      code: 200,
      message: 'success',
      data: mockEquipmentList
    };
  },
  
  // 获取设备详情
  getDetail: async (id: string) => {
    const item = mockEquipmentList.find(item => item.id === id);
    
    return {
      code: item ? 200 : 404,
      message: item ? 'success' : '设备不存在',
      data: item || null
    };
  }
};

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