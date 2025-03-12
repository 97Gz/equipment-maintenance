import { mockEquipmentTypes, mockEquipmentNames, mockWorkshops, mockWarehouses } from './basic';

// 通用响应接口
interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

// 成功响应
function successResponse<T>(data: T): ApiResponse<T> {
  return {
    code: 200,
    message: 'success',
    data
  };
}

// 错误响应
function errorResponse<T>(message: string): ApiResponse<T> {
  return {
    code: 500,
    message,
    data: null as unknown as T
  };
}

// 模拟API延迟
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 设备类型API
export const equipmentTypeApi = {
  // 获取设备类型列表
  async getList(): Promise<ApiResponse<typeof mockEquipmentTypes>> {
    await delay(50);
    return successResponse(mockEquipmentTypes);
  },
  
  // 获取设备类型详情
  async getDetail(id: string): Promise<ApiResponse<typeof mockEquipmentTypes[0] | null>> {
    await delay(50);
    const equipmentType = mockEquipmentTypes.find(item => item.id === id);
    if (equipmentType) {
      return successResponse(equipmentType);
    }
    return errorResponse('设备类型不存在');
  },
  
  // 保存设备类型
  async save(data: Partial<typeof mockEquipmentTypes[0]>): Promise<ApiResponse<typeof mockEquipmentTypes[0]>> {
    await delay(50);
    if (data.id) {
      // 更新
      const index = mockEquipmentTypes.findIndex(item => item.id === data.id);
      if (index !== -1) {
        mockEquipmentTypes[index] = { ...mockEquipmentTypes[index], ...data, updateTime: new Date().toLocaleString() };
        return successResponse(mockEquipmentTypes[index]);
      }
      return errorResponse('设备类型不存在');
    } else {
      // 新增
      const newId = 'ET' + (mockEquipmentTypes.length + 1).toString().padStart(3, '0');
      const now = new Date().toLocaleString();
      const newEquipmentType = {
        id: newId,
        typeName: data.typeName || '',
        createTime: now,
        updateTime: now
      };
      mockEquipmentTypes.push(newEquipmentType);
      return successResponse(newEquipmentType);
    }
  },
  
  // 删除设备类型
  async delete(id: string): Promise<ApiResponse<boolean>> {
    await delay(50);
    const index = mockEquipmentTypes.findIndex(item => item.id === id);
    if (index !== -1) {
      mockEquipmentTypes.splice(index, 1);
      return successResponse(true);
    }
    return errorResponse('设备类型不存在');
  }
};

// 设备名称API
export const equipmentNameApi = {
  // 获取设备名称列表
  async getList(): Promise<ApiResponse<typeof mockEquipmentNames>> {
    await delay(50);
    return successResponse(mockEquipmentNames);
  },
  
  // 获取设备名称详情
  async getDetail(id: string): Promise<ApiResponse<typeof mockEquipmentNames[0] | null>> {
    await delay(50);
    const equipmentName = mockEquipmentNames.find(item => item.id === id);
    if (equipmentName) {
      return successResponse(equipmentName);
    }
    return errorResponse('设备名称不存在');
  },
  
  // 保存设备名称
  async save(data: Partial<typeof mockEquipmentNames[0]>): Promise<ApiResponse<typeof mockEquipmentNames[0]>> {
    await delay(50);
    if (data.id) {
      // 更新
      const index = mockEquipmentNames.findIndex(item => item.id === data.id);
      if (index !== -1) {
        // 如果更新了类型ID，需要更新类型名称
        let typeName = mockEquipmentNames[index].typeName;
        if (data.typeId && data.typeId !== mockEquipmentNames[index].typeId) {
          const equipmentType = mockEquipmentTypes.find(item => item.id === data.typeId);
          if (equipmentType) {
            typeName = equipmentType.typeName;
          }
        }
        
        mockEquipmentNames[index] = { 
          ...mockEquipmentNames[index], 
          ...data, 
          typeName,
          updateTime: new Date().toLocaleString() 
        };
        return successResponse(mockEquipmentNames[index]);
      }
      return errorResponse('设备名称不存在');
    } else {
      // 新增
      const newId = 'EN' + (mockEquipmentNames.length + 1).toString().padStart(3, '0');
      const now = new Date().toLocaleString();
      
      // 获取类型名称
      let typeName = '';
      if (data.typeId) {
        const equipmentType = mockEquipmentTypes.find(item => item.id === data.typeId);
        if (equipmentType) {
          typeName = equipmentType.typeName;
        }
      }
      
      const newEquipmentName = {
        id: newId,
        name: data.name || '',
        typeId: data.typeId || '',
        typeName,
        createTime: now,
        updateTime: now
      };
      mockEquipmentNames.push(newEquipmentName);
      return successResponse(newEquipmentName);
    }
  },
  
  // 删除设备名称
  async delete(id: string): Promise<ApiResponse<boolean>> {
    await delay(50);
    const index = mockEquipmentNames.findIndex(item => item.id === id);
    if (index !== -1) {
      mockEquipmentNames.splice(index, 1);
      return successResponse(true);
    }
    return errorResponse('设备名称不存在');
  }
};

