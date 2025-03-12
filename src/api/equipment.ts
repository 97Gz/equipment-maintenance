import request from '../utils/request';
import type { Equipment } from '../store/equipment';

// API响应类型
interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

// 获取设备列表
export function getEquipmentList(): Promise<ApiResponse<Equipment[]>> {
  return request({
    url: '/api/equipment/list',
    method: 'get'
  });
}

// 获取设备详情
export function getEquipmentDetail(id: string): Promise<ApiResponse<Equipment>> {
  return request({
    url: `/api/equipment/detail/${id}`,
    method: 'get'
  });
} 