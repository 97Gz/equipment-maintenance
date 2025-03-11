import Mock from 'mockjs';

// 登录接口
Mock.mock('/api/login', 'post', (options: any) => {
  const { username, password } = JSON.parse(options.body);
  
  if (username && password) {
    return {
      code: 200,
      message: '登录成功',
      data: {
        token: 'mock_token_' + Date.now(),
        userInfo: {
          id: '1001',
          name: username,
          avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
          role: 'admin'
        }
      }
    };
  } else {
    return {
      code: 400,
      message: '用户名或密码错误',
      data: null
    };
  }
});

// 退出登录接口
Mock.mock('/api/logout', 'post', () => {
  return {
    code: 200,
    message: '退出成功',
    data: null
  };
});

// 获取用户信息接口
Mock.mock('/api/user/info', 'get', () => {
  return {
    code: 200,
    message: '获取成功',
    data: {
      id: '1001',
      name: '管理员',
      avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
      role: 'admin'
    }
  };
});

// 获取设备列表接口
Mock.mock('/api/equipment/list', 'get', () => {
  return {
    code: 200,
    message: '获取成功',
    data: {
      total: 5,
      list: [
        {
          id: '1001',
          type: '机床设备',
          name: 'CNC加工中心',
          status: 'normal',
          model: 'VMC-850',
          image: 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg'
        },
        {
          id: '1002',
          type: '包装设备',
          name: '全自动包装机',
          status: 'maintenance',
          model: 'APM-300',
          image: 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-2.jpeg'
        },
        {
          id: '1003',
          type: '电力设备',
          name: '变压器',
          status: 'normal',
          model: 'TF-500KVA',
          image: 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-3.jpeg'
        },
        {
          id: '1004',
          type: '检测设备',
          name: '三坐标测量机',
          status: 'fault',
          model: 'CMM-500',
          image: 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-4.jpeg'
        },
        {
          id: '1005',
          type: '冷却设备',
          name: '工业冷水机',
          status: 'scrapped',
          model: 'ICH-20T',
          image: 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-5.jpeg'
        }
      ]
    }
  };
});

