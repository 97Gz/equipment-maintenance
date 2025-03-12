import type { EquipmentType } from '../../../src/store/basic/equipmentType';
import type { EquipmentName } from '../../../src/store/basic/equipmentName';
import type { Workshop } from '../../../src/store/basic/workshop';
import type { Warehouse } from '../../../src/store/basic/warehouse';

// 设备类型模拟数据
export const mockEquipmentTypes: EquipmentType[] = [
  {
    id: 'ET001',
    typeName: '加工设备',
    createTime: '2023-01-01 08:00:00',
    updateTime: '2023-01-01 08:00:00'
  },
  {
    id: 'ET002',
    typeName: '注塑设备',
    createTime: '2023-01-02 09:00:00',
    updateTime: '2023-01-02 09:00:00'
  },
  {
    id: 'ET003',
    typeName: '电气设备',
    createTime: '2023-01-03 10:00:00',
    updateTime: '2023-01-03 10:00:00'
  },
  {
    id: 'ET004',
    typeName: '测量设备',
    createTime: '2023-01-04 11:00:00',
    updateTime: '2023-01-04 11:00:00'
  },
  {
    id: 'ET005',
    typeName: '包装设备',
    createTime: '2023-01-05 12:00:00',
    updateTime: '2023-01-05 12:00:00'
  },
  {
    id: 'ET006',
    typeName: '焊接设备',
    createTime: '2023-02-01 08:30:00',
    updateTime: '2023-02-01 08:30:00'
  },
  {
    id: 'ET007',
    typeName: '切割设备',
    createTime: '2023-02-02 09:30:00',
    updateTime: '2023-02-02 09:30:00'
  },
  {
    id: 'ET008',
    typeName: '冲压设备',
    createTime: '2023-02-03 10:30:00',
    updateTime: '2023-02-03 10:30:00'
  },
  {
    id: 'ET009',
    typeName: '钻孔设备',
    createTime: '2023-02-04 11:30:00',
    updateTime: '2023-02-04 11:30:00'
  },
  {
    id: 'ET010',
    typeName: '磨床设备',
    createTime: '2023-02-05 12:30:00',
    updateTime: '2023-02-05 12:30:00'
  },
  {
    id: 'ET011',
    typeName: '喷漆设备',
    createTime: '2023-03-01 08:30:00',
    updateTime: '2023-03-01 08:30:00'
  },
  {
    id: 'ET012',
    typeName: '研磨设备',
    createTime: '2023-03-02 09:30:00',
    updateTime: '2023-03-02 09:30:00'
  },
  {
    id: 'ET013',
    typeName: '清洗设备',
    createTime: '2023-03-03 10:30:00',
    updateTime: '2023-03-03 10:30:00'
  },
  {
    id: 'ET014',
    typeName: '组装设备',
    createTime: '2023-03-04 11:30:00',
    updateTime: '2023-03-04 11:30:00'
  },
  {
    id: 'ET015',
    typeName: '输送设备',
    createTime: '2023-03-05 12:30:00',
    updateTime: '2023-03-05 12:30:00'
  }
];

