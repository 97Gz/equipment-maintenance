import { defineStore } from 'pinia';

interface UserState {
  token: string;
  userInfo: {
    id: string;
    name: string;
    avatar: string;
    role: string;
  };
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    token: localStorage.getItem('token') || '',
    userInfo: {
      id: '',
      name: '',
      avatar: '',
      role: ''
    }
  }),
  
  getters: {
    isLogin: (state) => !!state.token
  },
  
  actions: {
    // 登录
    async login(username: string, password: string) {
      // 模拟登录接口
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          const token = 'mock_token_' + Date.now();
          this.token = token;
          localStorage.setItem('token', token);
          
          this.userInfo = {
            id: '1001',
            name: username,
            avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
            role: 'admin'
          };
          
          resolve();
        }, 1000);
      });
    },
    
    // 退出登录
    async logout() {
      return new Promise<void>((resolve) => {
        this.token = '';
        this.userInfo = {
          id: '',
          name: '',
          avatar: '',
          role: ''
        };
        localStorage.removeItem('token');
        resolve();
      });
    },
    
    // 获取用户信息
    async getUserInfo() {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          this.userInfo = {
            id: '1001',
            name: '管理员',
            avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
            role: 'admin'
          };
          resolve();
        }, 500);
      });
    }
  }
}); 