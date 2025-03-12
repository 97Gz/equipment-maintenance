import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import axios from 'axios';
import { equipmentTypeApi, equipmentNameApi, workshopApi, warehouseApi, 
  supplierApi, equipmentApi, maintenanceRecordApi, maintenancePlanApi, 
  sparePartApi, spareUseApi } from './api';
import { patrolPlanApi, patrolRecordApi } from './patrol';
import { checkStandardApi, checkRecordApi } from './check';

interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

// 创建一个基础的mock响应对象
const createMockResponse = <T>(data: T, config: InternalAxiosRequestConfig): AxiosResponse<ApiResponse<T>> => {
  return {
    data: { code: 200, message: 'success', data },
    status: 200,
    statusText: 'OK',
    headers: {},
    config,
    request: {}
  };
};

// 设置mock服务
export const setupMockApi = () => {
  console.log('Setting up mock API...');
  // 添加一个全局axios拦截器，用于模拟后端API
  setupBasicDataMocks();
  setupEquipmentMocks();
  setupMaintenanceMocks();
  setupSpareMocks();
  setupInspectionMocks();
};

// 设置基础数据的mock
const setupBasicDataMocks = () => {
  axios.interceptors.response.use(
    async (res: AxiosResponse): Promise<AxiosResponse<ApiResponse<any>>> => {
      const { url, data: reqData } = res.config;

      // 设备类型
      if (url?.includes('/api/basic/equipmentType/list')) {
        return createMockResponse(await equipmentTypeApi.getList(), res.config);
      }
      if (url?.match(/\/api\/basic\/equipmentType\/detail\/\w+/)) {
        const id = url.split('/').pop() || '';
        return createMockResponse(await equipmentTypeApi.getDetail(id), res.config);
      }
      if (url?.includes('/api/basic/equipmentType/save')) {
        const data = JSON.parse(reqData || '{}');
        return createMockResponse(await equipmentTypeApi.save(data), res.config);
      }
      if (url?.match(/\/api\/basic\/equipmentType\/delete\/\w+/)) {
        const id = url.split('/').pop() || '';
        return createMockResponse(await equipmentTypeApi.delete(id), res.config);
      }

      // 设备名称
      if (url?.includes('/api/basic/equipmentName/list')) {
        return createMockResponse(await equipmentNameApi.getList(), res.config);
      }
      if (url?.match(/\/api\/basic\/equipmentName\/detail\/\w+/)) {
        const id = url.split('/').pop() || '';
        return createMockResponse(await equipmentNameApi.getDetail(id), res.config);
      }
      if (url?.includes('/api/basic/equipmentName/save')) {
        const data = JSON.parse(reqData || '{}');
        return createMockResponse(await equipmentNameApi.save(data), res.config);
      }
      if (url?.match(/\/api\/basic\/equipmentName\/delete\/\w+/)) {
        const id = url.split('/').pop() || '';
        return createMockResponse(await equipmentNameApi.delete(id), res.config);
      }

      // 车间
      if (url?.includes('/api/basic/workshop/list')) {
        return createMockResponse(await workshopApi.getList(), res.config);
      }
      if (url?.match(/\/api\/basic\/workshop\/detail\/\w+/)) {
        const id = url.split('/').pop() || '';
        return createMockResponse(await workshopApi.getDetail(id), res.config);
      }
      if (url?.includes('/api/basic/workshop/save')) {
        const data = JSON.parse(reqData || '{}');
        return createMockResponse(await workshopApi.save(data), res.config);
      }
      if (url?.match(/\/api\/basic\/workshop\/delete\/\w+/)) {
        const id = url.split('/').pop() || '';
        return createMockResponse(await workshopApi.delete(id), res.config);
      }

      // 仓库
      if (url?.includes('/api/basic/warehouse/list')) {
        return createMockResponse(await warehouseApi.getList(), res.config);
      }
      if (url?.match(/\/api\/basic\/warehouse\/detail\/\w+/)) {
        const id = url.split('/').pop() || '';
        return createMockResponse(await warehouseApi.getDetail(id), res.config);
      }
      if (url?.includes('/api/basic/warehouse/save')) {
        const data = JSON.parse(reqData || '{}');
        return createMockResponse(await warehouseApi.save(data), res.config);
      }
      if (url?.match(/\/api\/basic\/warehouse\/delete\/\w+/)) {
        const id = url.split('/').pop() || '';
        return createMockResponse(await warehouseApi.delete(id), res.config);
      }

      // 供应商
      if (url?.includes('/api/basic/supplier/list')) {
        return createMockResponse(await supplierApi.getList(), res.config);
      }
      if (url?.match(/\/api\/basic\/supplier\/detail\/\w+/)) {
        const id = url.split('/').pop() || '';
        return createMockResponse(await supplierApi.getDetail(id), res.config);
      }
      if (url?.includes('/api/basic/supplier/save')) {
        const data = JSON.parse(reqData || '{}');
        return createMockResponse(await supplierApi.save(data), res.config);
      }
      if (url?.match(/\/api\/basic\/supplier\/delete\/\w+/)) {
        const id = url.split('/').pop() || '';
        return createMockResponse(await supplierApi.delete(id), res.config);
      }

      // 点检标准
      if (url?.includes('/api/check/standard/list')) {
        return createMockResponse(await checkStandardApi.getList(), res.config);
      }
      if (url?.match(/\/api\/check\/standard\/detail\/\w+/)) {
        const id = url.split('/').pop() || '';
        return createMockResponse(await checkStandardApi.getDetail(id), res.config);
      }
      if (url?.includes('/api/check/standard/save') && reqData) {
        const data = JSON.parse(reqData);
        return createMockResponse(await checkStandardApi.save(data), res.config);
      }
      if (url?.match(/\/api\/check\/standard\/delete\/\w+/)) {
        const id = url.split('/').pop() || '';
        return createMockResponse(await checkStandardApi.delete(id), res.config);
      }

      // 点检记录
      if (url?.includes('/api/check/record/list')) {
        return createMockResponse(await checkRecordApi.getList(), res.config);
      }
      if (url?.match(/\/api\/check\/record\/detail\/\w+/)) {
        const id = url.split('/').pop() || '';
        return createMockResponse(await checkRecordApi.getDetail(id), res.config);
      }
      if (url?.includes('/api/check/record/save') && reqData) {
        const data = JSON.parse(reqData);
        return createMockResponse(await checkRecordApi.save(data), res.config);
      }
      if (url?.match(/\/api\/check\/record\/delete\/\w+/)) {
        const id = url.split('/').pop() || '';
        return createMockResponse(await checkRecordApi.delete(id), res.config);
      }

      // 巡检方案
      if (url?.includes('/api/patrol/plan/list')) {
        return createMockResponse(await patrolPlanApi.getList(), res.config);
      }
      if (url?.match(/\/api\/patrol\/plan\/detail\/\w+/)) {
        const id = url.split('/').pop() || '';
        return createMockResponse(await patrolPlanApi.getDetail(id), res.config);
      }
      if (url?.includes('/api/patrol/plan/save')) {
        const data = JSON.parse(reqData || '{}');
        return createMockResponse(await patrolPlanApi.save(data), res.config);
      }
      if (url?.match(/\/api\/patrol\/plan\/delete\/\w+/)) {
        const id = url.split('/').pop() || '';
        return createMockResponse(await patrolPlanApi.delete(id), res.config);
      }

      // 巡检记录
      if (url?.includes('/api/patrol/record/list')) {
        return createMockResponse(await patrolRecordApi.getList(), res.config);
      }
      if (url?.match(/\/api\/patrol\/record\/detail\/\w+/)) {
        const id = url.split('/').pop() || '';
        return createMockResponse(await patrolRecordApi.getDetail(id), res.config);
      }
      if (url?.includes('/api/patrol/record/save')) {
        const data = JSON.parse(reqData || '{}');
        return createMockResponse(await patrolRecordApi.save(data), res.config);
      }
      if (url?.match(/\/api\/patrol\/record\/delete\/\w+/)) {
        const id = url.split('/').pop() || '';
        return createMockResponse(await patrolRecordApi.delete(id), res.config);
      }

      return createMockResponse(res.data, res.config);
    },
    error => Promise.reject(error)
  );
};

