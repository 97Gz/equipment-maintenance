<template>
  <div class="login-container">
    <div class="login-header">
      <div class="logo">
        <van-icon name="setting-o" size="40" color="#1a56db" />
      </div>
      <h2 class="title">设备管理系统</h2>
      <p class="subtitle">专业的设备管理解决方案</p>
    </div>
    
    <div class="login-form">
      <van-form @submit="onSubmit">
        <van-cell-group inset>
          <van-field
            v-model="username"
            name="username"
            label="用户名"
            placeholder="请输入用户名"
            :rules="[{ required: true, message: '请输入用户名' }]"
            clearable
          />
          <van-field
            v-model="password"
            type="password"
            name="password"
            label="密码"
            placeholder="请输入密码"
            :rules="[{ required: true, message: '请输入密码' }]"
            clearable
          />
        </van-cell-group>
        
        <div class="login-btn">
          <van-button
            round
            block
            type="primary"
            native-type="submit"
            :loading="loading"
            loading-text="登录中..."
          >
            登录
          </van-button>
        </div>
      </van-form>
      
      <div class="login-tips">
        <p>提示：任意用户名密码即可登录</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { showNotify } from 'vant';
import { useUserStore } from '@/store/user';

const router = useRouter();
const userStore = useUserStore();

const username = ref('');
const password = ref('');
const loading = ref(false);

// 提交表单
const onSubmit = async (values: { username: string; password: string }) => {
  if (loading.value) return;
  
  loading.value = true;
  try {
    await userStore.login(values.username, values.password);
    showNotify({ type: 'success', message: '登录成功' });
    router.push('/home');
  } catch (error) {
    console.error('登录失败', error);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f8fafc;
  padding: 24px;
}

.login-header {
  margin-top: 60px;
  margin-bottom: 60px;
  text-align: center;
}

.logo {
  width: 80px;
  height: 80px;
  border-radius: 16px;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.title {
  font-size: 28px;
  color: #1a56db;
  margin-bottom: 8px;
  font-weight: 700;
}

.subtitle {
  font-size: 14px;
  color: #64748b;
}

.login-form {
  flex: 1;
}

.login-btn {
  margin: 32px 16px;
}

:deep(.van-button--primary) {
  background-color: #1a56db;
  border-color: #1a56db;
  height: 44px;
  font-size: 16px;
}

.login-tips {
  text-align: center;
  font-size: 14px;
  color: #94a3b8;
  margin-top: 24px;
}
</style>
