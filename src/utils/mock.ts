import axios from 'axios';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import type { CheckStandard, CheckRecord, CheckItem, CheckRecordItem } from '../store/check';
import type { Equipment } from '../store/equipment';
import type { DashboardData } from '../store/dashboard';

// 保存原始的Axios get方法以在非mock请求中使用

// 处理模拟请求
export async function handleMockRequest(config: AxiosRequestConfig): Promise<any> {
  const { url, method, data } = config;
  
  // 标准响应格式
  const successResponse = (data: any) => ({
    code: 200,
    message: 'success',
    data
  });
  
  // 错误响应格式
  const errorResponse = (message: string, code = 500) => ({
    code,
    message,
    data: null
  });
  
  // 解析请求数据
  let requestData = {};
  if (data && typeof data === 'string') {
    try {
      requestData = JSON.parse(data);
    } catch (e) {
      console.error('解析请求数据失败', e);
    }
  } else if (data) {
    requestData = data;
  }
  
  try {
    // 设备相关接口
    if (url?.includes('/api/equipment/list')) {
      return successResponse(mockEquipmentList);
    }
    
    if (url?.includes('/api/equipment/detail/')) {
      const id = url.split('/').pop();
      const equipment = mockEquipmentList.find(item => item.id === id);
      return equipment 
        ? successResponse(equipment) 
        : errorResponse('设备不存在');
    }
    
    // 点检标准相关接口
    if (url?.includes('/api/check/standard/list')) {
      return successResponse(mockStandardList);
    }
    
    if (url?.includes('/api/check/standard/detail/')) {
      const id = url.split('/').pop();
      const standard = mockStandardList.find(item => item.id === id);
      return standard 
        ? successResponse(standard) 
        : errorResponse('点检标准不存在');
    }
    
    if (url?.includes('/api/check/standard/save') && method?.toLowerCase() === 'post') {
      const standardData = requestData as Partial<CheckStandard>;
      
      if (standardData.id) {
        // 更新
        const index = mockStandardList.findIndex(item => item.id === standardData.id);
        if (index !== -1) {
          mockStandardList[index] = { ...mockStandardList[index], ...standardData } as CheckStandard;
          return successResponse({ id: standardData.id });
        }
        return errorResponse('点检标准不存在');
      } else {
        // 新增
        const newStandard = {
          ...standardData,
          id: `STD${Date.now()}`,
          createTime: new Date().toISOString()
        } as CheckStandard;
        
        mockStandardList.push(newStandard);
        return successResponse({ id: newStandard.id });
      }
    }
    
    if (url?.includes('/api/check/standard/delete/')) {
      const id = url.split('/').pop();
      const index = mockStandardList.findIndex(item => item.id === id);
      
      if (index !== -1) {
        mockStandardList.splice(index, 1);
        return successResponse(null);
      }
      return errorResponse('点检标准不存在');
    }
    
    // 点检记录相关接口
    if (url?.includes('/api/check/record/list')) {
      return successResponse(mockRecordList);
    }
    
    if (url?.includes('/api/check/record/detail/')) {
      const id = url.split('/').pop();
      const record = mockRecordList.find(item => item.id === id);
      return record 
        ? successResponse(record) 
        : errorResponse('点检记录不存在');
    }
    
    if (url?.includes('/api/check/record/save') && method?.toLowerCase() === 'post') {
      const recordData = requestData as Partial<CheckRecord>;
      
      if (recordData.id) {
        // 更新
        const index = mockRecordList.findIndex(item => item.id === recordData.id);
        if (index !== -1) {
          mockRecordList[index] = { ...mockRecordList[index], ...recordData } as CheckRecord;
          return successResponse({ id: recordData.id });
        }
        return errorResponse('点检记录不存在');
      } else {
        // 新增
        const newRecord = {
          ...recordData,
          id: `REC${Date.now()}`,
          createTime: new Date().toISOString()
        } as CheckRecord;
        
        mockRecordList.push(newRecord);
        return successResponse({ id: newRecord.id });
      }
    }
    
    if (url?.includes('/api/check/record/delete/')) {
      const id = url.split('/').pop();
      const index = mockRecordList.findIndex(item => item.id === id);
      
      if (index !== -1) {
        mockRecordList.splice(index, 1);
        return successResponse(null);
      }
      return errorResponse('点检记录不存在');
    }
    
    // 设备报修接口
    if (url?.includes('/api/equipment/repair') && method?.toLowerCase() === 'post') {
      return successResponse({ id: `REP${Date.now()}` });
    }
    
    // 仪表板数据接口
    if (url?.includes('/api/dashboard/data')) {
      return successResponse(mockDashboardData);
    }
    
    // 未匹配到的API
    return errorResponse('未找到对应的Mock接口');
  } catch (error) {
    console.error('Mock数据处理错误', error);
    return errorResponse('Mock数据处理错误');
  }
}