// 设置设备管理的mock
const setupEquipmentMocks = () => {
  axios.interceptors.response.use(
    async (res: AxiosResponse): Promise<AxiosResponse<ApiResponse<any>>> => {
      const { url, data: reqData } = res.config;

      // 设备类型
      if (url?.includes('/api/equipment/type/list')) {
        return createMockResponse(await equipmentTypeApi.getList(), res.config);
      }
      if (url?.match(/\/api\/equipment\/type\/detail\/\w+/)) {
        const id = url.split('/').pop() || '';
        return createMockResponse(await equipmentTypeApi.getDetail(id), res.config);
      }
      if (url?.includes('/api/equipment/type/save')) {
        const data = JSON.parse(reqData || '{}');
        return createMockResponse(await equipmentTypeApi.save(data), res.config);
      }
      if (url?.match(/\/api\/equipment\/type\/delete\/\w+/)) {
        const id = url.split('/').pop() || '';
        return createMockResponse(await equipmentTypeApi.delete(id), res.config);
      }

      return createMockResponse(res.data, res.config);
    },
    error => Promise.reject(error)
  );
};

// 设置维护管理的mock
const setupMaintenanceMocks = () => {
  axios.interceptors.response.use(
    async (res: AxiosResponse): Promise<AxiosResponse<ApiResponse<any>>> => {
      const { url, data: reqData } = res.config;

      // 维护记录
      if (url?.includes('/api/maintenance/record/list')) {
        return createMockResponse(await maintenanceRecordApi.getList(), res.config);
      }
      if (url?.match(/\/api\/maintenance\/record\/detail\/\w+/)) {
        const id = url.split('/').pop() || '';
        return createMockResponse(await maintenanceRecordApi.getDetail(id), res.config);
      }
      if (url?.includes('/api/maintenance/record/save')) {
        const data = JSON.parse(reqData || '{}');
        return createMockResponse(await maintenanceRecordApi.save(data), res.config);
      }
      if (url?.match(/\/api\/maintenance\/record\/delete\/\w+/)) {
        const id = url.split('/').pop() || '';
        return createMockResponse(await maintenanceRecordApi.delete(id), res.config);
      }

      // 维护计划
      if (url?.includes('/api/maintenance/plan/list')) {
        return createMockResponse(await maintenancePlanApi.getList(), res.config);
      }
      if (url?.match(/\/api\/maintenance\/plan\/detail\/\w+/)) {
        const id = url.split('/').pop() || '';
        return createMockResponse(await maintenancePlanApi.getDetail(id), res.config);
      }
      if (url?.includes('/api/maintenance/plan/save')) {
        const data = JSON.parse(reqData || '{}');
        return createMockResponse(await maintenancePlanApi.save(data), res.config);
      }
      if (url?.match(/\/api\/maintenance\/plan\/delete\/\w+/)) {
        const id = url.split('/').pop() || '';
        return createMockResponse(await maintenancePlanApi.delete(id), res.config);
      }

      return createMockResponse(res.data, res.config);
    },
    error => Promise.reject(error)
  );
};

