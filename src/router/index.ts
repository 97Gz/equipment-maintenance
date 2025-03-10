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