// 车间API
export const workshopApi = {
  // 获取车间列表
  getList: async () => {
    return {
      code: 200,
      message: 'success',
      data: [
        {
          id: '1',
          name: '机加工车间',
          createTime: '2023-01-01 12:00:00',
          updateTime: '2023-01-01 12:00:00'
        },
        {
          id: '2',
          name: '装配车间',
          createTime: '2023-01-02 12:00:00',
          updateTime: '2023-01-02 12:00:00'
        },
        {
          id: '3',
          name: '测试车间',
          createTime: '2023-01-03 12:00:00',
          updateTime: '2023-01-03 12:00:00'
        }
      ]
    };
  },
  
  // 获取车间详情
  getDetail: async (id: string) => {
    const list = [
      {
        id: '1',
        name: '机加工车间',
        createTime: '2023-01-01 12:00:00',
        updateTime: '2023-01-01 12:00:00'
      },
      {
        id: '2',
        name: '装配车间',
        createTime: '2023-01-02 12:00:00',
        updateTime: '2023-01-02 12:00:00'
      },
      {
        id: '3',
        name: '测试车间',
        createTime: '2023-01-03 12:00:00',
        updateTime: '2023-01-03 12:00:00'
      }
    ];
    
    const item = list.find(item => item.id === id);
    
    return {
      code: item ? 200 : 404,
      message: item ? 'success' : '车间不存在',
      data: item || null
    };
  },
  
  // 保存车间
  save: async (workshop: any) => {
    // 模拟保存操作
    return {
      code: 200,
      message: 'success',
      data: {
        ...workshop,
        id: workshop.id || String(Date.now()),
        createTime: workshop.createTime || new Date().toISOString(),
        updateTime: new Date().toISOString()
      }
    };
  },
  
  // 删除车间
  delete: async (id: string) => {
    // 模拟删除操作
    return {
      code: 200,
      message: 'success',
      data: null
    };
  }
};

