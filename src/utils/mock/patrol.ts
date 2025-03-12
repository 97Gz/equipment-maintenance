// 定义与store中相同的类型接口，避免循环依赖

// 巡检方案接口
export type PatrolPlan = {
  id: string;
  name: string;          // 巡检方案名称
  frequencyType: string; // 巡检频率类型: interval-固定时间间隔, weekly-每周几, monthly-每月几号
  intervalDays?: number; // 巡检周期天数（frequencyType=interval时有效）
  weekDay?: number;      // 每周几（frequencyType=weekly时有效）
  monthDay?: number;     // 每月几号（frequencyType=monthly时有效）
  firstTime: string;     // 首次巡检时间
  nextTime: string;      // 再次巡检时间
  items: PatrolPlanItem[];
  createTime: string;
  updateTime: string;
}

// 巡检方案项目接口
export type PatrolPlanItem = {
  id: string;
  name: string;     // 巡检项
  method: string;   // 检查方法
  minValue: number; // 最小值
  maxValue: number; // 最大值
}

// 巡检单接口
export type PatrolRecord = {
  id: string;
  equipmentId: string;   // 设备ID
  equipmentCode: string; // 设备编码
  equipmentName: string; // 设备名称
  workshop: string;      // 使用车间
  location?: string;     // 安装地点
  planId: string;        // 巡检方案ID
  planName: string;      // 巡检方案名称
  frequencyType: string; // 巡检频率类型
  patrolTime: string;    // 巡检时间
  items: PatrolRecordItem[];
  result: string;        // 巡检结果：normal-正常, abnormal-异常
  equipmentStatus: string; // 设备状态：normal-正常运行, warning-带病运行, repair-维修中, standby-备用, stop-停用, scrap-报废
  createTime: string;
  updateTime: string;
  remark?: string;       // 备注
}

// 巡检记录项目接口
export type PatrolRecordItem = {
  id: string;
  planItemId?: string; // 关联的方案项目ID
  name: string;     // 检查项
  method: string;   // 检查方法
  standard?: string; // 检查标准
  minValue?: number; // 最小值
  maxValue?: number; // 最大值
  value?: string;   // 检查值
  result: string;   // 检查结果：normal-正常, abnormal-异常
  remark?: string;  // 备注，当结果为异常时填写
}

// 巡检方案的mock数据
export const mockPatrolPlans: PatrolPlan[] = [
  {
    id: '1',
    name: '数控车床巡检方案',
    frequencyType: 'interval',  // 固定时间间隔
    intervalDays: 7,            // 7天巡检一次
    firstTime: '2023-06-01',    // 首次巡检时间
    nextTime: '2023-06-08',     // 再次巡检时间
    items: [
      {
        id: '101',
        name: '电机温度检查',
        method: '红外测温仪测量',
        minValue: 0,
        maxValue: 60
      },
      {
        id: '102',
        name: '主轴转速检查',
        method: '转速表测量',
        minValue: 900,
        maxValue: 1100
      },
      {
        id: '103',
        name: '液压系统压力检查',
        method: '压力表读数',
        minValue: 5,
        maxValue: 10
      }
    ],
    createTime: '2023-05-15 10:00:00',
    updateTime: '2023-05-15 10:00:00'
  },
  {
    id: '2',
    name: '铣床巡检方案',
    frequencyType: 'weekly',    // 每周几
    weekDay: 1,                 // 周一
    firstTime: '2023-05-08',    // 首次巡检时间
    nextTime: '2023-05-15',     // 再次巡检时间
    items: [
      {
        id: '201',
        name: '电机电流检查',
        method: '电流表测量',
        minValue: 10,
        maxValue: 15
      },
      {
        id: '202',
        name: '刀具磨损检查',
        method: '目视检查',
        minValue: 0,
        maxValue: 0.5
      },
      {
        id: '203',
        name: '冷却液液位检查',
        method: '液位计读数',
        minValue: 80,
        maxValue: 100
      }
    ],
    createTime: '2023-05-01 14:30:00',
    updateTime: '2023-05-01 14:30:00'
  },
  {
    id: '3',
    name: '注塑机巡检方案',
    frequencyType: 'monthly',   // 每月几号
    monthDay: 1,                // 每月1号
    firstTime: '2023-06-01',    // 首次巡检时间
    nextTime: '2023-07-01',     // 再次巡检时间
    items: [
      {
        id: '301',
        name: '油温检查',
        method: '温度计测量',
        minValue: 40,
        maxValue: 70
      },
      {
        id: '302',
        name: '油压检查',
        method: '压力表读数',
        minValue: 8,
        maxValue: 12
      },
      {
        id: '303',
        name: '电控系统检查',
        method: '功能测试',
        minValue: 0,
        maxValue: 0
      }
    ],
    createTime: '2023-05-20 09:15:00',
    updateTime: '2023-05-20 09:15:00'
  }
];