// 设备名称模拟数据
export const mockEquipmentNames: EquipmentName[] = [
  {
    id: 'EN001',
    name: 'CNC加工中心',
    typeId: 'ET001',
    typeName: '加工设备',
    createTime: '2023-01-01 08:30:00',
    updateTime: '2023-01-01 08:30:00'
  },
  {
    id: 'EN002',
    name: '数控车床',
    typeId: 'ET001',
    typeName: '加工设备',
    createTime: '2023-01-01 09:30:00',
    updateTime: '2023-01-01 09:30:00'
  },
  {
    id: 'EN003',
    name: '注塑机',
    typeId: 'ET002',
    typeName: '注塑设备',
    createTime: '2023-01-02 10:30:00',
    updateTime: '2023-01-02 10:30:00'
  },
  {
    id: 'EN004',
    name: '变压器',
    typeId: 'ET003',
    typeName: '电气设备',
    createTime: '2023-01-03 11:30:00',
    updateTime: '2023-01-03 11:30:00'
  },
  {
    id: 'EN005',
    name: '三坐标测量仪',
    typeId: 'ET004',
    typeName: '测量设备',
    createTime: '2023-01-04 12:30:00',
    updateTime: '2023-01-04 12:30:00'
  },
  {
    id: 'EN006',
    name: '自动包装机',
    typeId: 'ET005',
    typeName: '包装设备',
    createTime: '2023-01-05 13:30:00',
    updateTime: '2023-01-05 13:30:00'
  },
  {
    id: 'EN007',
    name: '立式加工中心',
    typeId: 'ET001',
    typeName: '加工设备',
    createTime: '2023-02-01 08:30:00',
    updateTime: '2023-02-01 08:30:00'
  },
  {
    id: 'EN008',
    name: '卧式车床',
    typeId: 'ET001',
    typeName: '加工设备',
    createTime: '2023-02-02 09:30:00',
    updateTime: '2023-02-02 09:30:00'
  },
  {
    id: 'EN009',
    name: '大型注塑机',
    typeId: 'ET002',
    typeName: '注塑设备',
    createTime: '2023-02-03 10:30:00',
    updateTime: '2023-02-03 10:30:00'
  },
  {
    id: 'EN010',
    name: '伺服电机',
    typeId: 'ET003',
    typeName: '电气设备',
    createTime: '2023-02-04 11:30:00',
    updateTime: '2023-02-04 11:30:00'
  },
  {
    id: 'EN011',
    name: '电阻焊机',
    typeId: 'ET006',
    typeName: '焊接设备',
    createTime: '2023-02-05 12:30:00',
    updateTime: '2023-02-05 12:30:00'
  },
  {
    id: 'EN012',
    name: '激光切割机',
    typeId: 'ET007',
    typeName: '切割设备',
    createTime: '2023-03-01 08:30:00',
    updateTime: '2023-03-01 08:30:00'
  },
  {
    id: 'EN013',
    name: '冲床',
    typeId: 'ET008',
    typeName: '冲压设备',
    createTime: '2023-03-02 09:30:00',
    updateTime: '2023-03-02 09:30:00'
  },
  {
    id: 'EN014',
    name: '多轴钻床',
    typeId: 'ET009',
    typeName: '钻孔设备',
    createTime: '2023-03-03 10:30:00',
    updateTime: '2023-03-03 10:30:00'
  },
  {
    id: 'EN015',
    name: '平面磨床',
    typeId: 'ET010',
    typeName: '磨床设备',
    createTime: '2023-03-04 11:30:00',
    updateTime: '2023-03-04 11:30:00'
  },
  {
    id: 'EN016',
    name: '自动喷漆线',
    typeId: 'ET011',
    typeName: '喷漆设备',
    createTime: '2023-03-05 12:30:00',
    updateTime: '2023-03-05 12:30:00'
  },
  {
    id: 'EN017',
    name: '精密研磨机',
    typeId: 'ET012',
    typeName: '研磨设备',
    createTime: '2023-03-06 13:30:00',
    updateTime: '2023-03-06 13:30:00'
  },
  {
    id: 'EN018',
    name: '超声波清洗机',
    typeId: 'ET013',
    typeName: '清洗设备',
    createTime: '2023-03-07 14:30:00',
    updateTime: '2023-03-07 14:30:00'
  },
  {
    id: 'EN019',
    name: '装配流水线',
    typeId: 'ET014',
    typeName: '组装设备',
    createTime: '2023-03-08 15:30:00',
    updateTime: '2023-03-08 15:30:00'
  },
  {
    id: 'EN020',
    name: '皮带输送机',
    typeId: 'ET015',
    typeName: '输送设备',
    createTime: '2023-03-09 16:30:00',
    updateTime: '2023-03-09 16:30:00'
  }
];

// 车间模拟数据
export const mockWorkshops: Workshop[] = [
  {
    id: 'WS001',
    name: '机加工车间',
    createTime: '2023-01-01 08:00:00',
    updateTime: '2023-01-01 08:00:00'
  },
  {
    id: 'WS002',
    name: '注塑车间',
    createTime: '2023-01-02 09:00:00',
    updateTime: '2023-01-02 09:00:00'
  },
  {
    id: 'WS003',
    name: '装配车间',
    createTime: '2023-01-03 10:00:00',
    updateTime: '2023-01-03 10:00:00'
  },
  {
    id: 'WS004',
    name: '测试车间',
    createTime: '2023-01-04 11:00:00',
    updateTime: '2023-01-04 11:00:00'
  },
  {
    id: 'WS005',
    name: '包装车间',
    createTime: '2023-01-05 12:00:00',
    updateTime: '2023-01-05 12:00:00'
  },
  {
    id: 'WS006',
    name: '焊接车间',
    createTime: '2023-02-01 08:30:00',
    updateTime: '2023-02-01 08:30:00'
  },
  {
    id: 'WS007',
    name: '冲压车间',
    createTime: '2023-02-02 09:30:00',
    updateTime: '2023-02-02 09:30:00'
  },
  {
    id: 'WS008',
    name: '钣金车间',
    createTime: '2023-02-03 10:30:00',
    updateTime: '2023-02-03 10:30:00'
  },
  {
    id: 'WS009',
    name: '电子车间',
    createTime: '2023-02-04 11:30:00',
    updateTime: '2023-02-04 11:30:00'
  },
  {
    id: 'WS010',
    name: '精密加工车间',
    createTime: '2023-02-05 12:30:00',
    updateTime: '2023-02-05 12:30:00'
  },
  {
    id: 'WS011',
    name: '喷漆车间',
    createTime: '2023-03-01 08:30:00',
    updateTime: '2023-03-01 08:30:00'
  },
  {
    id: 'WS012',
    name: '研发试制车间',
    createTime: '2023-03-02 09:30:00',
    updateTime: '2023-03-02 09:30:00'
  },
  {
    id: 'WS013',
    name: '质检车间',
    createTime: '2023-03-03 10:30:00',
    updateTime: '2023-03-03 10:30:00'
  },
  {
    id: 'WS014',
    name: '模具车间',
    createTime: '2023-03-04 11:30:00',
    updateTime: '2023-03-04 11:30:00'
  },
  {
    id: 'WS015',
    name: '自动化生产车间',
    createTime: '2023-03-05 12:30:00',
    updateTime: '2023-03-05 12:30:00'
  }
];