// 仓库API
export const warehouseApi = {
  // 获取仓库列表
  getList: async () => {
    return {
      code: 200,
      message: 'success',
      data: [
        {
          id: '1',
          name: '主仓库',
          location: '上海市浦东新区',
          manager: '张三',
          createTime: '2023-01-01 12:00:00',
          updateTime: '2023-01-01 12:00:00'
        },
        {
          id: '2',
          name: '备用仓库',
          location: '上海市嘉定区',
          manager: '李四',
          createTime: '2023-01-02 12:00:00',
          updateTime: '2023-01-02 12:00:00'
        },
        {
          id: '3',
          name: '零部件仓库',
          location: '上海市松江区',
          manager: '王五',
          createTime: '2023-01-03 12:00:00',
          updateTime: '2023-01-03 12:00:00'
        }
      ]
    };
  },
  
  // 获取仓库详情
  getDetail: async (id: string) => {
    const list = [
      {
        id: '1',
        name: '主仓库',
        location: '上海市浦东新区',
        manager: '张三',
        createTime: '2023-01-01 12:00:00',
        updateTime: '2023-01-01 12:00:00'
      },
      {
        id: '2',
        name: '备用仓库',
        location: '上海市嘉定区',
        manager: '李四',
        createTime: '2023-01-02 12:00:00',
        updateTime: '2023-01-02 12:00:00'
      },
      {
        id: '3',
        name: '零部件仓库',
        location: '上海市松江区',
        manager: '王五',
        createTime: '2023-01-03 12:00:00',
        updateTime: '2023-01-03 12:00:00'
      }
    ];
    
    const item = list.find(item => item.id === id);
    
    return {
      code: item ? 200 : 404,
      message: item ? 'success' : '仓库不存在',
      data: item || null
    };
  },
  
  // 保存仓库
  save: async (warehouse: any) => {
    // 模拟保存操作
    return {
      code: 200,
      message: 'success',
      data: {
        ...warehouse,
        id: warehouse.id || String(Date.now()),
        createTime: warehouse.createTime || new Date().toISOString(),
        updateTime: new Date().toISOString()
      }
    };
  },
  
  // 删除仓库
  delete: async (id: string) => {
    // 模拟删除操作
    return {
      code: 200,
      message: 'success',
      data: null
    };
  }
};

// 供应商API
export const supplierApi = {
  // 获取供应商列表
  getList: async () => {
    return {
      code: 200,
      message: 'success',
      data: [
        {
          id: '1',
          name: '上海机械设备有限公司',
          contact: '张三',
          phone: '13800138000',
          address: '上海市浦东新区张江高科技园区',
          createTime: '2023-01-01 12:00:00',
          updateTime: '2023-01-01 12:00:00'
        },
        {
          id: '2',
          name: '北京工业设备制造有限公司',
          contact: '李四',
          phone: '13900139000',
          address: '北京市海淀区中关村科技园',
          createTime: '2023-01-02 12:00:00',
          updateTime: '2023-01-02 12:00:00'
        },
        {
          id: '3',
          name: '广州精密仪器有限公司',
          contact: '王五',
          phone: '13700137000',
          address: '广州市天河区科技园',
          createTime: '2023-01-03 12:00:00',
          updateTime: '2023-01-03 12:00:00'
        }
      ]
    };
  },
  
  // 获取供应商详情
  getDetail: async (id: string) => {
    const list = [
      {
        id: '1',
        name: '上海机械设备有限公司',
        contact: '张三',
        phone: '13800138000',
        address: '上海市浦东新区张江高科技园区',
        createTime: '2023-01-01 12:00:00',
        updateTime: '2023-01-01 12:00:00'
      },
      {
        id: '2',
        name: '北京工业设备制造有限公司',
        contact: '李四',
        phone: '13900139000',
        address: '北京市海淀区中关村科技园',
        createTime: '2023-01-02 12:00:00',
        updateTime: '2023-01-02 12:00:00'
      },
      {
        id: '3',
        name: '广州精密仪器有限公司',
        contact: '王五',
        phone: '13700137000',
        address: '广州市天河区科技园',
        createTime: '2023-01-03 12:00:00',
        updateTime: '2023-01-03 12:00:00'
      }
    ];
    
    const item = list.find(item => item.id === id);
    
    return {
      code: item ? 200 : 404,
      message: item ? 'success' : '供应商不存在',
      data: item || null
    };
  },
  
  // 保存供应商
  save: async (supplier: any) => {
    // 模拟保存操作
    return {
      code: 200,
      message: 'success',
      data: {
        ...supplier,
        id: supplier.id || String(Date.now()),
        createTime: supplier.createTime || new Date().toISOString(),
        updateTime: new Date().toISOString()
      }
    };
  },
  
  // 删除供应商
  delete: async (id: string) => {
    // 模拟删除操作
    return {
      code: 200,
      message: 'success',
      data: null
    };
  }
};