// 巡检单的mock数据
export const mockPatrolRecords: PatrolRecord[] = [
  {
    id: '1',
    equipmentId: '1',
    equipmentCode: 'NC-001',
    equipmentName: '数控车床',
    workshop: '机加工车间',
    location: 'A区1号位',
    planId: '1',
    planName: '数控车床巡检方案',
    frequencyType: 'interval',
    patrolTime: '2023-06-01 09:00:00',
    items: [
      {
        id: '101',
        name: '电机温度检查',
        method: '红外测温仪测量',
        minValue: 0,
        maxValue: 60,
        result: 'normal'
      },
      {
        id: '102',
        name: '主轴转速检查',
        method: '转速表测量',
        minValue: 900,
        maxValue: 1100,
        result: 'normal'
      },
      {
        id: '103',
        name: '液压系统压力检查',
        method: '压力表读数',
        minValue: 5,
        maxValue: 10,
        result: 'normal'
      }
    ],
    result: 'normal',         // 巡检结果：正常
    equipmentStatus: 'normal', // 设备状态：正常运行
    createTime: '2023-06-01 09:00:00',
    updateTime: '2023-06-01 10:30:00'
  },
  {
    id: '2',
    equipmentId: '2',
    equipmentCode: 'M-001',
    equipmentName: '铣床',
    workshop: '机加工车间',
    location: 'A区2号位',
    planId: '2',
    planName: '铣床巡检方案',
    frequencyType: 'weekly',
    patrolTime: '2023-05-08 10:30:00',
    items: [
      {
        id: '201',
        name: '电机电流检查',
        method: '电流表测量',
        minValue: 10,
        maxValue: 15,
        result: 'normal'
      },
      {
        id: '202',
        name: '刀具磨损检查',
        method: '目视检查',
        minValue: 0,
        maxValue: 0.5,
        result: 'abnormal',
        remark: '刀具磨损超标，需要更换'
      },
      {
        id: '203',
        name: '冷却液液位检查',
        method: '液位计读数',
        minValue: 80,
        maxValue: 100,
        result: 'normal'
      }
    ],
    result: 'abnormal',     // 巡检结果：异常
    equipmentStatus: 'warning', // 设备状态：带病运行
    createTime: '2023-05-08 10:30:00',
    updateTime: '2023-05-08 11:45:00'
  },
  {
    id: '3',
    equipmentId: '3',
    equipmentCode: 'IM-001',
    equipmentName: '注塑机',
    workshop: '注塑车间',
    location: 'B区1号位',
    planId: '3',
    planName: '注塑机巡检方案',
    frequencyType: 'monthly',
    patrolTime: '2023-06-01 14:00:00',
    items: [
      {
        id: '301',
        name: '油温检查',
        method: '温度计测量',
        minValue: 40,
        maxValue: 70,
        result: 'abnormal',
        remark: '油温过高，需检查冷却系统'
      },
      {
        id: '302',
        name: '油压检查',
        method: '压力表读数',
        minValue: 8,
        maxValue: 12,
        result: 'normal'
      },
      {
        id: '303',
        name: '电控系统检查',
        method: '功能测试',
        minValue: 0,
        maxValue: 0,
        result: 'normal'
      }
    ],
    result: 'abnormal',   // 巡检结果：异常
    equipmentStatus: 'repair', // 设备状态：维修中
    createTime: '2023-06-01 14:00:00',
    updateTime: '2023-06-01 15:20:00'
  }
];

// 巡检方案API
export const patrolPlanApi = {
  getList: async () => {
    return mockPatrolPlans;
  },
  getDetail: async (id: string) => {
    return mockPatrolPlans.find(item => item.id === id);
  },
  save: async (data: Partial<PatrolPlan>) => {
    if (data.id) {
      const index = mockPatrolPlans.findIndex(item => item.id === data.id);
      if (index > -1) {
        mockPatrolPlans[index] = { ...mockPatrolPlans[index], ...data } as PatrolPlan;
        return mockPatrolPlans[index];
      }
    }
    const newPlan = {
      ...data,
      id: String(mockPatrolPlans.length + 1),
      createTime: new Date().toISOString(),
      updateTime: new Date().toISOString()
    } as PatrolPlan;
    mockPatrolPlans.push(newPlan);
    return newPlan;
  },
  delete: async (id: string) => {
    const index = mockPatrolPlans.findIndex(item => item.id === id);
    if (index > -1) {
      mockPatrolPlans.splice(index, 1);
    }
    return true;
  }
};

// 巡检记录API
export const patrolRecordApi = {
  getList: async () => {
    return mockPatrolRecords;
  },
  getDetail: async (id: string) => {
    return mockPatrolRecords.find(item => item.id === id);
  },
  save: async (data: Partial<PatrolRecord>) => {
    if (data.id) {
      const index = mockPatrolRecords.findIndex(item => item.id === data.id);
      if (index > -1) {
        mockPatrolRecords[index] = { ...mockPatrolRecords[index], ...data } as PatrolRecord;
        return mockPatrolRecords[index];
      }
    }
    const newRecord = {
      ...data,
      id: String(mockPatrolRecords.length + 1),
      createTime: new Date().toISOString(),
      updateTime: new Date().toISOString()
    } as PatrolRecord;
    mockPatrolRecords.push(newRecord);
    return newRecord;
  },
  delete: async (id: string) => {
    const index = mockPatrolRecords.findIndex(item => item.id === id);
    if (index > -1) {
      mockPatrolRecords.splice(index, 1);
    }
    return true;
  }
}; 