import axios from 'axios';
import { showToast, showDialog } from 'vant';
import router from '../router';
import { getApiConfig } from '../config';
import { mockService } from './mock/index';

// 创建axios实例
const request = axios.create({
  baseURL: getApiConfig().baseURL,
  timeout: getApiConfig().timeout,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器
request.interceptors.request.use(
  config => {
    // 可以在这里添加token等身份验证信息
    return config;
  },
  error => {
    console.error('请求错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  response => {
    const res = response.data;
    
    // 如果返回的状态码不是200，则判断为错误
    if (res.code !== 200) {
      showToast(res.message || '请求失败');
      return Promise.reject(new Error(res.message || '请求失败'));
    }
    
    return res;
  },
  error => {
    console.error('响应错误:', error);
    showToast(error.message || '请求失败');
    return Promise.reject(error);
  }
);

// 重写原始方法，添加Mock处理
const originalGet = request.get;
request.get = (async function(url, config) {
  try {
    console.log('请求URL:', url);
    if (mockService.shouldMock(url)) {
      console.log('Mock拦截Get请求:', url);
      const mockResponse = await mockService.handleRequest(url, 'GET');
      console.log('Mock响应:', mockResponse);
      return { data: mockResponse };
    }
    return originalGet(url, config);
  } catch (error) {
    console.error('请求处理错误:', error);
    throw error;
  }
}) as any;

const originalPost = request.post;
request.post = (async function(url, data, config) {
  try {
    console.log('请求URL:', url, '数据:', data);
    if (mockService.shouldMock(url)) {
      console.log('Mock拦截Post请求:', url);
      const mockResponse = await mockService.handleRequest(url, 'POST', data);
      console.log('Mock响应:', mockResponse);
      return { data: mockResponse };
    }
    return originalPost(url, data, config);
  } catch (error) {
    console.error('请求处理错误:', error);
    throw error;
  }
}) as any;

const originalDelete = request.delete;
request.delete = (async function(url, config) {
  try {
    console.log('请求URL:', url);
    if (mockService.shouldMock(url)) {
      console.log('Mock拦截Delete请求:', url);
      const mockResponse = await mockService.handleRequest(url, 'DELETE');
      console.log('Mock响应:', mockResponse);
      return { data: mockResponse };
    }
    return originalDelete(url, config);
  } catch (error) {
    console.error('请求处理错误:', error);
    throw error;
  }
}) as any;

const originalPut = request.put;
request.put = (async function(url, data, config) {
  try {
    console.log('请求URL:', url, '数据:', data);
    if (mockService.shouldMock(url)) {
      console.log('Mock拦截Put请求:', url);
      const mockResponse = await mockService.handleRequest(url, 'PUT', data);
      console.log('Mock响应:', mockResponse);
      return { data: mockResponse };
    }
    return originalPut(url, data, config);
  } catch (error) {
    console.error('请求处理错误:', error);
    throw error;
  }
}) as any;

// 导出请求实例
export type { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
export default request; 