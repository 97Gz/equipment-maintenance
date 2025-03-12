<template>
  <div class="plan-detail">
    <nav-bar :title="pageTitle" />
    
    <div class="content" v-if="!loading">
      <van-form @submit="submitForm">
        <!-- 基本信息 -->
        <div class="form-section">
          <div class="section-title">基本信息</div>
          <van-cell-group inset>
            <van-field
              v-model="formData.name"
              label="巡检方案名称"
              placeholder="请输入巡检方案名称"
              :readonly="isViewMode"
              :rules="[{ required: true, message: '请输入巡检方案名称' }]"
            />
            
            <van-field
              name="frequencyType"
              label="巡检频率"
              :readonly="isViewMode"
            >
              <template #input>
                <van-radio-group 
                  v-model="formData.frequencyType" 
                  direction="horizontal"
                  :disabled="isViewMode"
                >
                  <van-radio name="interval">固定时间间隔</van-radio>
                  <van-radio name="weekly">每周几</van-radio>
                  <van-radio name="monthly">每月几号</van-radio>
                </van-radio-group>
              </template>
            </van-field>
            
            <!-- 根据频率类型显示不同选项 -->
            <van-field
              v-if="formData.frequencyType === 'interval'"
              v-model="formData.intervalDays"
              type="number"
              label="巡检周期天数"
              placeholder="请输入巡检周期天数"
              :readonly="isViewMode"
              :rules="[{ required: true, message: '请输入巡检周期天数' }]"
            />
            
            <van-field
              v-if="formData.frequencyType === 'weekly'"
              name="weekDay"
              label="每周"
              :readonly="isViewMode"
            >
              <template #input>
                <van-dropdown-menu :disabled="isViewMode">
                  <van-dropdown-item v-model="formData.weekDay" :options="weekOptions" />
                </van-dropdown-menu>
              </template>
            </van-field>
            
            <van-field
              v-if="formData.frequencyType === 'monthly'"
              v-model="formData.monthDay"
              type="number"
              label="每月几号"
              placeholder="请输入日期(1-31)"
              :readonly="isViewMode"
              :rules="[
                { required: true, message: '请输入日期' },
                { validator: validateMonthDay, message: '日期必须在1-31之间' }
              ]"
            />
            
            <van-field
              v-model="formData.firstTime"
              label="首次巡检时间"
              placeholder="请选择首次巡检时间"
              readonly
              is-link
              @click="isViewMode ? null : (showDatePicker = true)"
              :rules="[{ required: true, message: '请选择首次巡检时间' }]"
            />
            
            <van-field
              v-model="formData.nextTime"
              label="再次巡检时间"
              placeholder="根据巡检频率自动计算"
              readonly
            />
          </van-cell-group>
        </div>
        
        <!-- 巡检项目明细 -->
        <div class="form-section">
          <div class="section-header">
            <div class="section-title">巡检项目明细</div>
            <van-button 
              v-if="isAddMode || isEditMode" 
              size="small" 
              type="primary" 
              icon="plus" 
              @click="addPlanItem"
            >添加</van-button>
          </div>
          
          <div v-if="formData.items.length === 0" class="empty-items">
            <van-empty description="暂无巡检项目" />
          </div>
          
          <div v-else>
            <div class="item-card" v-for="(item, index) in formData.items" :key="index">
              <div class="item-row">
                <div class="item-label">巡检项:</div>
                <div class="item-value" v-if="isViewMode">{{ item.name }}</div>
                <van-field
                  v-else
                  v-model="item.name"
                  placeholder="请输入巡检项名称"
                  :rules="[{ required: true, message: '请输入巡检项名称' }]"
                />
              </div>
              <div class="item-row">
                <div class="item-label">检查方法:</div>
                <div class="item-value" v-if="isViewMode">{{ item.method }}</div>
                <van-field
                  v-else
                  v-model="item.method"
                  placeholder="请输入检查方法"
                  :rules="[{ required: true, message: '请输入检查方法' }]"
                />
              </div>
              <div class="item-row">
                <div class="item-label">最小值:</div>
                <div class="item-value" v-if="isViewMode">{{ item.minValue }}</div>
                <van-field
                  v-else
                  v-model="item.minValue"
                  type="number"
                  placeholder="请输入最小值"
                />
              </div>
              <div class="item-row">
                <div class="item-label">最大值:</div>
                <div class="item-value" v-if="isViewMode">{{ item.maxValue }}</div>
                <van-field
                  v-else
                  v-model="item.maxValue"
                  type="number"
                  placeholder="请输入最大值"
                />
              </div>
              <div v-if="isAddMode || isEditMode" class="item-actions">
                <van-button size="small" type="danger" @click="removePlanItem(index)">删除</van-button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 提交按钮 -->
        <div class="form-padding"></div>
      </van-form>
    </div>
    
    <!-- 加载状态 -->
    <div class="loading-container" v-if="loading">
      <van-loading type="spinner" color="var(--primary-color)" size="36" />
      <p class="loading-text">加载中...</p>
    </div>
    
    <!-- 日期选择器 -->
    <van-calendar
      v-model:show="showDatePicker"
      @confirm="onSelectDate"
      :show-confirm="true"
      :round="false"
      title="选择首次巡检日期"
      color="#1989fa"
    />
    
    <!-- 固定在底部的保存按钮 -->
    <div class="fixed-bottom" v-if="isAddMode || isEditMode">
      <van-button round block type="primary" @click="submitForm">保存</van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { showToast, showSuccessToast } from 'vant';
import NavBar from '@/components/NavBar.vue';
import { usePatrolStore } from '@/store/patrol';
import type { PatrolPlan, PatrolPlanItem } from '@/utils/mock/patrol';

