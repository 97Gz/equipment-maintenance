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
    code: 'CNC-001',
    type: '机床设备',
    name: 'CNC加工中心',
    status: 'normal',
    model: 'VMC-850',
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
    code: 'INJ-001',
    type: '包装设备',
    name: '全自动包装机',
    status: 'warning',
    model: 'APM-300',
    workshop: '包装车间',
    location: 'B区-02',
    manager: '李工',
    managerContact: '13800138001',
    manufacturer: '某包装设备制造有限公司',
    purchaseDate: '2021-06-10',
    enableDate: '2021-07-01',
    checkInfo: {
      standardName: '包装设备点检标准',
      standardCode: 'PKG-DAILY-001',
      lastCheckTime: '2023-08-11 10:15:00'
    },
    supplier: {
      id: 'S002',
      code: 'SUP002',
      name: '某包装设备销售有限公司'
    },
    patrolInfo: {
      planName: '周巡检',
      planCode: 'P002',
      scheduledDate: '每周一、三、五',
      lastPatrolTime: '2023-08-23 14:30:00',
      dailyCount: 1
    },
    repairInfo: {
      lastRepairTime: '2023-07-05'
    },
    maintenanceInfo: {
      lastMaintenanceTime: '2023-08-01'
    },
    scrapInfo: {
      scrapTime: ''
    }
  },
  {
    id: 'EQ003',
    code: 'ELEC-001',
    type: '电力设备',
    name: '变压器',
    status: 'repairing',
    model: 'TF-500KVA',
    workshop: '电力车间',
    location: 'C区-01',
    manager: '王工',
    managerContact: '13800138002',
    manufacturer: '某电气设备制造有限公司',
    purchaseDate: '2020-11-20',
    enableDate: '2020-12-15',
    checkInfo: {
      standardName: '电力设备安全点检标准',
      standardCode: 'ELEC-SAFETY-001',
      lastCheckTime: '2023-08-12 08:45:00'
    },
    supplier: {
      id: 'S003',
      code: 'SUP003',
      name: '某电气设备销售有限公司'
    },
    patrolInfo: {
      planName: '日常巡检',
      planCode: 'P003',
      scheduledDate: '每日',
      lastPatrolTime: '2023-08-25 09:20:00',
      dailyCount: 3
    },
    repairInfo: {
      lastRepairTime: '2023-08-20'
    },
    maintenanceInfo: {
      lastMaintenanceTime: '2023-07-20'
    },
    scrapInfo: {
      scrapTime: ''
    }
  },
  {
    id: 'EQ004',
    code: 'TEST-001',
    type: '检测设备',
    name: '三坐标测量机',
    status: 'standby',
    model: 'CMM-500',
    workshop: '质检车间',
    location: 'D区-01',
    manager: '赵工',
    managerContact: '13800138003',
    manufacturer: '某精密仪器制造有限公司',
    purchaseDate: '2019-10-15',
    enableDate: '2019-11-01',
    checkInfo: {
      standardName: '精密测量设备点检标准',
      standardCode: 'TEST-PREC-001',
      lastCheckTime: '2023-08-13 15:30:00'
    },
    supplier: {
      id: 'S004',
      code: 'SUP004',
      name: '某精密仪器销售有限公司'
    },
    patrolInfo: {
      planName: '周巡检',
      planCode: 'P004',
      scheduledDate: '每周二、四',
      lastPatrolTime: '2023-08-24 11:15:00',
      dailyCount: 1
    },
    repairInfo: {
      lastRepairTime: '2023-06-10'
    },
    maintenanceInfo: {
      lastMaintenanceTime: '2023-08-05'
    },
    scrapInfo: {
      scrapTime: ''
    }
  },
  {
    id: 'EQ005',
    code: 'COOL-001',
    type: '冷却设备',
    name: '工业冷水机',
    status: 'disabled',
    model: 'ICH-20T',
    workshop: '注塑车间',
    location: 'E区-01',
    manager: '钱工',
    managerContact: '13800138004',
    manufacturer: '某冷却设备制造有限公司',
    purchaseDate: '2018-05-10',
    enableDate: '2018-06-01',
    checkInfo: {
      standardName: '冷却设备点检标准',
      standardCode: 'COOL-DAILY-001',
      lastCheckTime: '2023-08-14 10:45:00'
    },
    supplier: {
      id: 'S005',
      code: 'SUP005',
      name: '某冷却设备销售有限公司'
    },
    patrolInfo: {
      planName: '日常巡检',
      planCode: 'P005',
      scheduledDate: '每日',
      lastPatrolTime: '2023-08-24 16:30:00',
      dailyCount: 2
    },
    repairInfo: {
      lastRepairTime: '2023-08-18'
    },
    maintenanceInfo: {
      lastMaintenanceTime: '2023-07-25'
    },
    scrapInfo: {
      scrapTime: ''
    }
  },
  {
    id: 'EQ006',
    code: 'SCRAP-001',
    type: '冷却设备',
    name: '旧工业冷水机',
    status: 'scrapped',
    model: 'ICH-10T',
    workshop: '旧设备库',
    location: 'F区-05',
    manager: '孙工',
    managerContact: '13800138005',
    manufacturer: '某冷却设备制造有限公司',
    purchaseDate: '2015-03-20',
    enableDate: '2015-04-01',
    checkInfo: {
      standardName: '',
      standardCode: '',
      lastCheckTime: ''
    },
    supplier: {
      id: 'S005',
      code: 'SUP005',
      name: '某冷却设备销售有限公司'
    },
    patrolInfo: {
      planName: '',
      planCode: '',
      scheduledDate: '',
      lastPatrolTime: '',
      dailyCount: 0
    },
    repairInfo: {
      lastRepairTime: '2022-11-20'
    },
    maintenanceInfo: {
      lastMaintenanceTime: '2022-10-15'
    },
    scrapInfo: {
      scrapTime: '2023-01-10'
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
    recordNo: 'DJXM20230810001',
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
    recordNo: 'DJXM20230811001',
    equipmentId: 'EQ002',
    equipmentCode: 'INJ-001',
    equipmentName: '全自动包装机',
    workshop: '包装车间',
    location: 'B区-02',
    standardId: 'STD002',
    standardName: '包装设备点检标准',
    standardCode: 'PKG-DAILY-001',
    checkTime: '2023-08-11 10:15:00',
    checker: '李工',
    result: 'abnormal',
    status: '异常',
    createTime: '2023-08-11 10:30:00',
    items: [
      {
        name: '封口温度',
        method: '温度计测量',
        standardRange: '120 - 150',
        result: 'normal',
        remark: ''
      },
      {
        name: '传送带速度',
        method: '速度计测量',
        standardRange: '10 - 20',
        result: 'abnormal',
        remark: '传送带速度异常，需要调整'
      },
      {
        name: '气压',
        method: '压力表测量',
        standardRange: '0.4 - 0.6',
        result: 'normal',
        remark: ''
      },
      {
        name: '电压',
        method: '电压表测量',
        standardRange: '220 - 240',
        result: 'normal',
        remark: ''
      }
    ]
  },
  {
    id: 'REC003',
    recordNo: 'DJXM20230812001',
    equipmentId: 'EQ003',
    equipmentCode: 'ELEC-001',
    equipmentName: '变压器',
    workshop: '电力车间',
    location: 'C区-01',
    standardId: 'STD003',
    standardName: '电力设备安全点检标准',
    standardCode: 'ELEC-SAFETY-001',
    checkTime: '2023-08-12 08:45:00',
    checker: '王工',
    result: 'normal',
    status: '正常',
    createTime: '2023-08-12 09:00:00',
    items: [
      {
        name: '电压',
        method: '电压表测量',
        standardRange: '380 - 420',
        result: 'normal',
        remark: ''
      },
      {
        name: '电流',
        method: '电流表测量',
        standardRange: '10 - 50',
        result: 'normal',
        remark: ''
      },
      {
        name: '温度',
        method: '红外测温仪',
        standardRange: '0 - 60',
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