// 仓库模拟数据
export const mockWarehouses: Warehouse[] = [
  {
    id: 'WH001',
    name: '原材料仓库',
    location: '厂区东侧',
    manager: '张三',
    createTime: '2023-01-01 08:00:00',
    updateTime: '2023-01-01 08:00:00'
  },
  {
    id: 'WH002',
    name: '半成品仓库',
    location: '厂区中部',
    manager: '李四',
    createTime: '2023-01-02 09:00:00',
    updateTime: '2023-01-02 09:00:00'
  },
  {
    id: 'WH003',
    name: '成品仓库',
    location: '厂区西侧',
    manager: '王五',
    createTime: '2023-01-03 10:00:00',
    updateTime: '2023-01-03 10:00:00'
  },
  {
    id: 'WH004',
    name: '工具仓库',
    location: '厂区北侧',
    manager: '赵六',
    createTime: '2023-01-04 11:00:00',
    updateTime: '2023-01-04 11:00:00'
  },
  {
    id: 'WH005',
    name: '备件仓库',
    location: '厂区南侧',
    manager: '孙七',
    createTime: '2023-01-05 12:00:00',
    updateTime: '2023-01-05 12:00:00'
  },
  {
    id: 'WH006',
    name: '电气材料仓库',
    location: '厂区东北角',
    manager: '周八',
    createTime: '2023-02-01 08:30:00',
    updateTime: '2023-02-01 08:30:00'
  },
  {
    id: 'WH007',
    name: '机械材料仓库',
    location: '厂区西北角',
    manager: '吴九',
    createTime: '2023-02-02 09:30:00',
    updateTime: '2023-02-02 09:30:00'
  },
  {
    id: 'WH008',
    name: '塑料原料仓库',
    location: '厂区东南角',
    manager: '郑十',
    createTime: '2023-02-03 10:30:00',
    updateTime: '2023-02-03 10:30:00'
  },
  {
    id: 'WH009',
    name: '金属材料仓库',
    location: '厂区西南角',
    manager: '钱十一',
    createTime: '2023-02-04 11:30:00',
    updateTime: '2023-02-04 11:30:00'
  },
  {
    id: 'WH010',
    name: '包装材料仓库',
    location: '厂区中部偏南',
    manager: '陈十二',
    createTime: '2023-02-05 12:30:00',
    updateTime: '2023-02-05 12:30:00'
  },
  {
    id: 'WH011',
    name: '危险品仓库',
    location: '厂区远端隔离区',
    manager: '杨十三',
    createTime: '2023-03-01 08:30:00',
    updateTime: '2023-03-01 08:30:00'
  },
  {
    id: 'WH012',
    name: '办公用品仓库',
    location: '办公楼一层',
    manager: '柳十四',
    createTime: '2023-03-02 09:30:00',
    updateTime: '2023-03-02 09:30:00'
  },
  {
    id: 'WH013',
    name: '成品检验仓库',
    location: '品质中心旁',
    manager: '刘十五',
    createTime: '2023-03-03 10:30:00',
    updateTime: '2023-03-03 10:30:00'
  },
  {
    id: 'WH014',
    name: '退货处理仓库',
    location: '售后服务中心旁',
    manager: '蒋十六',
    createTime: '2023-03-04 11:30:00',
    updateTime: '2023-03-04 11:30:00'
  },
  {
    id: 'WH015',
    name: '临时存储仓库',
    location: '厂区中心位置',
    manager: '沈十七',
    createTime: '2023-03-05 12:30:00',
    updateTime: '2023-03-05 12:30:00'
  }
]; 