// 获取设备详情接口
Mock.mock(new RegExp('/api/equipment/detail/\\w+'), 'get', (options: any) => {
  const id = options.url.match(/\/api\/equipment\/detail\/(\w+)/)[1];
  
  // 模拟从数据库中查询设备详情
  const equipmentList = [
    {
      id: '1001',
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
      supplier: {
        id: 'S001',
        code: 'SUP001',
        name: '某机床销售有限公司'
      },
      enableDate: '2022-02-01',
      checkInfo: {
        standardName: '机床设备日常点检标准',
        standardCode: 'CHK-JC-001',
        lastCheckTime: '2023-09-15 08:30'
      },
      patrolInfo: {
        planName: '机床设备巡检方案',
        planCode: 'PAT-JC-001',
        scheduledDate: '每周一、三、五',
        lastPatrolTime: '2023-09-14 16:00',
        dailyCount: 2
      },
      repairInfo: {
        lastRepairTime: '2023-08-10'
      },
      maintenanceInfo: {
        lastMaintenanceTime: '2023-09-01'
      },
      scrapInfo: {
        scrapTime: ''
      }
    },
    {
      id: '1002',
      type: '包装设备',
      name: '全自动包装机',
      status: 'maintenance',
      model: 'APM-300',
      image: 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-2.jpeg',
      workshop: '包装车间',
      location: 'B区-05',
      manager: '李工',
      managerContact: '13900139000',
      manufacturer: '某包装设备有限公司',
      purchaseDate: '2021-11-20',
      supplier: {
        id: 'S002',
        code: 'SUP002',
        name: '某自动化设备有限公司'
      },
      enableDate: '2021-12-10',
      checkInfo: {
        standardName: '包装设备点检标准',
        standardCode: 'CHK-BZ-001',
        lastCheckTime: '2023-09-14 09:15'
      },
      patrolInfo: {
        planName: '包装设备巡检方案',
        planCode: 'PAT-BZ-001',
        scheduledDate: '每天',
        lastPatrolTime: '2023-09-14 14:30',
        dailyCount: 3
      },
      repairInfo: {
        lastRepairTime: '2023-09-10'
      },
      maintenanceInfo: {
        lastMaintenanceTime: '2023-08-15'
      },
      scrapInfo: {
        scrapTime: ''
      }
    },
    {
      id: '1003',
      type: '电力设备',
      name: '变压器',
      status: 'normal',
      model: 'TF-500KVA',
      image: 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-3.jpeg',
      workshop: '动力车间',
      location: '配电室-01',
      manager: '王工',
      managerContact: '13700137000',
      manufacturer: '某电气有限公司',
      purchaseDate: '2020-05-10',
      supplier: {
        id: 'S003',
        code: 'SUP003',
        name: '某电力设备有限公司'
      },
      enableDate: '2020-06-01',
      checkInfo: {
        standardName: '电力设备点检标准',
        standardCode: 'CHK-DL-001',
        lastCheckTime: '2023-09-15 07:30'
      },
      patrolInfo: {
        planName: '电力设备巡检方案',
        planCode: 'PAT-DL-001',
        scheduledDate: '每天',
        lastPatrolTime: '2023-09-14 20:00',
        dailyCount: 4
      },
      repairInfo: {
        lastRepairTime: '2023-07-05'
      },
      maintenanceInfo: {
        lastMaintenanceTime: '2023-08-20'
      },
      scrapInfo: {
        scrapTime: ''
      }
    },
    {
      id: '1004',
      type: '检测设备',
      name: '三坐标测量机',
      status: 'fault',
      model: 'CMM-500',
      image: 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-4.jpeg',
      workshop: '质检车间',
      location: 'C区-02',
      manager: '赵工',
      managerContact: '13600136000',
      manufacturer: '某精密仪器有限公司',
      purchaseDate: '2021-03-20',
      supplier: {
        id: 'S004',
        code: 'SUP004',
        name: '某测量设备有限公司'
      },
      enableDate: '2021-04-15',
      checkInfo: {
        standardName: '精密检测设备点检标准',
        standardCode: 'CHK-JC-002',
        lastCheckTime: '2023-09-13 16:45'
      },
      patrolInfo: {
        planName: '检测设备巡检方案',
        planCode: 'PAT-JC-002',
        scheduledDate: '每周一、五',
        lastPatrolTime: '2023-09-11 10:30',
        dailyCount: 1
      },
      repairInfo: {
        lastRepairTime: '2023-09-13'
      },
      maintenanceInfo: {
        lastMaintenanceTime: '2023-07-30'
      },
      scrapInfo: {
        scrapTime: ''
      }
    },
    {
      id: '1005',
      type: '冷却设备',
      name: '工业冷水机',
      status: 'scrapped',
      model: 'ICH-20T',
      image: 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-5.jpeg',
      workshop: '注塑车间',
      location: 'D区-03',
      manager: '钱工',
      managerContact: '13500135000',
      manufacturer: '某制冷设备有限公司',
      purchaseDate: '2018-08-10',
      supplier: {
        id: 'S005',
        code: 'SUP005',
        name: '某工业设备有限公司'
      },
      enableDate: '2018-09-01',
      checkInfo: {
        standardName: '制冷设备点检标准',
        standardCode: 'CHK-ZL-001',
        lastCheckTime: '2023-09-10 15:20'
      },
      patrolInfo: {
        planName: '制冷设备巡检方案',
        planCode: 'PAT-ZL-001',
        scheduledDate: '每周二、四',
        lastPatrolTime: '2023-09-12 11:15',
        dailyCount: 1
      },
      repairInfo: {
        lastRepairTime: '2023-06-20'
      },
      maintenanceInfo: {
        lastMaintenanceTime: '2023-05-15'
      },
      scrapInfo: {
        scrapTime: '2023-08-30'
      }
    }
  ];
  
  const equipment = equipmentList.find(item => item.id === id);
  
  if (equipment) {
    return {
      code: 200,
      message: '获取成功',
      data: equipment
    };
  } else {
    return {
      code: 404,
      message: '设备不存在',
      data: null
    };
  }
});

// 新增或更新设备接口
Mock.mock('/api/equipment/save', 'post', (options: any) => {
  const equipment = JSON.parse(options.body);
  
  // 模拟保存设备数据
  return {
    code: 200,
    message: '保存成功',
    data: {
      id: equipment.id || `EQ${Date.now().toString().slice(-6)}`
    }
  };
});