// 设置备件管理的mock
const setupSpareMocks = () => {
  axios.interceptors.response.use(
    async (res: AxiosResponse): Promise<AxiosResponse<ApiResponse<any>>> => {
      const { url, data: reqData } = res.config;

      // 备件
      if (url?.includes('/api/spare/part/list')) {
        return createMockResponse(await sparePartApi.getList(), res.config);
      }
      if (url?.match(/\/api\/spare\/part\/detail\/\w+/)) {
        const id = url.split('/').pop() || '';
        return createMockResponse(await sparePartApi.getDetail(id), res.config);
      }
      if (url?.includes('/api/spare/part/save')) {
        const data = JSON.parse(reqData || '{}');
        return createMockResponse(await sparePartApi.save(data), res.config);
      }
      if (url?.match(/\/api\/spare\/part\/delete\/\w+/)) {
        const id = url.split('/').pop() || '';
        return createMockResponse(await sparePartApi.delete(id), res.config);
      }

      // 备件使用记录
      if (url?.includes('/api/spare/use/list')) {
        return createMockResponse(await spareUseApi.getList(), res.config);
      }
      if (url?.match(/\/api\/spare\/use\/detail\/\w+/)) {
        const id = url.split('/').pop() || '';
        return createMockResponse(await spareUseApi.getDetail(id), res.config);
      }
      if (url?.includes('/api/spare/use/save')) {
        const data = JSON.parse(reqData || '{}');
        return createMockResponse(await spareUseApi.save(data), res.config);
      }
      if (url?.match(/\/api\/spare\/use\/delete\/\w+/)) {
        const id = url.split('/').pop() || '';
        return createMockResponse(await spareUseApi.delete(id), res.config);
      }

      return createMockResponse(res.data, res.config);
    },
    error => Promise.reject(error)
  );
};

