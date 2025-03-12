// 点检标准接口
export interface CheckStandard {
  id: string;
  name: string;          // 点检标准名称
  description: string;   // 描述
  items: CheckStandardItem[];
  createTime: string;
  updateTime: string;
}

// 点检标准项目接口
export interface CheckStandardItem {
  id: string;
  name: string;     // 检查项
  method: string;   // 检查方法
  minValue: number; // 最小值
  maxValue: number; // 最大值
}

// 点检记录接口
export interface CheckRecord {
  id: string;
  equipmentId: string;   // 设备ID
  equipmentCode: string; // 设备编码
  equipmentName: string; // 设备名称
  workshop: string;      // 使用车间
  location?: string;     // 安装地点
  standardId: string;    // 点检标准ID
  standardName: string;  // 点检标准名称
  checkTime: string;     // 点检时间
  items: CheckRecordItem[];
  result: string;        // 点检结果：normal-正常, abnormal-异常
  equipmentStatus: string; // 设备状态：normal-正常运行, warning-带病运行, repair-维修中, standby-备用, stop-停用, scrap-报废
  createTime: string;
  updateTime: string;
  remark?: string;       // 备注
}

// 点检记录项目接口
export interface CheckRecordItem {
  id: string;
  standardItemId?: string; // 关联的标准项目ID
  name: string;     // 检查项
  method: string;   // 检查方法
  standard?: string; // 检查标准
  minValue?: number; // 最小值
  maxValue?: number; // 最大值
  value?: string;   // 检查值
  result: string;   // 检查结果：normal-正常, abnormal-异常
  remark?: string;  // 备注，当结果为异常时填写
}

// 点检标准的mock数据
export const mockCheckStandards: CheckStandard[] = [
  {
    id: '1',
    name: '数控车床点检标准',
    description: '数控车床日常点检标准',
    items: [
      {
        id: '101',
        name: '主轴温度',
        method: '红外测温仪测量',
        minValue: 0,
        maxValue: 60
      },
      {
        id: '102',
        name: '冷却液液位',
        method: '目视检查',
        minValue: 80,
        maxValue: 100
      }
    ],
    createTime: '2023-05-15 10:00:00',
    updateTime: '2023-05-15 10:00:00'
  },
  {
    id: '2',
    name: '铣床点检标准',
    description: '铣床日常点检标准',
    items: [
      {
        id: '201',
        name: '工作台平面度',
        method: '水平仪测量',
        minValue: -0.02,
        maxValue: 0.02
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
    updateTime: '2023-05-01 14:30:00'
  }
];

// 点检记录的mock数据
export const mockCheckRecords: CheckRecord[] = [
  {
    id: '1',
    equipmentId: '1',
    equipmentCode: 'CNC-001',
    equipmentName: '数控车床',
    workshop: '机加工车间',
    location: 'A区1号',
    standardId: '1',
    standardName: '数控车床点检标准',
    checkTime: '2023-06-01 09:00:00',
    items: [
      {
        id: '1001',
        standardItemId: '101',
        name: '主轴温度',
        method: '红外测温仪测量',
        standard: '0-60℃',
        minValue: 0,
        maxValue: 60,
        value: '45',
        result: 'normal',
        remark: ''
      },
      {
        id: '1002',
        standardItemId: '102',
        name: '冷却液液位',
        method: '目视检查',
        standard: '80%-100%',
        minValue: 80,
        maxValue: 100,
        value: '90',
        result: 'normal',
        remark: ''
      }
    ],
    result: 'normal',
    equipmentStatus: 'normal',
    createTime: '2023-06-01 09:00:00',
    updateTime: '2023-06-01 09:00:00'
  }
];

// 点检标准API
export const checkStandardApi = {
  getList: async () => {
    return mockCheckStandards;
  },
  getDetail: async (id: string) => {
    return mockCheckStandards.find(item => item.id === id);
  },
  save: async (data: Partial<CheckStandard>) => {
    if (data.id) {
      const index = mockCheckStandards.findIndex(item => item.id === data.id);
      if (index > -1) {
        mockCheckStandards[index] = { ...mockCheckStandards[index], ...data } as CheckStandard;
        return mockCheckStandards[index];
      }
    }
    const newStandard = {
      ...data,
      id: String(mockCheckStandards.length + 1),
      createTime: new Date().toISOString(),
      updateTime: new Date().toISOString()
    } as CheckStandard;
    mockCheckStandards.push(newStandard);
    return newStandard;
  },
  delete: async (id: string) => {
    const index = mockCheckStandards.findIndex(item => item.id === id);
    if (index > -1) {
      mockCheckStandards.splice(index, 1);
    }
    return true;
  }
};

// 点检记录API
export const checkRecordApi = {
  getList: async () => {
    return mockCheckRecords;
  },
  getDetail: async (id: string) => {
    return mockCheckRecords.find(item => item.id === id);
  },
  save: async (data: Partial<CheckRecord>) => {
    if (data.id) {
      const index = mockCheckRecords.findIndex(item => item.id === data.id);
      if (index > -1) {
        mockCheckRecords[index] = { ...mockCheckRecords[index], ...data } as CheckRecord;
        return mockCheckRecords[index];
      }
    }
    const newRecord = {
      ...data,
      id: String(mockCheckRecords.length + 1),
      createTime: new Date().toISOString(),
      updateTime: new Date().toISOString()
    } as CheckRecord;
    mockCheckRecords.push(newRecord);
    return newRecord;
  },
  delete: async (id: string) => {
    const index = mockCheckRecords.findIndex(item => item.id === id);
    if (index > -1) {
      mockCheckRecords.splice(index, 1);
    }
    return true;
  }
}; 