// 模拟设备列表数据
const mockEquipmentList: Equipment[] = [
  {
    id: 'EQ001',
    type: '机床设备',
    name: 'CNC加工中心',
    status: 'normal',
    model: 'VMC-850',
    image: 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg',
    workshop: '机加工车间',
    location: 'A区-01',
    manager: '张工',
    managerContact: '13800138000',
    manufacturer: '某机床制造有限公司',
    purchaseDate: '2022-01-15',
    enableDate: '2022-02-01',
    checkInfo: {
      standardName: '数控机床日常点检标准',
      standardCode: 'CNC-DAILY-001',
      lastCheckTime: '2023-08-10 09:30:00'
    },
    supplier: {
      id: 'S001',
      code: 'SUP001',
      name: '某机床销售有限公司'
    },
    patrolInfo: {
      planName: '日常巡检',
      planCode: 'P001',
      scheduledDate: '每日',
      lastPatrolTime: '2023-08-25 08:00:00',
      dailyCount: 2
    },
    repairInfo: {
      lastRepairTime: ''
    },
    maintenanceInfo: {
      lastMaintenanceTime: '2023-07-15'
    },
    scrapInfo: {
      scrapTime: ''
    }
  },
  {
    id: 'EQ002',
    type: '注塑设备',
    name: '注塑机B',
    status: 'maintenance',
    model: 'INJ-200',
    image: 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-2.jpeg',
    workshop: '注塑车间',
    location: 'B区-03',
    manager: '李工',
    managerContact: '13900139000',
    manufacturer: '某注塑机制造有限公司',
    purchaseDate: '2022-03-20',
    enableDate: '2022-04-01',
    checkInfo: {
      standardName: '注塑机月度点检标准',
      standardCode: 'INJ-MONTHLY-001',
      lastCheckTime: '2023-08-15 14:20:00'
    },
    supplier: {
      id: 'S002',
      code: 'SUP002',
      name: '某塑料机械有限公司'
    },
    patrolInfo: {
      planName: '日常巡检',
      planCode: 'P001',
      scheduledDate: '每日',
      lastPatrolTime: '2023-08-25 08:30:00',
      dailyCount: 1
    },
    repairInfo: {
      lastRepairTime: '2023-08-18'
    },
    maintenanceInfo: {
      lastMaintenanceTime: '2023-06-20'
    },
    scrapInfo: {
      scrapTime: ''
    }
  },
  {
    id: 'EQ003',
    type: '电力设备',
    name: '配电柜C',
    status: 'normal',
    model: 'PDC-500',
    image: 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-3.jpeg',
    workshop: '动力车间',
    location: 'C区-05',
    manager: '王工',
    managerContact: '13700137000',
    manufacturer: '某电气设备有限公司',
    purchaseDate: '2022-05-10',
    enableDate: '2022-05-20',
    checkInfo: {
      standardName: '电气设备安全点检标准',
      standardCode: 'ELEC-SAFETY-001',
      lastCheckTime: '2023-08-20 10:15:00'
    },
    supplier: {
      id: 'S003',
      code: 'SUP003',
      name: '某电气工程有限公司'
    },
    patrolInfo: {
      planName: '日常巡检',
      planCode: 'P001',
      scheduledDate: '每日',
      lastPatrolTime: '2023-08-25 09:00:00',
      dailyCount: 1
    },
    repairInfo: {
      lastRepairTime: ''
    },
    maintenanceInfo: {
      lastMaintenanceTime: '2023-07-30'
    },
    scrapInfo: {
      scrapTime: ''
    }
  }
];