// 设备API
export const equipmentApi = {
  // 获取设备列表
  getList: async () => {
    return {
      code: 200,
      message: 'success',
      data: [
        {
          id: '1',
          name: '数控车床',
          typeId: '1',
          typeName: '加工设备',
          workshopId: '1',
          workshopName: '机加工车间',
          status: '正常',
          purchaseDate: '2022-01-01',
          warrantyPeriod: '2025-01-01',
          maintenanceCycle: 30,
          lastMaintenanceDate: '2023-05-01',
          nextMaintenanceDate: '2023-06-01',
          createTime: '2023-01-01 12:00:00',
          updateTime: '2023-01-01 12:00:00'
        },
        {
          id: '2',
          name: '铣床',
          typeId: '1',
          typeName: '加工设备',
          workshopId: '1',
          workshopName: '机加工车间',
          status: '维修中',
          purchaseDate: '2022-02-01',
          warrantyPeriod: '2025-02-01',
          maintenanceCycle: 60,
          lastMaintenanceDate: '2023-04-01',
          nextMaintenanceDate: '2023-06-01',
          createTime: '2023-01-02 12:00:00',
          updateTime: '2023-01-02 12:00:00'
        },
        {
          id: '3',
          name: '装配线',
          typeId: '2',
          typeName: '装配设备',
          workshopId: '2',
          workshopName: '装配车间',
          status: '正常',
          purchaseDate: '2022-03-01',
          warrantyPeriod: '2025-03-01',
          maintenanceCycle: 90,
          lastMaintenanceDate: '2023-03-01',
          nextMaintenanceDate: '2023-06-01',
          createTime: '2023-01-03 12:00:00',
          updateTime: '2023-01-03 12:00:00'
        }
      ]
    };
  },
  
  // 获取设备详情
  getDetail: async (id: string) => {
    const list = [
      {
        id: '1',
        name: '数控车床',
        typeId: '1',
        typeName: '加工设备',
        workshopId: '1',
        workshopName: '机加工车间',
        status: '正常',
        purchaseDate: '2022-01-01',
        warrantyPeriod: '2025-01-01',
        maintenanceCycle: 30,
        lastMaintenanceDate: '2023-05-01',
        nextMaintenanceDate: '2023-06-01',
        createTime: '2023-01-01 12:00:00',
        updateTime: '2023-01-01 12:00:00'
      },
      {
        id: '2',
        name: '铣床',
        typeId: '1',
        typeName: '加工设备',
        workshopId: '1',
        workshopName: '机加工车间',
        status: '维修中',
        purchaseDate: '2022-02-01',
        warrantyPeriod: '2025-02-01',
        maintenanceCycle: 60,
        lastMaintenanceDate: '2023-04-01',
        nextMaintenanceDate: '2023-06-01',
        createTime: '2023-01-02 12:00:00',
        updateTime: '2023-01-02 12:00:00'
      },
      {
        id: '3',
        name: '装配线',
        typeId: '2',
        typeName: '装配设备',
        workshopId: '2',
        workshopName: '装配车间',
        status: '正常',
        purchaseDate: '2022-03-01',
        warrantyPeriod: '2025-03-01',
        maintenanceCycle: 90,
        lastMaintenanceDate: '2023-03-01',
        nextMaintenanceDate: '2023-06-01',
        createTime: '2023-01-03 12:00:00',
        updateTime: '2023-01-03 12:00:00'
      }
    ];
    
    const item = list.find(item => item.id === id);
    
    return {
      code: item ? 200 : 404,
      message: item ? 'success' : '设备不存在',
      data: item || null
    };
  },
  
  // 保存设备
  save: async (equipment: any) => {
    // 模拟保存操作
    return {
      code: 200,
      message: 'success',
      data: {
        ...equipment,
        id: equipment.id || String(Date.now()),
        createTime: equipment.createTime || new Date().toISOString(),
        updateTime: new Date().toISOString()
      }
    };
  },
  
  // 删除设备
  delete: async (id: string) => {
    // 模拟删除操作
    return {
      code: 200,
      message: 'success',
      data: null
    };
  }
};