const route = useRoute();
const router = useRouter();
const patrolStore = usePatrolStore();

// 判断当前是添加模式还是编辑模式
const isAddMode = computed(() => !route.params.id || route.path.includes('/add'));
const isEditMode = computed(() => route.path.includes('/edit'));
const isViewMode = computed(() => !isAddMode.value && !isEditMode.value);
const planId = computed(() => route.params.id as string);

// 获取页面标题
const pageTitle = computed(() => {
  if (isAddMode.value) return '新增巡检方案';
  if (isEditMode.value) return '编辑巡检方案';
  return '巡检方案详情';
});

const loading = ref(true);
const showDatePicker = ref(false);

// 表单数据
const formData = reactive<{
  id?: string;
  name: string;
  frequencyType: string;
  intervalDays?: number;
  weekDay?: number;
  monthDay?: number;
  firstTime: string;
  nextTime: string;
  items: PatrolPlanItem[];
  createTime?: string;
  updateTime?: string;
}>({
  name: '',
  frequencyType: 'interval',
  intervalDays: 7,
  weekDay: 1,
  monthDay: 1,
  firstTime: '',
  nextTime: '',
  items: []
});

// 周选项
const weekOptions = [
  { text: '周日', value: 0 },
  { text: '周一', value: 1 },
  { text: '周二', value: 2 },
  { text: '周三', value: 3 },
  { text: '周四', value: 4 },
  { text: '周五', value: 5 },
  { text: '周六', value: 6 },
];

// 验证月份天数
const validateMonthDay = (val: string | number) => {
  const num = Number(val);
  return num >= 1 && num <= 31;
};

// 初始化数据
onMounted(async () => {
  try {
    if (!isAddMode.value && planId.value) {
      // 获取巡检方案详情
      const plan = await patrolStore.fetchPlanDetail(planId.value);
      if (plan) {
        Object.assign(formData, plan);
      }
    } else {
      // 设置默认首次巡检时间为当前日期
      const today = new Date();
      formData.firstTime = today.toISOString().split('T')[0];
      calculateNextTime();
    }
  } catch (error) {
    console.error('获取巡检方案详情失败', error);
    showToast('获取数据失败');
  } finally {
    loading.value = false;
  }
});

// 监听首次巡检时间和频率变化，重新计算下次巡检时间
watch(
  () => [formData.frequencyType, formData.intervalDays, formData.weekDay, formData.monthDay, formData.firstTime],
  () => {
    calculateNextTime();
  }
);

// 计算下次巡检时间
const calculateNextTime = () => {
  if (!formData.firstTime) return;
  
  formData.nextTime = patrolStore.calculateNextPatrolTime({
    frequencyType: formData.frequencyType,
    intervalDays: formData.intervalDays,
    weekDay: formData.weekDay,
    monthDay: formData.monthDay,
    firstTime: formData.firstTime
  });
};

// 日期选择回调
const onSelectDate = (date: Date) => {
  // 格式化日期为'YYYY-MM-DD'
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  formData.firstTime = `${year}-${month}-${day}`;
  calculateNextTime();
  showDatePicker.value = false;
};

// 添加巡检项目
const addPlanItem = () => {
  const newItem: PatrolPlanItem = {
    id: Date.now().toString(), // 临时ID
    name: '',
    method: '',
    minValue: 0,
    maxValue: 0
  };
  formData.items.push(newItem);
};

// 删除巡检项目
const removePlanItem = (index: number) => {
  formData.items.splice(index, 1);
};

// 提交表单
const submitForm = async () => {
  // 表单验证
  if (!formData.name) {
    showToast('请输入巡检方案名称');
    return;
  }
  
  if (formData.frequencyType === 'interval' && (!formData.intervalDays || formData.intervalDays <= 0)) {
    showToast('请输入有效的巡检周期天数');
    return;
  }
  
  if (formData.frequencyType === 'monthly' && (!formData.monthDay || formData.monthDay < 1 || formData.monthDay > 31)) {
    showToast('请输入有效的日期（1-31）');
    return;
  }
  
  if (!formData.firstTime) {
    showToast('请选择首次巡检时间');
    return;
  }
  
  if (formData.items.length === 0) {
    showToast('请添加至少一个巡检项目');
    return;
  }
  
  // 检查巡检项目是否完整
  for (const item of formData.items) {
    if (!item.name || !item.method) {
      showToast('请完善巡检项目信息');
      return;
    }
  }
  
  try {
    // 保存巡检方案
    await patrolStore.savePlan(formData);
    showSuccessToast('保存成功');
    
    // 返回上一页
    router.back();
  } catch (error) {
    console.error('保存巡检方案失败', error);
    showToast('保存失败');
  }
};
</script>

<style scoped>
.plan-detail {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--van-background);
}

.content {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 70px;
}

.form-section {
  margin-bottom: 16px;
}

.section-title {
  padding: 16px 16px 8px;
  font-size: 16px;
  font-weight: bold;
  color: var(--van-text-color);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 16px 8px;
}

.empty-items {
  padding: 24px 0;
}

.item-card {
  margin: 12px;
  padding: 16px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.item-row {
  margin-bottom: 12px;
}

.item-label {
  font-weight: bold;
  margin-bottom: 4px;
}

.item-value {
  color: var(--van-text-color);
}

.item-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
}

.loading-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 100;
}

.loading-text {
  margin-top: 12px;
  color: var(--van-text-color);
}

.fixed-bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px;
  background-color: white;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
  z-index: 10;
}

.form-padding {
  height: 72px;
}

:deep(.van-dropdown-menu) {
  height: 48px;
  box-shadow: none;
  background-color: transparent;
}

:deep(.van-dropdown-menu__item) {
  justify-content: flex-start;
}
</style> 