// 设置点检和巡检的mock
const setupInspectionMocks = () => {
  axios.interceptors.response.use(
    async (res: AxiosResponse): Promise<AxiosResponse<ApiResponse<any>>> => {
      const { url, data: reqData } = res.config;

      // 点检标准
      if (url?.includes('/api/check/standard/list')) {
        return createMockResponse(await checkStandardApi.getList(), res.config);
      }
      if (url?.match(/\/api\/check\/standard\/detail\/\w+/)) {
        const id = url.split('/').pop() || '';
        return createMockResponse(await checkStandardApi.getDetail(id), res.config);
      }
      if (url?.includes('/api/check/standard/save')) {
        const data = JSON.parse(reqData || '{}');
        return createMockResponse(await checkStandardApi.save(data), res.config);
      }
      if (url?.match(/\/api\/check\/standard\/delete\/\w+/)) {
        const id = url.split('/').pop() || '';
        return createMockResponse(await checkStandardApi.delete(id), res.config);
      }

      // 点检记录
      if (url?.includes('/api/check/record/list')) {
        return createMockResponse(await checkRecordApi.getList(), res.config);
      }
      if (url?.match(/\/api\/check\/record\/detail\/\w+/)) {
        const id = url.split('/').pop() || '';
        return createMockResponse(await checkRecordApi.getDetail(id), res.config);
      }
      if (url?.includes('/api/check/record/save')) {
        const data = JSON.parse(reqData || '{}');
        return createMockResponse(await checkRecordApi.save(data), res.config);
      }
      if (url?.match(/\/api\/check\/record\/delete\/\w+/)) {
        const id = url.split('/').pop() || '';
        return createMockResponse(await checkRecordApi.delete(id), res.config);
      }

      // 巡检方案
      if (url?.includes('/api/patrol/plan/list')) {
        return createMockResponse(await patrolPlanApi.getList(), res.config);
      }
      if (url?.match(/\/api\/patrol\/plan\/detail\/\w+/)) {
        const id = url.split('/').pop() || '';
        return createMockResponse(await patrolPlanApi.getDetail(id), res.config);
      }
      if (url?.includes('/api/patrol/plan/save')) {
        const data = JSON.parse(reqData || '{}');
        return createMockResponse(await patrolPlanApi.save(data), res.config);
      }
      if (url?.match(/\/api\/patrol\/plan\/delete\/\w+/)) {
        const id = url.split('/').pop() || '';
        return createMockResponse(await patrolPlanApi.delete(id), res.config);
      }

      // 巡检记录
      if (url?.includes('/api/patrol/record/list')) {
        return createMockResponse(await patrolRecordApi.getList(), res.config);
      }
      if (url?.match(/\/api\/patrol\/record\/detail\/\w+/)) {
        const id = url.split('/').pop() || '';
        return createMockResponse(await patrolRecordApi.getDetail(id), res.config);
      }
      if (url?.includes('/api/patrol/record/save')) {
        const data = JSON.parse(reqData || '{}');
        return createMockResponse(await patrolRecordApi.save(data), res.config);
      }
      if (url?.match(/\/api\/patrol\/record\/delete\/\w+/)) {
        const id = url.split('/').pop() || '';
        return createMockResponse(await patrolRecordApi.delete(id), res.config);
      }

      return createMockResponse(res.data, res.config);
    },
    error => Promise.reject(error)
  );
};