// 维护记录API
export const maintenanceRecordApi = {
  // 获取维护记录列表
  getList: async (equipmentId?: string) => {
    const list = [
      {
        id: '1',
        equipmentId: '1',
        equipmentName: '数控车床',
        maintenanceType: '定期维护',
        maintenanceDate: '2023-05-01',
        maintenanceResult: '已完成',
        maintenancePerson: '张三',
        description: '更换润滑油，清洁设备',
        cost: 500,
        nextMaintenanceDate: '2023-06-01',
        createTime: '2023-05-01 12:00:00',
        updateTime: '2023-05-01 12:00:00'
      },
      {
        id: '2',
        equipmentId: '2',
        equipmentName: '铣床',
        maintenanceType: '故障维修',
        maintenanceDate: '2023-04-15',
        maintenanceResult: '已完成',
        maintenancePerson: '李四',
        description: '更换电机，调整传动装置',
        cost: 2000,
        nextMaintenanceDate: '2023-06-15',
        createTime: '2023-04-15 12:00:00',
        updateTime: '2023-04-15 12:00:00'
      },
      {
        id: '3',
        equipmentId: '3',
        equipmentName: '装配线',
        maintenanceType: '例行检查',
        maintenanceDate: '2023-04-20',
        maintenanceResult: '已完成',
        maintenancePerson: '王五',
        description: '检查传送带，调整速度',
        cost: 300,
        nextMaintenanceDate: '2023-05-20',
        createTime: '2023-04-20 12:00:00',
        updateTime: '2023-04-20 12:00:00'
      }
    ];
    
    // 如果有设备ID，则过滤
    const filteredList = equipmentId ? list.filter(item => item.equipmentId === equipmentId) : list;
    
    return {
      code: 200,
      message: 'success',
      data: filteredList
    };
  },
  
  // 获取维护记录详情
  getDetail: async (id: string) => {
    const list = [
      {
        id: '1',
        equipmentId: '1',
        equipmentName: '数控车床',
        maintenanceType: '定期维护',
        maintenanceDate: '2023-05-01',
        maintenanceResult: '已完成',
        maintenancePerson: '张三',
        description: '更换润滑油，清洁设备',
        cost: 500,
        nextMaintenanceDate: '2023-06-01',
        createTime: '2023-05-01 12:00:00',
        updateTime: '2023-05-01 12:00:00'
      },
      {
        id: '2',
        equipmentId: '2',
        equipmentName: '铣床',
        maintenanceType: '故障维修',
        maintenanceDate: '2023-04-15',
        maintenanceResult: '已完成',
        maintenancePerson: '李四',
        description: '更换电机，调整传动装置',
        cost: 2000,
        nextMaintenanceDate: '2023-06-15',
        createTime: '2023-04-15 12:00:00',
        updateTime: '2023-04-15 12:00:00'
      },
      {
        id: '3',
        equipmentId: '3',
        equipmentName: '装配线',
        maintenanceType: '例行检查',
        maintenanceDate: '2023-04-20',
        maintenanceResult: '已完成',
        maintenancePerson: '王五',
        description: '检查传送带，调整速度',
        cost: 300,
        nextMaintenanceDate: '2023-05-20',
        createTime: '2023-04-20 12:00:00',
        updateTime: '2023-04-20 12:00:00'
      }
    ];
    
    const item = list.find(item => item.id === id);
    
    return {
      code: item ? 200 : 404,
      message: item ? 'success' : '维护记录不存在',
      data: item || null
    };
  },
  
  // 保存维护记录
  save: async (maintenanceRecord: any) => {
    // 模拟保存操作
    return {
      code: 200,
      message: 'success',
      data: {
        ...maintenanceRecord,
        id: maintenanceRecord.id || String(Date.now()),
        createTime: maintenanceRecord.createTime || new Date().toISOString(),
        updateTime: new Date().toISOString()
      }
    };
  },
  
  // 删除维护记录
  delete: async (id: string) => {
    // 模拟删除操作
    return {
      code: 200,
      message: 'success',
      data: null
    };
  }
};