// 删除设备接口
Mock.mock(new RegExp('/api/equipment/delete/\\w+'), 'delete', () => {
  return {
    code: 200,
    message: '删除成功',
    data: null
  };
});

// 点检标准列表接口
Mock.mock('/api/check/standard/list', 'get', () => {
  return {
    code: 200,
    message: '获取成功',
    data: {
      total: 3,
      list: [
        {
          id: 'STD001',
          name: '机床设备日常点检标准',
          equipmentType: '机床设备',
          itemCount: 5,
          items: [
            { id: 'ITEM001', name: '主轴转速', method: '转速表测量', min: '1000', max: '2000' },
            { id: 'ITEM002', name: '油压', method: '压力表测量', min: '0.5', max: '0.8' },
            { id: 'ITEM003', name: '温度', method: '温度计测量', min: '20', max: '40' },
            { id: 'ITEM004', name: '噪音', method: '噪音计测量', min: '0', max: '70' },
            { id: 'ITEM005', name: '振动', method: '振动测量仪', min: '0', max: '5' }
          ]
        },
        {
          id: 'STD002',
          name: '包装设备点检标准',
          equipmentType: '包装设备',
          itemCount: 4,
          items: [
            { id: 'ITEM006', name: '封口温度', method: '温度计测量', min: '120', max: '150' },
            { id: 'ITEM007', name: '传送带速度', method: '速度计测量', min: '10', max: '20' },
            { id: 'ITEM008', name: '气压', method: '压力表测量', min: '0.4', max: '0.6' },
            { id: 'ITEM009', name: '电压', method: '电压表测量', min: '220', max: '240' }
          ]
        },
        {
          id: 'STD003',
          name: '电力设备点检标准',
          equipmentType: '电力设备',
          itemCount: 3,
          items: [
            { id: 'ITEM010', name: '电压', method: '电压表测量', min: '380', max: '420' },
            { id: 'ITEM011', name: '电流', method: '电流表测量', min: '10', max: '50' },
            { id: 'ITEM012', name: '温度', method: '红外测温仪', min: '0', max: '60' }
          ]
        }
      ]
    }
  };
});

// 点检标准详情接口
Mock.mock(new RegExp('/api/check/standard/detail/\\w+'), 'get', (options: any) => {
  const id = options.url.match(/\/api\/check\/standard\/detail\/(\w+)/)[1];
  
  const standards: Record<string, any> = {
    'STD001': {
      id: 'STD001',
      name: '机床设备日常点检标准',
      equipmentType: '机床设备',
      itemCount: 5,
      items: [
        { id: 'ITEM001', name: '主轴转速', method: '转速表测量', min: '1000', max: '2000' },
        { id: 'ITEM002', name: '油压', method: '压力表测量', min: '0.5', max: '0.8' },
        { id: 'ITEM003', name: '温度', method: '温度计测量', min: '20', max: '40' },
        { id: 'ITEM004', name: '噪音', method: '噪音计测量', min: '0', max: '70' },
        { id: 'ITEM005', name: '振动', method: '振动测量仪', min: '0', max: '5' }
      ]
    },
    'STD002': {
      id: 'STD002',
      name: '包装设备点检标准',
      equipmentType: '包装设备',
      itemCount: 4,
      items: [
        { id: 'ITEM006', name: '封口温度', method: '温度计测量', min: '120', max: '150' },
        { id: 'ITEM007', name: '传送带速度', method: '速度计测量', min: '10', max: '20' },
        { id: 'ITEM008', name: '气压', method: '压力表测量', min: '0.4', max: '0.6' },
        { id: 'ITEM009', name: '电压', method: '电压表测量', min: '220', max: '240' }
      ]
    },
    'STD003': {
      id: 'STD003',
      name: '电力设备点检标准',
      equipmentType: '电力设备',
      itemCount: 3,
      items: [
        { id: 'ITEM010', name: '电压', method: '电压表测量', min: '380', max: '420' },
        { id: 'ITEM011', name: '电流', method: '电流表测量', min: '10', max: '50' },
        { id: 'ITEM012', name: '温度', method: '红外测温仪', min: '0', max: '60' }
      ]
    }
  };
  
  const standard = standards[id];
  
  if (standard) {
    return {
      code: 200,
      message: '获取成功',
      data: standard
    };
  } else {
    return {
      code: 404,
      message: '点检标准不存在',
      data: null
    };
  }
});

