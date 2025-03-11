<template>
  <div class="profile-container">
    <nav-bar title="个人信息" :show-back="false" />
    
    <div class="content">
      <!-- 用户信息卡片 -->
      <div class="user-info-card">
        <div class="user-avatar">
          <van-image
            round
            width="60"
            height="60"
            src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"
            :show-loading="true"
          />
        </div>
        <div class="user-details">
          <h3 class="user-name">张工程师</h3>
          <p class="user-position">设备主管 | 机加工车间</p>
        </div>
      </div>
      
      <!-- 账号信息 -->
      <div class="card-section">
        <div class="section-title">账号信息</div>
        <van-cell-group inset>
          <van-cell title="用户名" value="zhangxm" />
          <van-cell title="账号权限" value="设备管理员" />
          <van-cell title="手机号码" value="138****8000" is-link @click="showModifyMobileDialog = true" />
          <van-cell title="修改密码" is-link @click="showModifyPasswordDialog = true" />
        </van-cell-group>
      </div>
      
      <!-- 系统信息 -->
      <div class="card-section">
        <div class="section-title">系统信息</div>
        <van-cell-group inset>
          <van-cell title="当前版本" value="v1.0.0" />
          <van-cell title="关于系统" is-link @click="showAboutDialog = true" />
        </van-cell-group>
      </div>
      
      <!-- 其他设置 -->
      <div class="card-section">
        <div class="section-title">其他设置</div>
        <van-cell-group inset>
          <van-cell title="系统设置" is-link @click="navigateTo('/settings')" />
          <van-cell title="清除缓存" is-link @click="showClearCacheDialog = true" />
          <van-cell title="退出登录" is-link @click="showLogoutDialog = true" />
        </van-cell-group>
      </div>
      
      <!-- 版权信息 -->
      <div class="copyright">
        <p>© 2023 设备管理系统</p>
        <p>版本号: v1.0.0</p>
      </div>
    </div>
    
    <!-- 修改手机号弹窗 -->
    <van-dialog
      v-model:show="showModifyMobileDialog"
      title="修改手机号"
      confirm-button-text="确认"
      show-cancel-button
    >
      <van-form>
        <van-cell-group inset>
          <van-field
            v-model="mobileForm.current"
            type="tel"
            label="当前手机号"
            placeholder="请输入当前手机号"
            readonly
          />
          <van-field
            v-model="mobileForm.new"
            type="tel"
            label="新手机号"
            placeholder="请输入新手机号"
            :rules="[{ required: true, message: '请输入新手机号' }]"
          />
          <van-field
            v-model="mobileForm.code"
            center
            clearable
            label="验证码"
            placeholder="请输入验证码"
            :rules="[{ required: true, message: '请输入验证码' }]"
          >
            <template #button>
              <van-button size="small" type="primary" @click="sendVerificationCode">发送验证码</van-button>
            </template>
          </van-field>
        </van-cell-group>
      </van-form>
    </van-dialog>
    
    <!-- 修改密码弹窗 -->
    <van-dialog
      v-model:show="showModifyPasswordDialog"
      title="修改密码"
      confirm-button-text="确认"
      show-cancel-button
    >
      <van-form>
        <van-cell-group inset>
          <van-field
            v-model="passwordForm.current"
            type="password"
            label="当前密码"
            placeholder="请输入当前密码"
            :rules="[{ required: true, message: '请输入当前密码' }]"
          />
          <van-field
            v-model="passwordForm.new"
            type="password"
            label="新密码"
            placeholder="请输入新密码"
            :rules="[{ required: true, message: '请输入新密码' }]"
          />
          <van-field
            v-model="passwordForm.confirm"
            type="password"
            label="确认新密码"
            placeholder="请再次输入新密码"
            :rules="[{ required: true, message: '请确认新密码' }]"
          />
        </van-cell-group>
      </van-form>
    </van-dialog>
    
    <!-- 关于系统弹窗 -->
    <van-dialog
      v-model:show="showAboutDialog"
      title="关于系统"
      confirm-button-text="确定"
      :show-cancel-button="false"
    >
      <div class="about-content">
        <p><b>设备管理系统</b></p>
        <p>版本: v1.0.0</p>
        <p>该系统用于管理企业设备的全生命周期，包括设备档案、设备点检、设备巡检、设备维修和保养管理。</p>
        <p>© 2023 版权所有</p>
      </div>
    </van-dialog>
    
    <!-- 清除缓存确认弹窗 -->
    <van-dialog
      v-model:show="showClearCacheDialog"
      title="清除缓存"
      confirm-button-text="确认清除"
      show-cancel-button
      @confirm="clearCache"
    >
      <p class="dialog-content">确认要清除缓存吗？</p>
    </van-dialog>
    
    <!-- 退出登录确认弹窗 -->
    <van-dialog
      v-model:show="showLogoutDialog"
      title="退出登录"
      confirm-button-text="确认退出"
      show-cancel-button
      @confirm="logout"
    >
      <p class="dialog-content">确认要退出登录吗？</p>
    </van-dialog>
    
    <tab-bar />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { showToast } from 'vant';
import NavBar from '@/components/NavBar.vue';
import TabBar from '@/components/TabBar.vue';

const router = useRouter();

// 对话框显示状态
const showModifyMobileDialog = ref(false);
const showModifyPasswordDialog = ref(false);
const showAboutDialog = ref(false);
const showClearCacheDialog = ref(false);
const showLogoutDialog = ref(false);

// 表单数据
const mobileForm = ref({
  current: '138****8000',
  new: '',
  code: ''
});

const passwordForm = ref({
  current: '',
  new: '',
  confirm: ''
});

// 导航到指定路由
const navigateTo = (path: string) => {
  router.push(path);
};

// 发送验证码
const sendVerificationCode = () => {
  if (!mobileForm.value.new) {
    showToast('请输入新手机号');
    return;
  }
  showToast('验证码已发送');
};

// 清除缓存
const clearCache = () => {
  showToast('缓存已清除');
};

// 退出登录
const logout = () => {
  // 清除用户登录信息
  localStorage.removeItem('token');
  // 跳转到登录页面
  router.push('/login');
};
</script>

<style scoped>
.profile-container {
  padding-top: 46px;
  padding-bottom: 50px;
  min-height: 100vh;
  background-color: var(--background-color);
}

.content {
  padding: 8px;
}

.user-info-card {
  display: flex;
  align-items: center;
  background-color: var(--card-background);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.user-avatar {
  margin-right: 16px;
}

.user-details {
  flex: 1;
}

.user-name {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-color);
  margin: 0 0 4px 0;
}

.user-position {
  font-size: 14px;
  color: var(--text-color-secondary);
  margin: 0;
}

.card-section {
  margin-bottom: 16px;
}

.section-title {
  font-size: 15px;
  font-weight: 500;
  color: var(--text-color-secondary);
  margin-bottom: 8px;
  padding-left: 12px;
}

.copyright {
  text-align: center;
  padding: 16px 0;
  color: var(--text-color-secondary);
  font-size: 12px;
}

.copyright p {
  margin: 4px 0;
}

.dialog-content {
  padding: 16px;
  text-align: center;
}

.about-content {
  padding: 16px;
  text-align: center;
  line-height: 1.6;
}
</style> 