// 维护计划API
export const maintenancePlanApi = {
  // 获取维护计划列表
  getList: async (equipmentId?: string) => {
    const list = [
      {
        id: '1',
        equipmentId: '1',
        equipmentName: '数控车床',
        planName: '数控车床季度维护',
        planType: '定期维护',
        planDate: '2023-06-01',
        planPerson: '张三',
        description: '对数控车床进行季度维护，包括更换润滑油，清洁设备等',
        status: '待执行',
        createTime: '2023-05-01 12:00:00',
        updateTime: '2023-05-01 12:00:00'
      },
      {
        id: '2',
        equipmentId: '2',
        equipmentName: '铣床',
        planName: '铣床电机检查',
        planType: '专项维护',
        planDate: '2023-06-15',
        planPerson: '李四',
        description: '检查铣床电机运行状况，必要时进行更换',
        status: '待执行',
        createTime: '2023-05-02 12:00:00',
        updateTime: '2023-05-02 12:00:00'
      },
      {
        id: '3',
        equipmentId: '3',
        equipmentName: '装配线',
        planName: '装配线例行检查',
        planType: '例行检查',
        planDate: '2023-05-20',
        planPerson: '王五',
        description: '对装配线进行例行检查，确保正常运行',
        status: '执行中',
        createTime: '2023-05-03 12:00:00',
        updateTime: '2023-05-03 12:00:00'
      }
    ];
    
    // 如果有设备ID，则过滤
    const filteredList = equipmentId ? list.filter(item => item.equipmentId === equipmentId) : list;
    
    return {
      code: 200,
      message: 'success',
      data: filteredList
    };
  },
  
  // 获取维护计划详情
  getDetail: async (id: string) => {
    const list = [
      {
        id: '1',
        equipmentId: '1',
        equipmentName: '数控车床',
        planName: '数控车床季度维护',
        planType: '定期维护',
        planDate: '2023-06-01',
        planPerson: '张三',
        description: '对数控车床进行季度维护，包括更换润滑油，清洁设备等',
        status: '待执行',
        createTime: '2023-05-01 12:00:00',
        updateTime: '2023-05-01 12:00:00'
      },
      {
        id: '2',
        equipmentId: '2',
        equipmentName: '铣床',
        planName: '铣床电机检查',
        planType: '专项维护',
        planDate: '2023-06-15',
        planPerson: '李四',
        description: '检查铣床电机运行状况，必要时进行更换',
        status: '待执行',
        createTime: '2023-05-02 12:00:00',
        updateTime: '2023-05-02 12:00:00'
      },
      {
        id: '3',
        equipmentId: '3',
        equipmentName: '装配线',
        planName: '装配线例行检查',
        planType: '例行检查',
        planDate: '2023-05-20',
        planPerson: '王五',
        description: '对装配线进行例行检查，确保正常运行',
        status: '执行中',
        createTime: '2023-05-03 12:00:00',
        updateTime: '2023-05-03 12:00:00'
      }
    ];
    
    const item = list.find(item => item.id === id);
    
    return {
      code: item ? 200 : 404,
      message: item ? 'success' : '维护计划不存在',
      data: item || null
    };
  },
  
  // 保存维护计划
  save: async (maintenancePlan: any) => {
    // 模拟保存操作
    return {
      code: 200,
      message: 'success',
      data: {
        ...maintenancePlan,
        id: maintenancePlan.id || String(Date.now()),
        createTime: maintenancePlan.createTime || new Date().toISOString(),
        updateTime: new Date().toISOString()
      }
    };
  },
  
  // 删除维护计划
  delete: async (id: string) => {
    // 模拟删除操作
    return {
      code: 200,
      message: 'success',
      data: null
    };
  }
};