// 保存点检标准接口
Mock.mock('/api/check/standard/save', 'post', (options: any) => {
  const standard = JSON.parse(options.body);
  
  return {
    code: 200,
    message: '保存成功',
    data: {
      id: standard.id || `STD${Date.now().toString().slice(-6)}`
    }
  };
});

// 删除点检标准接口
Mock.mock(new RegExp('/api/check/standard/delete/\\w+'), 'delete', () => {
  return {
    code: 200,
    message: '删除成功',
    data: null
  };
});

// 获取设备点检单列表接口
Mock.mock('/api/check/record/list', 'get', () => {
  return {
    code: 200,
    message: '获取成功',
    data: {
      total: 6,
      list: [
        {
          id: 'CHK001',
          equipmentId: '1001',
          equipmentCode: 'EQ1001',
          equipmentName: 'CNC加工中心',
          standardName: '机床设备日常点检标准',
          standardCode: 'CHK-JC-001',
          checkTime: '2023-09-15 08:30',
          checkUser: '张工',
          checkResult: 'normal',
          status: 'normal'
        },
        {
          id: 'CHK002',
          equipmentId: '1002',
          equipmentCode: 'EQ1002',
          equipmentName: '全自动包装机',
          standardName: '包装设备点检标准',
          standardCode: 'CHK-BZ-001',
          checkTime: '2023-09-14 09:15',
          checkUser: '李工',
          checkResult: 'normal',
          status: 'normal'
        },
        {
          id: 'CHK003',
          equipmentId: '1003',
          equipmentCode: 'EQ1003',
          equipmentName: '变压器',
          standardName: '电力设备点检标准',
          standardCode: 'CHK-DL-001',
          checkTime: '2023-09-15 07:30',
          checkUser: '王工',
          checkResult: 'normal',
          status: 'normal'
        },
        {
          id: 'CHK004',
          equipmentId: '1004',
          equipmentCode: 'EQ1004',
          equipmentName: '三坐标测量机',
          standardName: '精密检测设备点检标准',
          standardCode: 'CHK-JC-002',
          checkTime: '2023-09-13 16:45',
          checkUser: '赵工',
          checkResult: 'abnormal',
          status: 'fault'
        },
        {
          id: 'CHK005',
          equipmentId: '1001',
          equipmentCode: 'EQ1001',
          equipmentName: 'CNC加工中心',
          standardName: '机床设备日常点检标准',
          standardCode: 'CHK-JC-001',
          checkTime: '2023-09-10 08:20',
          checkUser: '张工',
          checkResult: 'normal',
          status: 'normal'
        },
        {
          id: 'CHK006',
          equipmentId: '1002',
          equipmentCode: 'EQ1002',
          equipmentName: '全自动包装机',
          standardName: '包装设备点检标准',
          standardCode: 'CHK-BZ-001',
          checkTime: '2023-09-09 10:30',
          checkUser: '李工',
          checkResult: 'normal',
          status: 'normal'
        }
      ]
    }
  };
});

