/**
 * 全局配置文件
 */

// 环境类型定义
type EnvType = 'development' | 'production' | 'test';

// 获取当前环境（兼容不同执行环境）
export const getCurrentEnv = (): EnvType => {
  try {
    // 浏览器环境下使用import.meta.env
    if (typeof window !== 'undefined') {
      return (import.meta.env.MODE as EnvType) || 'development';
    }
    // Node环境下使用process.env
    return (process.env.NODE_ENV as EnvType) || 'development';
  } catch (e) {
    // 默认返回开发环境
    return 'development';
  }
};

// API请求地址配置
export const apiConfig = {
  // 开发环境API地址
  development: {
    baseURL: '/api', // 本地Mock API地址
    timeout: 10000,  // 请求超时时间（毫秒）
  },
  // 生产环境API地址
  production: {
    baseURL: 'https://api.example.com/api', // 实际生产环境API地址
    timeout: 15000,  // 请求超时时间（毫秒）
  },
  // 测试环境API地址
  test: {
    baseURL: 'https://test-api.example.com/api', // 测试环境API地址
    timeout: 10000,  // 请求超时时间（毫秒）
  }
};

// 获取当前环境的API配置
export const getApiConfig = () => {
  const currentEnv = getCurrentEnv();
  return apiConfig[currentEnv] || apiConfig.development;
};

// 服务器配置
export const serverConfig = {
  // 开发环境服务器配置
  development: {
    host: '192.168.31.206', // 服务器IP地址
    port: 3000,        // 服务器端口号
  },
  // 生产环境服务器配置
  production: {
    host: '0.0.0.0',   // 服务器IP地址
    port: 80,          // 服务器端口号
  },
  // 测试环境服务器配置
  test: {
    host: '192.168.31.206', // 服务器IP地址
    port: 8080,        // 服务器端口号
  }
};

// 获取当前环境的服务器配置
export const getServerConfig = () => {
  const currentEnv = getCurrentEnv();
  return serverConfig[currentEnv] || serverConfig.development;
};

// 系统配置
export const systemConfig = {
  // 应用名称
  appName: '设备维护管理系统',
  // 版本号
  version: '1.0.0',
  // 分页配置
  pagination: {
    defaultPageSize: 10,
    pageSizeOptions: [10, 20, 50, 100],
  },
  // 上传文件配置
  upload: {
    maxSize: 5 * 1024 * 1024, // 最大上传大小（5MB）
    acceptTypes: ['.jpg', '.jpeg', '.png', '.pdf', '.doc', '.docx', '.xls', '.xlsx'],
  }
};

export default {
  api: getApiConfig(),
  server: getServerConfig(),
  system: systemConfig,
}; 