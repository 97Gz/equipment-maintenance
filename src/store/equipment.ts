import { defineStore } from 'pinia';

export interface Equipment {
  id: string;
  type: string;          // 设备类型
  name: string;          // 设备名称
  status: 'normal' | 'fault' | 'maintenance' | 'scrapped';  // 设备状态：正常、故障、维修中、已报废
  model: string;         // 规格型号
  image: string;         // 设备图片
  workshop: string;      // 使用车间
  location: string;      // 安装地点
  manager: string;       // 设备负责人
  managerContact: string; // 设备负责人联系方式
  manufacturer: string;  // 生产厂商
  purchaseDate: string;  // 购买日期
  supplier: {            // 供应商信息
    id: string;
    code: string;
    name: string;
  };
  enableDate: string;    // 启用日期
  checkInfo: {           // 点检信息
    standardName: string; // 点检标准名称
    standardCode: string; // 点检标准编码
    lastCheckTime: string; // 最近点检时间
  };
  patrolInfo: {          // 巡检信息
    planName: string;     // 巡检方案名称
    planCode: string;     // 巡检方案编码
    scheduledDate: string; // 规定巡检日期
    lastPatrolTime: string; // 最近巡检时间
    dailyCount: number;    // 当天规定巡检次数
  };
  repairInfo: {           // 维修信息
    lastRepairTime: string; // 最近维修日期
  };
  maintenanceInfo: {       // 保养信息
    lastMaintenanceTime: string; // 最近保养日期
  };
  scrapInfo: {             // 报废信息
    scrapTime: string;     // 报废时间
  };
}

export const useEquipmentStore = defineStore('equipment', {
  state: () => ({
    equipmentList: [] as Equipment[],
    currentEquipment: null as Equipment | null
  }),
  
  getters: {
    // 获取设备列表
    getEquipmentList: (state) => state.equipmentList,
    
    // 获取当前选中的设备
    getCurrentEquipment: (state) => state.currentEquipment
  },
  
  actions: {
    // 获取设备列表
    async fetchEquipmentList() {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          this.equipmentList = [
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
                lastCheckTime: '2023-05-10 09:00'
              },
              patrolInfo: {
                planName: '冷却设备巡检方案',
                planCode: 'PAT-ZL-001',
                scheduledDate: '每周二、四',
                lastPatrolTime: '2023-05-09 11:30',
                dailyCount: 2
              },
              repairInfo: {
                lastRepairTime: '2023-05-15'
              },
              maintenanceInfo: {
                lastMaintenanceTime: '2023-04-20'
              },
              scrapInfo: {
                scrapTime: '2023-06-01'
              }
            }
          ];
          resolve();
        }, 1000);
      });
    },
    
    // 获取设备详情
    async fetchEquipmentDetail(id: string) {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          const equipment = this.equipmentList.find(item => item.id === id);
          if (equipment) {
            this.currentEquipment = equipment;
          }
          resolve();
        }, 500);
      });
    },
    
    // 清除当前设备
    clearCurrentEquipment() {
      this.currentEquipment = null;
    }
  }
}); 