// 获取设备点检单详情接口
Mock.mock(new RegExp('/api/check/record/detail/\\w+'), 'get', (options: any) => {
  const id = options.url.match(/\/api\/check\/record\/detail\/(\w+)/)[1];
  
  const records: Record<string, any> = {
    'CHK001': {
      id: 'CHK001',
      equipmentId: '1001',
      equipmentCode: 'EQ1001',
      equipmentName: 'CNC加工中心',
      workshop: '机加工车间',
      location: 'A区-01',
      standardName: '机床设备日常点检标准',
      standardCode: 'CHK-JC-001',
      checkTime: '2023-09-15 08:30',
      checkUser: '张工',
      checkResult: 'normal',
      status: 'normal',
      items: [
        { id: 'ITEM001', name: '主轴转速', method: '转速表测量', min: '1000', max: '2000', value: '1500', result: 'normal' },
        { id: 'ITEM002', name: '油压', method: '压力表测量', min: '0.5', max: '0.8', value: '0.65', result: 'normal' },
        { id: 'ITEM003', name: '温度', method: '温度计测量', min: '20', max: '40', value: '35', result: 'normal' },
        { id: 'ITEM004', name: '噪音', method: '噪音计测量', min: '0', max: '70', value: '60', result: 'normal' },
        { id: 'ITEM005', name: '振动', method: '振动测量仪', min: '0', max: '5', value: '3', result: 'normal' }
      ]
    },
    'CHK004': {
      id: 'CHK004',
      equipmentId: '1004',
      equipmentCode: 'EQ1004',
      equipmentName: '三坐标测量机',
      workshop: '质检车间',
      location: 'C区-02',
      standardName: '精密检测设备点检标准',
      standardCode: 'CHK-JC-002',
      checkTime: '2023-09-13 16:45',
      checkUser: '赵工',
      checkResult: 'abnormal',
      status: 'fault',
      items: [
        { id: 'ITEM013', name: '定位精度', method: '标准块测量', min: '0', max: '0.01', value: '0.015', result: 'abnormal', remark: '精度超标，需要校准' },
        { id: 'ITEM014', name: '测头压力', method: '压力传感器', min: '0.1', max: '0.3', value: '0.2', result: 'normal' },
        { id: 'ITEM015', name: '气路压力', method: '压力表测量', min: '0.4', max: '0.6', value: '0.5', result: 'normal' }
      ]
    }
  };
  
  // 如果找不到具体记录，返回一个基于设备ID的默认记录
  if (!records[id]) {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const currentTime = `${year}-${month}-${day} ${hours}:${minutes}`;
    
    return {
      code: 200,
      message: '获取成功',
      data: {
        id: '',
        equipmentId: id,
        equipmentCode: `EQ${id}`,
        equipmentName: '未知设备',
        workshop: '',
        location: '',
        standardName: '',
        standardCode: '',
        checkTime: currentTime,
        checkUser: '当前用户',
        checkResult: '',
        status: 'normal',
        items: []
      }
    };
  }
  
  return {
    code: 200,
    message: '获取成功',
    data: records[id]
  };
});

// 保存设备点检单接口
Mock.mock('/api/check/record/save', 'post', (options: any) => {
  const record = JSON.parse(options.body);
  
  return {
    code: 200,
    message: '保存成功',
    data: {
      id: record.id || `CHK${Date.now().toString().slice(-6)}`
    }
  };
});

// 删除设备点检单接口
Mock.mock(new RegExp('/api/check/record/delete/\\w+'), 'delete', () => {
  return {
    code: 200,
    message: '删除成功',
    data: null
  };
});

// 仪表盘数据接口
Mock.mock('/api/dashboard/data', 'get', () => {
  return {
    code: 200,
    message: '获取成功',
    data: {
      // 设备状态分布数据
      equipmentStatus: [
        { value: 35, name: '正常', itemStyle: { color: '#34b37c' } },
        { value: 5, name: '故障', itemStyle: { color: '#e74c3c' } },
        { value: 8, name: '维修中', itemStyle: { color: '#f5a623' } },
        { value: 2, name: '已报废', itemStyle: { color: '#64748b' } }
      ],
      
      // 点检次数趋势数据
      checkTrend: {
        dates: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        planCount: [15, 15, 18, 20, 15, 10, 10],
        actualCount: [12, 14, 16, 18, 14, 8, 9]
      },
      
      // 巡检分布数据
      patrolDistribution: {
        dates: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        areas: [
          { name: '机加工区', data: [5, 6, 5, 7, 5, 3, 4] },
          { name: '包装区', data: [3, 4, 5, 4, 5, 2, 3] },
          { name: '电力区', data: [2, 3, 3, 4, 2, 2, 2] },
          { name: '质检区', data: [2, 1, 3, 3, 2, 1, 0] }
        ]
      },
      
      // 近期点检记录
      recentCheckList: [
        { equipmentName: 'CNC加工中心', checkTime: '2023-09-15 08:30', operator: '张工', result: '合格' },
        { equipmentName: '全自动包装机', checkTime: '2023-09-14 09:15', operator: '李工', result: '合格' },
        { equipmentName: '三坐标测量机', checkTime: '2023-09-13 16:45', operator: '赵工', result: '异常' },
        { equipmentName: '变压器', checkTime: '2023-09-13 07:30', operator: '王工', result: '合格' }
      ]
    }
  };
});

export default Mock; 