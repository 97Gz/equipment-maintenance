// 点检标准接口
export interface CheckStandard {
  id: string;
  name: string;          // 点检标准名称
  code: string;          // 点检标准编码
  equipmentType: string; // 设备类型
  description: string;   // 描述
  itemCount: number;     // 检查项数量
  items: CheckStandardItem[];
  createTime: string;
  updateTime: string;
  lastUpdateTime?: string; // 最后更新时间
}

// 点检标准项目接口
export interface CheckStandardItem {
  id: string;
  name: string;     // 检查项
  method: string;   // 检查方法
  minValue: number; // 最小值
  maxValue: number; // 最大值
  unit?: string;    // 单位
}

// 点检记录接口
export interface CheckRecord {
  id: string;
  recordNo: string;      // 点检单号
  equipmentId: string;   // 设备ID
  equipmentCode: string; // 设备编码
  equipmentName: string; // 设备名称
  workshop: string;      // 使用车间
  location?: string;     // 安装地点
  standardId: string;    // 点检标准ID
  standardName: string;  // 点检标准名称
  standardCode: string;  // 点检标准编码
  checkTime: string;     // 点检时间
  checker: string;       // 点检人员
  items: CheckRecordItem[];
  result: string;        // 点检结果：normal-正常, abnormal-异常
  status: string;        // 状态：draft-草稿，submitted-已提交，approved-已审核
  createTime: string;
  updateTime: string;
}

// 点检记录项目接口
export interface CheckRecordItem {
  id: string;
  standardItemId?: string; // 关联的标准项目ID
  name: string;     // 检查项
  method: string;   // 检查方法
  standardRange: string; // 检查标准
  result: string;   // 检查结果
  remark: string;   // 备注
}

// 点检标准的mock数据
export const mockCheckStandards: CheckStandard[] = [
  {
    id: '1',
    name: '数控车床点检标准',
    code: 'STD-CNC-001',
    equipmentType: '机床设备',
    description: '数控车床日常点检标准',
    itemCount: 2,
    items: [
      {
        id: '101',
        name: '主轴温度',
        method: '红外测温仪测量',
        minValue: 0,
        maxValue: 60,
        unit: '℃'
      },
      {
        id: '102',
        name: '冷却液液位',
        method: '目视检查',
        minValue: 80,
        maxValue: 100,
        unit: '%'
      }
    ],
    createTime: '2023-05-15 10:00:00',
    updateTime: '2023-05-15 10:00:00',
    lastUpdateTime: '2023-05-15 10:00:00'
  },
  {
    id: '2',
    name: '铣床点检标准',
    code: 'STD-MILL-001',
    equipmentType: '机床设备',
    description: '铣床日常点检标准',
    itemCount: 2,
    items: [
      {
        id: '201',
        name: '工作台平面度',
        method: '水平仪测量',
        minValue: -0.02,
        maxValue: 0.02,
        unit: 'mm'
      },
      {
        id: '202',
        name: '导轨润滑',
        method: '目视检查',
        minValue: 0,
        maxValue: 0
      }
    ],
    createTime: '2023-05-01 14:30:00',
    updateTime: '2023-05-01 14:30:00',
    lastUpdateTime: '2023-05-01 14:30:00'
  },
  {
    id: '3',
    name: '电气设备点检标准',
    code: 'STD-ELEC-001',
    equipmentType: '电力设备',
    description: '电气设备日常点检标准',
    itemCount: 2,
    items: [
      {
        id: '301',
        name: '电压检测',
        method: '万用表测量',
        minValue: 220,
        maxValue: 240,
        unit: 'V'
      },
      {
        id: '302',
        name: '绝缘检查',
        method: '绝缘电阻测试仪',
        minValue: 0.5,
        maxValue: 999,
        unit: 'MΩ'
      }
    ],
    createTime: '2023-04-20 09:15:00',
    updateTime: '2023-04-20 09:15:00',
    lastUpdateTime: '2023-04-20 09:15:00'
  }
];

// 点检记录的mock数据
export const mockCheckRecords: CheckRecord[] = [
  {
    id: '1',
    recordNo: 'CHK20230601001',
    equipmentId: '1',
    equipmentCode: 'CNC-001',
    equipmentName: '数控车床',
    workshop: '机加工车间',
    location: 'A区1号',
    standardId: '1',
    standardName: '数控车床点检标准',
    standardCode: 'STD-CNC-001',
    checkTime: '2023-06-01 09:00:00',
    checker: '张三',
    items: [
      {
        id: '1001',
        standardItemId: '101',
        name: '主轴温度',
        method: '红外测温仪测量',
        standardRange: '0-60℃',
        result: 'normal',
        remark: ''
      },
      {
        id: '1002',
        standardItemId: '102',
        name: '冷却液液位',
        method: '目视检查',
        standardRange: '80%-100%',
        result: 'normal',
        remark: ''
      }
    ],
    result: 'normal',
    status: 'approved',
    createTime: '2023-06-01 09:00:00',
    updateTime: '2023-06-01 09:00:00'
  },
  {
    id: '2',
    recordNo: 'CHK20230602001',
    equipmentId: '2',
    equipmentCode: 'MILL-001',
    equipmentName: '铣床',
    workshop: '机加工车间',
    location: 'A区2号',
    standardId: '2',
    standardName: '铣床点检标准',
    standardCode: 'STD-MILL-001',
    checkTime: '2023-06-02 10:30:00',
    checker: '李四',
    items: [
      {
        id: '2001',
        standardItemId: '201',
        name: '工作台平面度',
        method: '水平仪测量',
        standardRange: '-0.02mm~0.02mm',
        result: 'abnormal',
        remark: '平面度超标，需要调整'
      },
      {
        id: '2002',
        standardItemId: '202',
        name: '导轨润滑',
        method: '目视检查',
        standardRange: '正常润滑',
        result: 'normal',
        remark: ''
      }
    ],
    result: 'abnormal',
    status: 'approved',
    createTime: '2023-06-02 10:30:00',
    updateTime: '2023-06-02 10:30:00'
  },
  {
    id: '3',
    recordNo: 'CHK20230603001',
    equipmentId: '3',
    equipmentCode: 'ELEC-001',
    equipmentName: '配电柜',
    workshop: '电气车间',
    location: 'B区1号',
    standardId: '3',
    standardName: '电气设备点检标准',
    standardCode: 'STD-ELEC-001',
    checkTime: '2023-06-03 14:15:00',
    checker: '王五',
    items: [
      {
        id: '3001',
        standardItemId: '301',
        name: '电压检测',
        method: '万用表测量',
        standardRange: '220V~240V',
        result: 'normal',
        remark: ''
      },
      {
        id: '3002',
        standardItemId: '302',
        name: '绝缘检查',
        method: '绝缘电阻测试仪',
        standardRange: '≥0.5MΩ',
        result: 'normal',
        remark: ''
      }
    ],
    result: 'normal',
    status: 'approved',
    createTime: '2023-06-03 14:15:00',
    updateTime: '2023-06-03 14:15:00'
  }
];

