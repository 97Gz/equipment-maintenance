import request from '../utils/request';
import type { CheckStandard, CheckRecord } from '../store/check';

// API响应类型
interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

// 获取点检标准列表
export function getStandardList(): Promise<ApiResponse<CheckStandard[]>> {
  return request({
    url: '/api/check/standard/list',
    method: 'get'
  });
}

// 获取点检标准详情
export function getStandardDetail(id: string): Promise<ApiResponse<CheckStandard>> {
  return request({
    url: `/api/check/standard/detail/${id}`,
    method: 'get'
  });
}

// 新增或更新点检标准
export function saveStandard(data: Partial<CheckStandard>): Promise<ApiResponse<{id: string}>> {
  return request({
    url: '/api/check/standard/save',
    method: 'post',
    data
  });
}

// 删除点检标准
export function deleteStandard(id: string): Promise<ApiResponse<null>> {
  return request({
    url: `/api/check/standard/delete/${id}`,
    method: 'delete'
  });
}

// 获取点检记录列表
export function getRecordList(): Promise<ApiResponse<CheckRecord[]>> {
  return request({
    url: '/api/check/record/list',
    method: 'get'
  });
}

// 获取点检记录详情
export function getRecordDetail(id: string): Promise<ApiResponse<CheckRecord>> {
  return request({
    url: `/api/check/record/detail/${id}`,
    method: 'get'
  });
}

// 新增或更新点检记录
export function saveRecord(data: Partial<CheckRecord>): Promise<ApiResponse<{id: string}>> {
  return request({
    url: '/api/check/record/save',
    method: 'post',
    data
  });
}

// 删除点检记录
export function deleteRecord(id: string): Promise<ApiResponse<null>> {
  return request({
    url: `/api/check/record/delete/${id}`,
    method: 'delete'
  });
}

// 设备报修
export function repairEquipment(data: {
  equipmentId: string;
  reason: string;
  contactName: string;
  contactPhone: string;
}): Promise<ApiResponse<{id: string}>> {
  return request({
    url: '/api/equipment/repair',
    method: 'post',
    data
  });
} 