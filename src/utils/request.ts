import axios from 'axios';
import { showToast, showDialog } from 'vant';
import router from '../router';

// 创建axios实例
const service = axios.create({
  baseURL: '',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
});

// 添加mock拦截器（必须在其他拦截器之前）
import { handleMockRequest } from './mock';

service.interceptors.request.use(
  async (config) => {
    // 检查是否是API请求
    if (config.url?.startsWith('/api/')) {
      console.log('[Mock Request]', config.url);
      
      try {
        // 模拟网络延迟
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // 根据请求URL返回不同的模拟数据
        const mockResponse = await handleMockRequest(config);
        
        // 截断请求链，直接返回模拟数据
        throw {
          response: {
            data: mockResponse,
            status: 200,
            statusText: 'OK',
            headers: {},
            config
          },
          isAxiosError: true,
          toJSON: () => ({})
        };
      } catch (error: any) {
        if (error.response?.data) {
          // 这是我们抛出的带有mock数据的错误
          return Promise.reject(error);
        }
        // 其他错误正常传递
        console.error('[Mock Error]', error);
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 获取token，携带到请求头中
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const res = response.data;
    
    // 根据自定义状态码判断请求是否成功
    if (res.code !== 200) {
      showToast({
        type: 'fail',
        message: res.message || '请求失败',
        duration: 3000
      });
      
      // 权限不足或token过期
      if (res.code === 401 || res.code === 403) {
        showDialog({
          title: '提示',
          message: '您的登录状态已过期，请重新登录',
          confirmButtonText: '重新登录',
          callback: (action: 'confirm' | 'cancel') => {
            if (action === 'confirm') {
              localStorage.removeItem('token');
              router.push('/login');
            }
          }
        });
      }
      
      return Promise.reject(res);
    } else {
      return res;
    }
  },
  (error: any) => {
    // 如果是我们的mock响应，直接返回数据
    if (error.response?.data && error.isAxiosError) {
      return error.response.data;
    }
    
    showToast({
      type: 'fail',
      message: error.message || '请求错误',
      duration: 3000
    });
    return Promise.reject(error);
  }
);

export default service; 