// 模拟服务
export const mockService = {
  // 处理请求方法，替代axios
  processRequest: async (method: string, url: string, data?: any, config?: any) => {
    // 创建一个模拟的响应
    const mockResponse = {
      code: 200,
      message: 'success',
      data: {}
    };

    try {
      console.log(`Mock处理请求: ${method} ${url}`);
      
      // 设备类型相关API
      if (url.includes('/api/basic/equipmentType/list')) {
        const result = await equipmentTypeApi.getList();
        return result;
      }
      if (url.match(/\/api\/basic\/equipmentType\/detail\/\w+/)) {
        const id = url.split('/').pop() || '';
        const result = await equipmentTypeApi.getDetail(id);
        return result;
      }
      if (url.includes('/api/basic/equipmentType/save') && (method === 'POST' || method === 'PUT')) {
        const result = await equipmentTypeApi.save(data);
        return result;
      }
      if (url.match(/\/api\/basic\/equipmentType\/delete\/\w+/) && method === 'DELETE') {
        const id = url.split('/').pop() || '';
        const result = await equipmentTypeApi.delete(id);
        return result;
      }

      // 设备名称相关API
      if (url.includes('/api/basic/equipmentName/list')) {
        const result = await equipmentNameApi.getList();
        return result;
      }
      if (url.match(/\/api\/basic\/equipmentName\/detail\/\w+/)) {
        const id = url.split('/').pop() || '';
        const result = await equipmentNameApi.getDetail(id);
        return result;
      }
      if (url.includes('/api/basic/equipmentName/save') && (method === 'POST' || method === 'PUT')) {
        const result = await equipmentNameApi.save(data);
        return result;
      }
      if (url.match(/\/api\/basic\/equipmentName\/delete\/\w+/) && method === 'DELETE') {
        const id = url.split('/').pop() || '';
        const result = await equipmentNameApi.delete(id);
        return result;
      }

      // 车间相关API
      if (url.includes('/api/basic/workshop/list')) {
        const result = await workshopApi.getList();
        return result;
      }
      if (url.match(/\/api\/basic\/workshop\/detail\/\w+/)) {
        const id = url.split('/').pop() || '';
        const result = await workshopApi.getDetail(id);
        return result;
      }
      if (url.includes('/api/basic/workshop/save') && (method === 'POST' || method === 'PUT')) {
        const result = await workshopApi.save(data);
        return result;
      }
      if (url.match(/\/api\/basic\/workshop\/delete\/\w+/) && method === 'DELETE') {
        const id = url.split('/').pop() || '';
        const result = await workshopApi.delete(id);
        return result;
      }

      // 仓库相关API
      if (url.includes('/api/basic/warehouse/list')) {
        const result = await warehouseApi.getList();
        return result;
      }
      if (url.match(/\/api\/basic\/warehouse\/detail\/\w+/)) {
        const id = url.split('/').pop() || '';
        const result = await warehouseApi.getDetail(id);
        return result;
      }
      if (url.includes('/api/basic/warehouse/save') && (method === 'POST' || method === 'PUT')) {
        const result = await warehouseApi.save(data);
        return result;
      }
      if (url.match(/\/api\/basic\/warehouse\/delete\/\w+/) && method === 'DELETE') {
        const id = url.split('/').pop() || '';
        const result = await warehouseApi.delete(id);
        return result;
      }

      // 供应商相关API
      if (url.includes('/api/basic/supplier/list')) {
        const result = await supplierApi.getList();
        return result;
      }
      if (url.match(/\/api\/basic\/supplier\/detail\/\w+/)) {
        const id = url.split('/').pop() || '';
        const result = await supplierApi.getDetail(id);
        return result;
      }
      if (url.includes('/api/basic/supplier/save') && (method === 'POST' || method === 'PUT')) {
        const result = await supplierApi.save(data);
        return result;
      }
      if (url.match(/\/api\/basic\/supplier\/delete\/\w+/) && method === 'DELETE') {
        const id = url.split('/').pop() || '';
        const result = await supplierApi.delete(id);
        return result;
      }

      // 设备相关API
      if (url.includes('/api/equipment/list')) {
        const result = await equipmentApi.getList();
        return result;
      }
      if (url.match(/\/api\/equipment\/detail\/\w+/)) {
        const id = url.split('/').pop() || '';
        const result = await equipmentApi.getDetail(id);
        return result;
      }
      if (url.includes('/api/equipment/save') && (method === 'POST' || method === 'PUT')) {
        const result = await equipmentApi.save(data);
        return result;
      }
      if (url.match(/\/api\/equipment\/delete\/\w+/) && method === 'DELETE') {
        const id = url.split('/').pop() || '';
        const result = await equipmentApi.delete(id);
        return result;
      }

      // 维护记录相关API
      if (url.includes('/api/maintenance/record/list')) {
        // 提取equipmentId参数
        let equipmentId;
        if (url.includes('?')) {
          equipmentId = new URLSearchParams(url.split('?')[1]).get('equipmentId') || undefined;
        }
        const result = await maintenanceRecordApi.getList(equipmentId as string);
        return result;
      }
      if (url.match(/\/api\/maintenance\/record\/detail\/\w+/)) {
        const id = url.split('/').pop() || '';
        const result = await maintenanceRecordApi.getDetail(id);
        return result;
      }
      if (url.includes('/api/maintenance/record/save') && (method === 'POST' || method === 'PUT')) {
        const result = await maintenanceRecordApi.save(data);
        return result;
      }
      if (url.match(/\/api\/maintenance\/record\/delete\/\w+/) && method === 'DELETE') {
        const id = url.split('/').pop() || '';
        const result = await maintenanceRecordApi.delete(id);
        return result;
      }

      // 维护计划相关API
      if (url.includes('/api/maintenance/plan/list')) {
        // 提取equipmentId参数
        let equipmentId;
        if (url.includes('?')) {
          equipmentId = new URLSearchParams(url.split('?')[1]).get('equipmentId') || undefined;
        }
        const result = await maintenancePlanApi.getList(equipmentId as string);
        return result;
      }
      if (url.match(/\/api\/maintenance\/plan\/detail\/\w+/)) {
        const id = url.split('/').pop() || '';
        const result = await maintenancePlanApi.getDetail(id);
        return result;
      }
      if (url.includes('/api/maintenance/plan/save') && (method === 'POST' || method === 'PUT')) {
        const result = await maintenancePlanApi.save(data);
        return result;
      }
      if (url.match(/\/api\/maintenance\/plan\/delete\/\w+/) && method === 'DELETE') {
        const id = url.split('/').pop() || '';
        const result = await maintenancePlanApi.delete(id);
        return result;
      }

      // 备件相关API
      if (url.includes('/api/spare/part/list')) {
        const result = await sparePartApi.getList();
        return result;
      }
      if (url.match(/\/api\/spare\/part\/detail\/\w+/)) {
        const id = url.split('/').pop() || '';
        const result = await sparePartApi.getDetail(id);
        return result;
      }
      if (url.includes('/api/spare/part/save') && (method === 'POST' || method === 'PUT')) {
        const result = await sparePartApi.save(data);
        return result;
      }
      if (url.match(/\/api\/spare\/part\/delete\/\w+/) && method === 'DELETE') {
        const id = url.split('/').pop() || '';
        const result = await sparePartApi.delete(id);
        return result;
      }

      // 备件使用记录相关API
      if (url.includes('/api/spare/use/list')) {
        // 提取参数
        let sparePartId, equipmentId;
        if (url.includes('?')) {
          const params = new URLSearchParams(url.split('?')[1]);
          sparePartId = params.get('sparePartId') || undefined;
          equipmentId = params.get('equipmentId') || undefined;
        }
        const result = await spareUseApi.getList(sparePartId as string, equipmentId as string);
        return result;
      }
      if (url.match(/\/api\/spare\/use\/detail\/\w+/)) {
        const id = url.split('/').pop() || '';
        const result = await spareUseApi.getDetail(id);
        return result;
      }
      if (url.includes('/api/spare/use/save') && (method === 'POST' || method === 'PUT')) {
        const result = await spareUseApi.save(data);
        return result;
      }
      if (url.match(/\/api\/spare\/use\/delete\/\w+/) && method === 'DELETE') {
        const id = url.split('/').pop() || '';
        const result = await spareUseApi.delete(id);
        return result;
      }

      // 点检标准相关API
      if (url.includes('/api/check/standard/list')) {
        return { data: await checkStandardApi.getList() };
      }
      if (url.match(/\/api\/check\/standard\/detail\/\w+/)) {
        const id = url.split('/').pop() || '';
        return { data: await checkStandardApi.getDetail(id) };
      }
      if (url.includes('/api/check/standard/save') && (method === 'POST' || method === 'PUT')) {
        const data = JSON.parse(requestData || '{}');
        return { data: await checkStandardApi.save(data) };
      }
      if (url.match(/\/api\/check\/standard\/delete\/\w+/)) {
        const id = url.split('/').pop() || '';
        return { data: await checkStandardApi.delete(id) };
      }

      // 点检记录相关API
      if (url.includes('/api/check/record/list')) {
        return { data: await checkRecordApi.getList() };
      }
      if (url.match(/\/api\/check\/record\/detail\/\w+/)) {
        const id = url.split('/').pop() || '';
        return { data: await checkRecordApi.getDetail(id) };
      }
      if (url.includes('/api/check/record/save') && (method === 'POST' || method === 'PUT')) {
        const data = JSON.parse(requestData || '{}');
        return { data: await checkRecordApi.save(data) };
      }
      if (url.match(/\/api\/check\/record\/delete\/\w+/)) {
        const id = url.split('/').pop() || '';
        return { data: await checkRecordApi.delete(id) };
      }

      // 巡检方案相关API
      if (url.includes('/api/patrol/plan/list')) {
        const result = await patrolPlanApi.getList();
        return result;
      }
      if (url.match(/\/api\/patrol\/plan\/detail\/\w+/)) {
        const id = url.split('/').pop() || '';
        const result = await patrolPlanApi.getDetail(id);
        return result;
      }
      if (url.includes('/api/patrol/plan/save') && (method === 'POST' || method === 'PUT')) {
        const result = await patrolPlanApi.save(data);
        return result;
      }
      if (url.match(/\/api\/patrol\/plan\/delete\/\w+/) && method === 'DELETE') {
        const id = url.split('/').pop() || '';
        const result = await patrolPlanApi.delete(id);
        return result;
      }

      // 巡检记录相关API
      if (url.includes('/api/patrol/record/list')) {
        const result = await patrolRecordApi.getList();
        return result;
      }
      if (url.match(/\/api\/patrol\/record\/detail\/\w+/)) {
        const id = url.split('/').pop() || '';
        const result = await patrolRecordApi.getDetail(id);
        return result;
      }
      if (url.includes('/api/patrol/record/save') && (method === 'POST' || method === 'PUT')) {
        const result = await patrolRecordApi.save(data);
        return result;
      }
      if (url.match(/\/api\/patrol\/record\/delete\/\w+/) && method === 'DELETE') {
        const id = url.split('/').pop() || '';
        const result = await patrolRecordApi.delete(id);
        return result;
      }

      // 如果没有匹配的URL，返回默认响应
      console.warn('未匹配到URL', url);
      return mockResponse;
    } catch (error) {
      console.error('模拟数据处理错误:', error);
      return {
        code: 500,
        message: '模拟数据处理错误',
        data: null
      };
    }
  },

  // 帮助方法：检查URL是否应该被Mock处理
  shouldMock(url: string) {
    // 所有API请求都应该被Mock处理
    return url.includes('/api/');
  },

  // 处理请求的方法
  handleRequest(url: string, method: string, data?: any) {
    return this.processRequest(method, url, data);
  },

  // 模拟get请求
  get: (url: string, config?: any) => {
    return mockService.processRequest('GET', url, undefined, config);
  },

  // 模拟post请求
  post: (url: string, data?: any, config?: any) => {
    return mockService.processRequest('POST', url, data, config);
  },

  // 模拟put请求
  put: (url: string, data?: any, config?: any) => {
    return mockService.processRequest('PUT', url, data, config);
  },

  // 模拟delete请求
  delete: (url: string, config?: any) => {
    return mockService.processRequest('DELETE', url, undefined, config);
  }
};

// 自动设置mock服务
setupMockApi(); 