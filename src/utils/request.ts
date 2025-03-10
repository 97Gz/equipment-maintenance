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
          confirmButtonText: '重新登录'
        }).then(() => {
          localStorage.removeItem('token');
          router.push('/login');
        });
      }
      
      return Promise.reject(res);
    } else {
      return res;
    }
  },
  (error) => {
    showToast({
      type: 'fail',
      message: error.message || '请求错误',
      duration: 3000
    });
    return Promise.reject(error);
  }
);

export default service; 