// 备件API
export const sparePartApi = {
  // 获取备件列表
  getList: async () => {
    return {
      code: 200,
      message: 'success',
      data: [
        {
          id: '1',
          name: '轴承',
          model: 'ZC-001',
          specification: '10mm*20mm',
          unit: '个',
          price: 50,
          quantity: 100,
          warehouseId: '1',
          warehouseName: '主仓库',
          supplierId: '1',
          supplierName: '上海机械设备有限公司',
          createTime: '2023-01-01 12:00:00',
          updateTime: '2023-01-01 12:00:00'
        },
        {
          id: '2',
          name: '电机',
          model: 'DJ-002',
          specification: '220V 1.5KW',
          unit: '台',
          price: 1200,
          quantity: 20,
          warehouseId: '1',
          warehouseName: '主仓库',
          supplierId: '2',
          supplierName: '北京工业设备制造有限公司',
          createTime: '2023-01-02 12:00:00',
          updateTime: '2023-01-02 12:00:00'
        },
        {
          id: '3',
          name: '传感器',
          model: 'CG-003',
          specification: '温度传感器 -50~150℃',
          unit: '个',
          price: 80,
          quantity: 50,
          warehouseId: '3',
          warehouseName: '零部件仓库',
          supplierId: '3',
          supplierName: '广州精密仪器有限公司',
          createTime: '2023-01-03 12:00:00',
          updateTime: '2023-01-03 12:00:00'
        }
      ]
    };
  },
  
  // 获取备件详情
  getDetail: async (id: string) => {
    const list = [
      {
        id: '1',
        name: '轴承',
        model: 'ZC-001',
        specification: '10mm*20mm',
        unit: '个',
        price: 50,
        quantity: 100,
        warehouseId: '1',
        warehouseName: '主仓库',
        supplierId: '1',
        supplierName: '上海机械设备有限公司',
        createTime: '2023-01-01 12:00:00',
        updateTime: '2023-01-01 12:00:00'
      },
      {
        id: '2',
        name: '电机',
        model: 'DJ-002',
        specification: '220V 1.5KW',
        unit: '台',
        price: 1200,
        quantity: 20,
        warehouseId: '1',
        warehouseName: '主仓库',
        supplierId: '2',
        supplierName: '北京工业设备制造有限公司',
        createTime: '2023-01-02 12:00:00',
        updateTime: '2023-01-02 12:00:00'
      },
      {
        id: '3',
        name: '传感器',
        model: 'CG-003',
        specification: '温度传感器 -50~150℃',
        unit: '个',
        price: 80,
        quantity: 50,
        warehouseId: '3',
        warehouseName: '零部件仓库',
        supplierId: '3',
        supplierName: '广州精密仪器有限公司',
        createTime: '2023-01-03 12:00:00',
        updateTime: '2023-01-03 12:00:00'
      }
    ];
    
    const item = list.find(item => item.id === id);
    
    return {
      code: item ? 200 : 404,
      message: item ? 'success' : '备件不存在',
      data: item || null
    };
  },
  
  // 保存备件
  save: async (sparePart: any) => {
    // 模拟保存操作
    return {
      code: 200,
      message: 'success',
      data: {
        ...sparePart,
        id: sparePart.id || String(Date.now()),
        createTime: sparePart.createTime || new Date().toISOString(),
        updateTime: new Date().toISOString()
      }
    };
  },
  
  // 删除备件
  delete: async (id: string) => {
    // 模拟删除操作
    return {
      code: 200,
      message: 'success',
      data: null
    };
  }
};

