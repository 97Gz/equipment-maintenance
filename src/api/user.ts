import request from '../utils/request';

// 登录
export function login(data: { username: string; password: string }) {
  return request({
    url: '/api/login',
    method: 'post',
    data
  });
}

// 退出登录
export function logout() {
  return request({
    url: '/api/logout',
    method: 'post'
  });
}

// 获取用户信息
export function getUserInfo() {
  return request({
    url: '/api/user/info',
    method: 'get'
  });
} 