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
Mock.mock(new RegExp('/api/equipment/detail/\\d+'), 'get', (options: any) => {
  const id = options.url.match(/\/api\/equipment\/detail\/(\d+)/)[1];
  
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

export default Mock; 