// 备件使用记录API
export const spareUseApi = {
  // 获取备件使用记录列表
  getList: async (sparePartId?: string, equipmentId?: string) => {
    const list = [
      {
        id: '1',
        sparePartId: '1',
        sparePartName: '轴承',
        equipmentId: '1',
        equipmentName: '数控车床',
        useDate: '2023-05-01',
        useQuantity: 2,
        usePerson: '张三',
        useReason: '更换磨损轴承',
        createTime: '2023-05-01 12:00:00',
        updateTime: '2023-05-01 12:00:00'
      },
      {
        id: '2',
        sparePartId: '2',
        sparePartName: '电机',
        equipmentId: '2',
        equipmentName: '铣床',
        useDate: '2023-04-15',
        useQuantity: 1,
        usePerson: '李四',
        useReason: '更换损坏电机',
        createTime: '2023-04-15 12:00:00',
        updateTime: '2023-04-15 12:00:00'
      },
      {
        id: '3',
        sparePartId: '3',
        sparePartName: '传感器',
        equipmentId: '3',
        equipmentName: '装配线',
        useDate: '2023-04-20',
        useQuantity: 3,
        usePerson: '王五',
        useReason: '更换失效传感器',
        createTime: '2023-04-20 12:00:00',
        updateTime: '2023-04-20 12:00:00'
      }
    ];
    
    // 根据条件过滤
    let filteredList = list;
    if (sparePartId) {
      filteredList = filteredList.filter(item => item.sparePartId === sparePartId);
    }
    if (equipmentId) {
      filteredList = filteredList.filter(item => item.equipmentId === equipmentId);
    }
    
    return {
      code: 200,
      message: 'success',
      data: filteredList
    };
  },
  
  // 获取备件使用记录详情
  getDetail: async (id: string) => {
    const list = [
      {
        id: '1',
        sparePartId: '1',
        sparePartName: '轴承',
        equipmentId: '1',
        equipmentName: '数控车床',
        useDate: '2023-05-01',
        useQuantity: 2,
        usePerson: '张三',
        useReason: '更换磨损轴承',
        createTime: '2023-05-01 12:00:00',
        updateTime: '2023-05-01 12:00:00'
      },
      {
        id: '2',
        sparePartId: '2',
        sparePartName: '电机',
        equipmentId: '2',
        equipmentName: '铣床',
        useDate: '2023-04-15',
        useQuantity: 1,
        usePerson: '李四',
        useReason: '更换损坏电机',
        createTime: '2023-04-15 12:00:00',
        updateTime: '2023-04-15 12:00:00'
      },
      {
        id: '3',
        sparePartId: '3',
        sparePartName: '传感器',
        equipmentId: '3',
        equipmentName: '装配线',
        useDate: '2023-04-20',
        useQuantity: 3,
        usePerson: '王五',
        useReason: '更换失效传感器',
        createTime: '2023-04-20 12:00:00',
        updateTime: '2023-04-20 12:00:00'
      }
    ];
    
    const item = list.find(item => item.id === id);
    
    return {
      code: item ? 200 : 404,
      message: item ? 'success' : '备件使用记录不存在',
      data: item || null
    };
  },
  
  // 保存备件使用记录
  save: async (spareUse: any) => {
    // 模拟保存操作
    return {
      code: 200,
      message: 'success',
      data: {
        ...spareUse,
        id: spareUse.id || String(Date.now()),
        createTime: spareUse.createTime || new Date().toISOString(),
        updateTime: new Date().toISOString()
      }
    };
  },
  
  // 删除备件使用记录
  delete: async (id: string) => {
    // 模拟删除操作
    return {
      code: 200,
      message: 'success',
      data: null
    };
  }
}; 