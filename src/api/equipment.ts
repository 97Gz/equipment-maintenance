import request from '../utils/request';
import type { Equipment } from '../store/equipment';
import { mockService } from '../utils/mock/index';
import { equipmentApi } from '../utils/mock/api';

// API响应类型
interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

// 获取设备列表
export function getEquipmentList(): Promise<ApiResponse<Equipment[]>> {
  console.log('API: 调用getEquipmentList');
  
  // 直接使用equipmentApi
  try {
    console.log('API: 直接使用equipmentApi.getList()');
    return Promise.resolve(equipmentApi.getList())
      .then(response => {
        console.log('API: getEquipmentList直接使用equipmentApi响应:', response);
        return response as ApiResponse<Equipment[]>;
      })
      .catch(error => {
        console.error('API: getEquipmentList直接使用equipmentApi错误:', error);
        throw error;
      });
  } catch (error) {
    console.error('API: getEquipmentList直接使用equipmentApi异常:', error);
    throw error;
  }
}

// 获取设备详情
export function getEquipmentDetail(id: string): Promise<ApiResponse<Equipment>> {
  console.log('API: 调用getEquipmentDetail, id:', id);
  
  // 直接使用equipmentApi
  try {
    console.log('API: 直接使用equipmentApi.getDetail()');
    return Promise.resolve(equipmentApi.getDetail(id))
      .then(response => {
        console.log('API: getEquipmentDetail直接使用equipmentApi响应:', response);
        return response as ApiResponse<Equipment>;
      })
      .catch(error => {
        console.error('API: getEquipmentDetail直接使用equipmentApi错误:', error);
        throw error;
      });
  } catch (error) {
    console.error('API: getEquipmentDetail直接使用equipmentApi异常:', error);
    throw error;
  }
} 