import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/login/index.vue'),
    meta: {
      title: '登录',
      showTabBar: false
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/dashboard/index.vue'),
    meta: {
      title: '仪表盘',
      showTabBar: true
    }
  },
  {
    path: '/menu',
    name: 'Menu',
    component: () => import('../views/menu/index.vue'),
    meta: {
      title: '功能菜单',
      showTabBar: true
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/profile/index.vue'),
    meta: {
      title: '个人信息',
      showTabBar: true
    }
  },
  {
    path: '/check/standard/edit/:id',
    name: 'CheckStandardEdit',
    component: () => import('../views/check/standard-detail.vue'),
    meta: {
      title: '编辑点检标准',
      showTabBar: false
    }
  },
  {
    path: '/check/standard/:id',
    name: 'CheckStandardDetail',
    component: () => import('../views/check/standard-detail.vue'),
    meta: {
      title: '点检标准详情',
      showTabBar: false
    }
  },
  {
    path: '/check/standard/add',
    name: 'CheckStandardAdd',
    component: () => import('../views/check/standard-detail.vue'),
    meta: {
      title: '添加点检标准',
      showTabBar: false
    }
  },
  {
    path: '/check/record/:id',
    name: 'CheckRecordDetail',
    component: () => import('../views/check/record-detail.vue'),
    meta: {
      title: '点检记录详情',
      showTabBar: false
    }
  },
  {
    path: '/check/record/edit/:id',
    name: 'CheckRecordEdit',
    component: () => import('../views/check/record-detail.vue'),
    meta: {
      title: '编辑点检记录',
      showTabBar: false
    }
  },
  {
    path: '/check/record/add',
    name: 'CheckRecordAdd',
    component: () => import('../views/check/record-detail.vue'),
    meta: {
      title: '新增点检记录',
      showTabBar: false
    }
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../views/home/index.vue'),
    meta: {
      title: '首页',
      showTabBar: true
    }
  },
  {
    path: '/equipment/detail/:id',
    name: 'EquipmentDetail',
    component: () => import('../views/equipment/detail.vue'),
    meta: {
      title: '设备详情',
      showTabBar: false
    }
  },
  {
    path: '/equipment/edit/:id',
    name: 'EquipmentEdit',
    component: () => import('../views/equipment/edit.vue'),
    meta: {
      title: '编辑设备',
      showTabBar: false
    }
  },
  {
    path: '/equipment/check/:id',
    name: 'EquipmentCheck',
    component: () => import('../views/equipment/check.vue'),
    meta: {
      title: '设备点检',
      showTabBar: false
    }
  },
  {
    path: '/personal',
    name: 'Personal',
    component: () => import('../views/personal/index.vue'),
    meta: {
      title: '个人事项',
      showTabBar: true
    },
    children: [
      {
        path: 'todo',
        name: 'PersonalTodo',
        component: () => import('../views/personal/todo.vue'),
        meta: {
          title: '我的待办'
        }
      },
      {
        path: 'initiated',
        name: 'PersonalInitiated',
        component: () => import('../views/personal/initiated.vue'),
        meta: {
          title: '我发起的'
        }
      },
      {
        path: 'processed',
        name: 'PersonalProcessed',
        component: () => import('../views/personal/processed.vue'),
        meta: {
          title: '我处理的'
        }
      }
    ]
  },
  {
    path: '/basic',
    name: 'Basic',
    component: () => import('../views/basic/index.vue'),
    meta: {
      title: '基础资料',
      showTabBar: true
    },
    children: [
      {
        path: 'equipment',
        name: 'Equipment',
        component: () => import('../views/basic/equipment.vue'),
        meta: {
          title: '设备档案'
        }
      },
      {
        path: 'equipment-type',
        name: 'EquipmentType',
        component: () => import('../views/basic/equipment-type/list.vue'),
        meta: {
          title: '设备类型'
        }
      },
      {
        path: 'equipment-type/detail/:id',
        name: 'EquipmentTypeDetail',
        component: () => import('../views/basic/equipment-type/detail.vue'),
        meta: {
          title: '设备类型详情',
          showTabBar: false
        }
      },
      {
        path: 'equipment-type/add',
        name: 'EquipmentTypeAdd',
        component: () => import('../views/basic/equipment-type/detail.vue'),
        meta: {
          title: '新增设备类型',
          showTabBar: false
        }
      },
      {
        path: 'equipment-type/edit/:id',
        name: 'EquipmentTypeEdit',
        component: () => import('../views/basic/equipment-type/detail.vue'),
        meta: {
          title: '编辑设备类型',
          showTabBar: false
        }
      },
      {
        path: 'equipment-name',
        name: 'EquipmentName',
        component: () => import('../views/basic/equipment-name/list.vue'),
        meta: {
          title: '设备名称'
        }
      },
      {
        path: 'equipment-name/detail/:id',
        name: 'EquipmentNameDetail',
        component: () => import('../views/basic/equipment-name/detail.vue'),
        meta: {
          title: '设备名称详情',
          showTabBar: false
        }
      },
      {
        path: 'equipment-name/add',
        name: 'EquipmentNameAdd',
        component: () => import('../views/basic/equipment-name/detail.vue'),
        meta: {
          title: '新增设备名称',
          showTabBar: false
        }
      },
      {
        path: 'equipment-name/edit/:id',
        name: 'EquipmentNameEdit',
        component: () => import('../views/basic/equipment-name/detail.vue'),
        meta: {
          title: '编辑设备名称',
          showTabBar: false
        }
      },
      {
        path: 'workshop',
        name: 'Workshop',
        component: () => import('../views/basic/workshop/list.vue'),
        meta: {
          title: '车间'
        }
      },
      {
        path: 'workshop/detail/:id',
        name: 'WorkshopDetail',
        component: () => import('../views/basic/workshop/detail.vue'),
        meta: {
          title: '车间详情',
          showTabBar: false
        }
      },
      {
        path: 'workshop/add',
        name: 'WorkshopAdd',
        component: () => import('../views/basic/workshop/detail.vue'),
        meta: {
          title: '新增车间',
          showTabBar: false
        }
      },
      {
        path: 'workshop/edit/:id',
        name: 'WorkshopEdit',
        component: () => import('../views/basic/workshop/detail.vue'),
        meta: {
          title: '编辑车间',
          showTabBar: false
        }
      },
      {
        path: 'warehouse',
        name: 'Warehouse',
        component: () => import('../views/basic/warehouse/list.vue'),
        meta: {
          title: '仓库'
        }
      },
      {
        path: 'warehouse/detail/:id',
        name: 'WarehouseDetail',
        component: () => import('../views/basic/warehouse/detail.vue'),
        meta: {
          title: '仓库详情',
          showTabBar: false
        }
      },
      {
        path: 'warehouse/add',
        name: 'WarehouseAdd',
        component: () => import('../views/basic/warehouse/detail.vue'),
        meta: {
          title: '新增仓库',
          showTabBar: false
        }
      },
      {
        path: 'warehouse/edit/:id',
        name: 'WarehouseEdit',
        component: () => import('../views/basic/warehouse/detail.vue'),
        meta: {
          title: '编辑仓库',
          showTabBar: false
        }
      }
    ]
  },
  {
    path: '/check',
    name: 'Check',
    component: () => import('../views/check/index.vue'),
    meta: {
      title: '设备点检',
      showTabBar: true
    },
    children: [
      {
        path: 'list',
        name: 'CheckList',
        component: () => import('../views/check/list.vue'),
        meta: {
          title: '设备点检单'
        }
      },
      {
        path: 'standard',
        name: 'CheckStandard',
        component: () => import('../views/check/standard.vue'),
        meta: {
          title: '点检标准'
        }
      },
      {
        path: 'statistics',
        name: 'CheckStatistics',
        component: () => import('../views/check/statistics.vue'),
        meta: {
          title: '设备点检统计'
        }
      }
    ]
  },
  {
    path: '/patrol',
    name: 'Patrol',
    component: () => import('../views/patrol/index.vue'),
    meta: {
      title: '设备巡检',
      showTabBar: true
    },
    children: [
      {
        path: '',
        redirect: '/patrol/list'
      },
      {
        path: 'list',
        name: 'PatrolList',
        component: () => import('../views/patrol/list.vue'),
        meta: {
          title: '设备巡检单'
        }
      },
      {
        path: 'plan',
        name: 'PatrolPlan',
        component: () => import('../views/patrol/plan.vue'),
        meta: {
          title: '巡检方案'
        }
      },
      {
        path: 'statistics',
        name: 'PatrolStatistics',
        component: () => import('../views/patrol/statistics.vue'),
        meta: {
          title: '设备巡检统计'
        }
      }
    ]
  },
  {
    path: '/patrol/plan/:id',
    name: 'PatrolPlanDetail',
    component: () => import('../views/patrol/plan-detail.vue'),
    meta: {
      title: '巡检方案详情',
      showTabBar: false,
      mode: 'view'
    }
  },
  {
    path: '/patrol/plan/edit/:id',
    name: 'PatrolPlanEdit',
    component: () => import('../views/patrol/plan-detail.vue'),
    meta: {
      title: '编辑巡检方案',
      showTabBar: false,
      mode: 'edit'
    }
  },
  {
    path: '/patrol/plan/add',
    name: 'PatrolPlanAdd',
    component: () => import('../views/patrol/plan-detail.vue'),
    meta: {
      title: '新增巡检方案',
      showTabBar: false,
      mode: 'add'
    }
  },
  {
    path: '/patrol/record/:id',
    name: 'PatrolRecordDetail',
    component: () => import('../views/patrol/record-detail.vue'),
    meta: {
      title: '巡检记录详情',
      showTabBar: false,
      mode: 'view'
    }
  },
  {
    path: '/patrol/record/edit/:id',
    name: 'PatrolRecordEdit',
    component: () => import('../views/patrol/record-detail.vue'),
    meta: {
      title: '编辑巡检记录',
      showTabBar: false,
      mode: 'edit'
    }
  },
  {
    path: '/patrol/record/add',
    name: 'PatrolRecordAdd',
    component: () => import('../views/patrol/record-detail.vue'),
    meta: {
      title: '新增巡检记录',
      showTabBar: false,
      mode: 'add'
    }
  },
  {
    path: '/repair',
    name: 'Repair',
    component: () => import('../views/repair/index.vue'),
    meta: {
      title: '设备报修维修',
      showTabBar: true
    },
    children: [
      {
        path: 'maintenance',
        name: 'RepairMaintenance',
        component: () => import('../views/repair/maintenance.vue'),
        meta: {
          title: '设备维修单'
        }
      },
      {
        path: 'scrap',
        name: 'RepairScrap',
        component: () => import('../views/repair/scrap.vue'),
        meta: {
          title: '设备报废单'
        }
      },
      {
        path: 'statistics',
        name: 'RepairStatistics',
        component: () => import('../views/repair/statistics.vue'),
        meta: {
          title: '报修维修统计'
        }
      }
    ]
  },
  {
    path: '/maintenance',
    name: 'Maintenance',
    component: () => import('../views/maintenance/index.vue'),
    meta: {
      title: '设备维护保养',
      showTabBar: true
    },
    children: [
      {
        path: 'plan',
        name: 'MaintenancePlan',
        component: () => import('../views/maintenance/plan.vue'),
        meta: {
          title: '保养计划表'
        }
      },
      {
        path: 'list',
        name: 'MaintenanceList',
        component: () => import('../views/maintenance/list.vue'),
        meta: {
          title: '设备保养单'
        }
      },
      {
        path: 'level',
        name: 'MaintenanceLevel',
        component: () => import('../views/maintenance/level.vue'),
        meta: {
          title: '保养等级与频次'
        }
      },
      {
        path: 'calendar',
        name: 'MaintenanceCalendar',
        component: () => import('../views/maintenance/calendar.vue'),
        meta: {
          title: '设备保养日历'
        }
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// 路由守卫
router.beforeEach((to: any, from: any, next: any) => {
  // 设置页面标题
  document.title = to.meta.title as string || '设备管理系统';
  
  const token = localStorage.getItem('token');
  
  // 如果前往登录页，直接放行
  if (to.path === '/login') {
    next();
    return;
  }
  
  // 其他页面检查是否登录
  if (!token) {
    next('/login');
    return;
  }
  
  next();
});

export default router; 