// 模拟点检标准数据
const mockStandardList: CheckStandard[] = [
  {
    id: 'STD001',
    name: '数控机床日常点检标准',
    code: 'CNC-DAILY-001',
    equipmentType: '机床设备',
    description: '数控机床日常点检标准，主要检查机床的运行状态和基本性能',
    createTime: '2023-06-15 10:30:00',
    items: [
      {
        id: 'ITEM001',
        name: '主轴转速',
        method: '转速表测量',
        minValue: '1000',
        maxValue: '2000',
        unit: 'rpm'
      },
      {
        id: 'ITEM002',
        name: '油压',
        method: '压力表测量',
        minValue: '0.5',
        maxValue: '0.8',
        unit: 'MPa'
      },
      {
        id: 'ITEM003',
        name: '温度',
        method: '温度计测量',
        minValue: '20',
        maxValue: '40',
        unit: '℃'
      },
      {
        id: 'ITEM004',
        name: '噪音',
        method: '噪音计测量',
        minValue: '',
        maxValue: '70',
        unit: 'dB'
      }
    ]
  },
  {
    id: 'STD002',
    name: '注塑机月度点检标准',
    code: 'INJ-MONTHLY-001',
    equipmentType: '注塑设备',
    description: '注塑机月度点检标准，重点检查注塑工艺参数',
    createTime: '2023-07-05 09:15:00',
    items: [
      {
        id: 'ITEM005',
        name: '注射压力',
        method: '压力表测量',
        minValue: '80',
        maxValue: '120',
        unit: 'MPa'
      },
      {
        id: 'ITEM006',
        name: '模具温度',
        method: '温度计测量',
        minValue: '150',
        maxValue: '200',
        unit: '℃'
      },
      {
        id: 'ITEM007',
        name: '锁模力',
        method: '力矩扳手测量',
        minValue: '500',
        maxValue: '800',
        unit: 'kN'
      }
    ]
  },
  {
    id: 'STD003',
    name: '电气设备安全点检标准',
    code: 'ELEC-SAFETY-001',
    equipmentType: '电气设备',
    description: '电气设备安全点检标准，重点检查绝缘性能和接地保护',
    createTime: '2023-07-20 14:45:00',
    items: [
      {
        id: 'ITEM008',
        name: '绝缘电阻',
        method: '兆欧表测量',
        minValue: '0.5',
        maxValue: '',
        unit: 'MΩ'
      },
      {
        id: 'ITEM009',
        name: '接地电阻',
        method: '接地电阻测试仪',
        minValue: '',
        maxValue: '4',
        unit: 'Ω'
      },
      {
        id: 'ITEM010',
        name: '漏电流',
        method: '漏电流测试仪',
        minValue: '',
        maxValue: '30',
        unit: 'mA'
      }
    ]
  }
];

