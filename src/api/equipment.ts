import request from '../utils/request';

// 获取设备列表
export function getEquipmentList() {
  return request({
    url: '/api/equipment/list',
    method: 'get'
  });
}

// 获取设备详情
export function getEquipmentDetail(id: string) {
  return request({
    url: `/api/equipment/detail/${id}`,
    method: 'get'
  });
} 