// 点检标准API - 使用与其他API一致的格式
export const checkStandardApi = {
  // 获取点检标准列表
  getList: async () => {
    return {
      code: 200,
      message: 'success',
      data: mockCheckStandards
    };
  },
  
  // 获取点检标准详情
  getDetail: async (id: string) => {
    const standard = mockCheckStandards.find(item => item.id === id);
    
    return {
      code: standard ? 200 : 404,
      message: standard ? 'success' : '点检标准不存在',
      data: standard || null
    };
  },
  
  // 保存点检标准
  save: async (data: Partial<CheckStandard>) => {
    if (data.id) {
      // 更新
      const index = mockCheckStandards.findIndex(item => item.id === data.id);
      if (index > -1) {
        mockCheckStandards[index] = { 
          ...mockCheckStandards[index], 
          ...data,
          updateTime: new Date().toLocaleString(),
          lastUpdateTime: new Date().toLocaleString()
        } as CheckStandard;
        
        return {
          code: 200,
          message: 'success',
          data: mockCheckStandards[index]
        };
      }
      
      return {
        code: 404,
        message: '点检标准不存在',
        data: null
      };
    }
    
    // 新增
    const newId = String(mockCheckStandards.length + 1);
    const now = new Date().toLocaleString();
    const newStandard = {
      ...data,
      id: newId,
      createTime: now,
      updateTime: now,
      lastUpdateTime: now,
      itemCount: data.items?.length || 0
    } as CheckStandard;
    
    mockCheckStandards.push(newStandard);
    
    return {
      code: 200,
      message: 'success',
      data: newStandard
    };
  },
  
  // 删除点检标准
  delete: async (id: string) => {
    const index = mockCheckStandards.findIndex(item => item.id === id);
    if (index > -1) {
      mockCheckStandards.splice(index, 1);
      
      return {
        code: 200,
        message: 'success',
        data: true
      };
    }
    
    return {
      code: 404,
      message: '点检标准不存在',
      data: false
    };
  }
};

// 点检记录API - 使用与其他API一致的格式
export const checkRecordApi = {
  // 获取点检记录列表
  getList: async () => {
    return {
      code: 200,
      message: 'success',
      data: mockCheckRecords
    };
  },
  
  // 获取点检记录详情
  getDetail: async (id: string) => {
    const record = mockCheckRecords.find(item => item.id === id);
    
    return {
      code: record ? 200 : 404,
      message: record ? 'success' : '点检记录不存在',
      data: record || null
    };
  },
  
  // 保存点检记录
  save: async (data: Partial<CheckRecord>) => {
    if (data.id) {
      // 更新
      const index = mockCheckRecords.findIndex(item => item.id === data.id);
      if (index > -1) {
        mockCheckRecords[index] = { 
          ...mockCheckRecords[index], 
          ...data,
          updateTime: new Date().toLocaleString()
        } as CheckRecord;
        
        return {
          code: 200,
          message: 'success',
          data: mockCheckRecords[index]
        };
      }
      
      return {
        code: 404,
        message: '点检记录不存在',
        data: null
      };
    }
    
    // 新增
    const newId = String(mockCheckRecords.length + 1);
    const now = new Date().toLocaleString();
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const seq = String(mockCheckRecords.length + 1).padStart(3, '0');
    const recordNo = `CHK${year}${month}${day}${seq}`;
    
    const newRecord = {
      ...data,
      id: newId,
      recordNo,
      createTime: now,
      updateTime: now,
      status: data.status || 'draft'
    } as CheckRecord;
    
    mockCheckRecords.push(newRecord);
    
    return {
      code: 200,
      message: 'success',
      data: newRecord
    };
  },
  
  // 删除点检记录
  delete: async (id: string) => {
    const index = mockCheckRecords.findIndex(item => item.id === id);
    if (index > -1) {
      mockCheckRecords.splice(index, 1);
      
      return {
        code: 200,
        message: 'success',
        data: true
      };
    }
    
    return {
      code: 404,
      message: '点检记录不存在',
      data: false
    };
  }
}; 