// 模拟点检记录数据
const mockRecordList: CheckRecord[] = [
  {
    id: 'REC001',
    equipmentId: 'EQ001',
    equipmentCode: 'CNC-001',
    equipmentName: '数控车床A',
    workshop: '机加工车间',
    location: 'A区-01',
    standardId: 'STD001',
    standardName: '数控机床日常点检标准',
    standardCode: 'CNC-DAILY-001',
    checkTime: '2023-08-10 09:30:00',
    checker: '张工',
    result: 'normal',
    status: '正常',
    createTime: '2023-08-10 09:45:00',
    items: [
      {
        name: '主轴转速',
        method: '转速表测量',
        standardRange: '1000 - 2000',
        result: 'normal',
        remark: ''
      },
      {
        name: '油压',
        method: '压力表测量',
        standardRange: '0.5 - 0.8',
        result: 'normal',
        remark: ''
      },
      {
        name: '温度',
        method: '温度计测量',
        standardRange: '20 - 40',
        result: 'normal',
        remark: ''
      },
      {
        name: '噪音',
        method: '噪音计测量',
        standardRange: '0 - 70',
        result: 'normal',
        remark: ''
      }
    ]
  },
  {
    id: 'REC002',
    equipmentId: 'EQ002',
    equipmentCode: 'INJ-001',
    equipmentName: '注塑机B',
    workshop: '注塑车间',
    location: 'B区-03',
    standardId: 'STD002',
    standardName: '注塑机月度点检标准',
    standardCode: 'INJ-MONTHLY-001',
    checkTime: '2023-08-15 14:20:00',
    checker: '李工',
    result: 'abnormal',
    status: '异常',
    createTime: '2023-08-15 14:35:00',
    items: [
      {
        name: '注射压力',
        method: '压力表测量',
        standardRange: '80 - 120',
        result: 'normal',
        remark: ''
      },
      {
        name: '模具温度',
        method: '温度计测量',
        standardRange: '150 - 200',
        result: 'abnormal',
        remark: '温度波动较大，需要检查加热系统'
      },
      {
        name: '锁模力',
        method: '力矩扳手测量',
        standardRange: '500 - 800',
        result: 'normal',
        remark: ''
      }
    ]
  },
  {
    id: 'REC003',
    equipmentId: 'EQ003',
    equipmentCode: 'ELEC-001',
    equipmentName: '配电柜C',
    workshop: '动力车间',
    location: 'C区-05',
    standardId: 'STD003',
    standardName: '电气设备安全点检标准',
    standardCode: 'ELEC-SAFETY-001',
    checkTime: '2023-08-20 10:15:00',
    checker: '王工',
    result: 'normal',
    status: '正常',
    createTime: '2023-08-20 10:30:00',
    items: [
      {
        name: '绝缘电阻',
        method: '兆欧表测量',
        standardRange: '0.5 - ',
        result: 'normal',
        remark: ''
      },
      {
        name: '接地电阻',
        method: '接地电阻测试仪',
        standardRange: ' - 4',
        result: 'normal',
        remark: ''
      },
      {
        name: '漏电流',
        method: '漏电流测试仪',
        standardRange: ' - 30',
        result: 'normal',
        remark: ''
      }
    ]
  }
];

// 模拟仪表盘数据
const mockDashboardData: DashboardData = {
  equipmentStatus: [
    { value: 10, name: '正常', itemStyle: { color: '#4caf50' } },
    { value: 2, name: '故障', itemStyle: { color: '#f44336' } },
    { value: 3, name: '维修中', itemStyle: { color: '#ff9800' } },
    { value: 1, name: '已报废', itemStyle: { color: '#9e9e9e' } }
  ],
  checkTrend: {
    dates: ['3/1', '3/2', '3/3', '3/4', '3/5', '3/6', '3/7'],
    planCount: [10, 12, 8, 10, 9, 5, 8],
    actualCount: [8, 10, 7, 9, 8, 5, 7]
  },
  patrolDistribution: {
    dates: ['3/1', '3/2', '3/3', '3/4', '3/5', '3/6', '3/7'],
    areas: [
      { name: 'A区', data: [5, 7, 3, 5, 6, 2, 4] },
      { name: 'B区', data: [3, 2, 4, 3, 2, 3, 2] },
      { name: 'C区', data: [2, 3, 1, 2, 1, 0, 1] }
    ]
  },
  recentCheckList: [
    { equipmentName: '数控车床A', checkTime: '2023-08-10 09:30', operator: '张工', result: '合格' },
    { equipmentName: '注塑机B', checkTime: '2023-08-15 14:20', operator: '李工', result: '不合格' },
    { equipmentName: '配电柜C', checkTime: '2023-08-20 10:15', operator: '王工', result: '合格' }
  ]
}; 