<template>
  <div class="patrol-record-detail">
    <nav-bar 
      :title="isEdit ? (isAdd ? '新增巡检记录' : '编辑巡检记录') : '巡检记录详情'" 
      :left-arrow="true" 
      @click-left="goBack"
    />
    
    <div class="content">
      <!-- 加载中 -->
      <div v-if="loading && !isAdd" class="loading-container">
        <van-loading type="spinner" color="#1989fa" />
        <span class="loading-text">加载中...</span>
      </div>
      
      <template v-else>
        <!-- 基本信息区域 -->
        <div class="section">
          <div class="section-title">基本信息</div>
          
          <van-field
            v-if="!isEdit"
            label="计划名称"
            :model-value="record.planName"
            readonly
          />
          <van-field
            v-else
            v-model="record.planName"
            label="计划名称"
            placeholder="请选择巡检计划"
            readonly
            is-link
            :rules="[{ required: true, message: '请选择巡检计划' }]"
            @click="showPlanPicker = true"
          />
          
          <van-field
            v-if="!isEdit"
            label="设备名称"
            :model-value="record.equipmentName"
            readonly
          />
          <van-field
            v-else
            v-model="record.equipmentName"
            label="设备名称"
            placeholder="请选择设备"
            readonly
            is-link
            :rules="[{ required: true, message: '请选择设备' }]"
            @click="showEquipmentPicker = true"
          />
          
          <van-field
            label="设备编码"
            :model-value="record.equipmentCode"
            readonly
          />
          
          <van-field
            label="所在车间"
            :model-value="record.workshop"
            readonly
          />
          
          <van-field
            v-if="!isEdit"
            label="巡检时间"
            :model-value="record.patrolTime"
            readonly
          />
          <van-field
            v-else
            v-model="patrolTimeDisplay"
            label="巡检时间"
            placeholder="请选择巡检时间"
            readonly
            is-link
            :rules="[{ required: true, message: '请选择巡检时间' }]"
            @click="showDatetimePicker = true"
          />
          
          <van-field
            v-if="!isEdit"
            label="巡检结果"
            :model-value="record.result === 'normal' ? '正常' : '异常'"
            readonly
          >
            <template #right-icon>
              <van-tag :type="record.result === 'normal' ? 'success' : 'danger'">
                {{ record.result === 'normal' ? '正常' : '异常' }}
              </van-tag>
            </template>
          </van-field>
          
          <van-field
            v-if="!isEdit && record.remark"
            label="备注"
            type="textarea"
            :model-value="record.remark"
            readonly
            autosize
          />
          <van-field
            v-if="isEdit"
            v-model="record.remark"
            label="备注"
            type="textarea"
            placeholder="请输入备注信息"
            autosize
            :rows="2"
          />
        </div>
        
        <!-- 巡检项目列表 -->
        <div class="section">
          <div class="section-title">巡检项目</div>
          
          <div class="items-list">
            <div 
              v-for="(item, index) in record.items" 
              :key="index"
              class="patrol-item"
              :class="{ 'abnormal': item.result === 'abnormal' }"
            >
              <div class="item-header">
                <div class="item-title">{{ item.name }}</div>
                <div class="item-result" v-if="!isEdit">
                  <van-tag :type="item.result === 'normal' ? 'success' : 'danger'">
                    {{ item.result === 'normal' ? '正常' : '异常' }}
                  </van-tag>
                </div>
                <div class="item-result" v-else>
                  <van-radio-group v-model="item.result" direction="horizontal">
                    <van-radio name="normal">正常</van-radio>
                    <van-radio name="abnormal">异常</van-radio>
                  </van-radio-group>
                </div>
              </div>
              
              <div class="item-detail">
                <div class="item-method">
                  <span class="label">检查方法:</span>
                  <span>{{ item.method }}</span>
                </div>
                <div class="item-standard">
                  <span class="label">检查标准:</span>
                  <span>{{ item.standard }}</span>
                </div>
                <div class="item-value" v-if="!isEdit && item.value">
                  <span class="label">检查值:</span>
                  <span>{{ item.value }}</span>
                </div>
                <div class="item-value" v-if="isEdit">
                  <span class="label">检查值:</span>
                  <van-field
                    v-model="item.value"
                    placeholder="请输入检查值"
                    :border="false"
                  />
                </div>
                <div class="item-remark" v-if="!isEdit && item.remark">
                  <span class="label">备注:</span>
                  <span>{{ item.remark }}</span>
                </div>
                <div class="item-remark" v-if="isEdit && item.result === 'abnormal'">
                  <span class="label">异常说明:</span>
                  <van-field
                    v-model="item.remark"
                    placeholder="请说明异常情况"
                    :border="false"
                    :rules="[{ required: item.result === 'abnormal', message: '异常状态需要填写说明' }]"
                  />
                </div>
              </div>
            </div>
            
            <van-empty v-if="!record.items || record.items.length === 0" description="暂无巡检项目" />
          </div>
        </div>
      </template>
    </div>
    
    <!-- 底部保存按钮 -->
    <div class="fixed-bottom" v-if="isEdit">
      <van-button type="primary" block @click="saveRecord">保存</van-button>
    </div>
    
    <!-- 报修按钮 -->
    <div class="fixed-bottom" v-if="!isEdit && record.result === 'abnormal'">
      <van-button type="warning" block @click="reportRepair">设备报修</van-button>
    </div>
    
    <!-- 巡检计划选择器 -->
    <van-popup v-model:show="showPlanPicker" position="bottom" :style="{ height: '60%' }">
      <van-picker
        title="选择巡检计划"
        :columns="planOptions"
        @confirm="onPlanSelected"
        @cancel="showPlanPicker = false"
        show-toolbar
      />
    </van-popup>
    
    <!-- 设备选择器 -->
    <van-popup v-model:show="showEquipmentPicker" position="bottom" :style="{ height: '60%' }">
      <van-picker
        title="选择设备"
        :columns="equipmentOptions"
        @confirm="onEquipmentSelected"
        @cancel="showEquipmentPicker = false"
        show-toolbar
      />
    </van-popup>
    
    <!-- 日期时间选择器 -->
    <van-popup v-model:show="showDatetimePicker" position="bottom">
      <van-datetime-picker
        title="选择巡检时间"
        type="datetime"
        :min-date="new Date(2020, 0, 1)"
        :max-date="new Date(2030, 11, 31)"
        :value="patrolDate"
        @confirm="onDatetimeConfirm"
        @cancel="showDatetimePicker = false"
      />
    </van-popup>
    
    <!-- 报修对话框 -->
    <van-dialog
      v-model:show="showRepairDialog"
      title="设备报修"
      show-cancel-button
      @confirm="confirmRepair"
    >
      <div class="repair-form">
        <van-field
          v-model="repairForm.reason"
          label="报修原因"
          type="textarea"
          placeholder="请输入报修原因"
          :rules="[{ required: true, message: '请输入报修原因' }]"
          rows="2"
          autosize
        />
        <van-field
          v-model="repairForm.contact"
          label="联系人"
          placeholder="请输入联系人"
          :rules="[{ required: true, message: '请输入联系人' }]"
        />
        <van-field
          v-model="repairForm.phone"
          label="联系电话"
          placeholder="请输入联系电话"
          :rules="[{ required: true, message: '请输入联系电话' }]"
        />
      </div>
    </van-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { showToast, showSuccessToast } from 'vant';
import NavBar from '@/components/NavBar.vue';
import { usePatrolStore } from '@/store/patrol';
import type { PatrolRecord, PatrolRecordItem, PatrolPlan } from '@/store/patrol';

const route = useRoute();
const router = useRouter();
const patrolStore = usePatrolStore();

// 获取路由参数
const recordId = computed(() => route.params.id as string);
const mode = computed(() => route.meta.mode as string || 'view');
const isEdit = computed(() => mode.value === 'edit' || mode.value === 'add');
const isAdd = computed(() => mode.value === 'add');

// 状态变量
const loading = ref(true);
const record = ref<PatrolRecord>({
  id: '',
  planId: '',
  planName: '',
  equipmentId: '',
  equipmentName: '',
  equipmentCode: '',
  workshop: '',
  patrolTime: '',
  result: 'normal',
  equipmentStatus: 'normal',
  remark: '',
  items: [],
  createTime: '',
  updateTime: ''
});

// 日期时间相关
const showDatetimePicker = ref(false);
const patrolDate = ref(new Date());
const patrolTimeDisplay = ref('');

// 选择器相关
const showPlanPicker = ref(false);
const showEquipmentPicker = ref(false);
const planOptions = ref<Array<{ text: string, value: string }>>([]);
const equipmentOptions = ref<Array<{ text: string, value: string }>>([]);

// 报修相关
const showRepairDialog = ref(false);
const repairForm = ref({
  reason: '',
  contact: '',
  phone: ''
});

// 返回上一页
const goBack = () => {
  router.back();
};

// 加载巡检记录数据
const loadRecordData = async () => {
  if (isAdd.value) {
    // 如果是新增巡检记录，初始化空记录
    record.value = {
      id: '',
      planId: '',
      planName: '',
      equipmentId: '',
      equipmentName: '',
      equipmentCode: '',
      workshop: '',
      patrolTime: formatDatetime(new Date()),
      result: 'normal',
      equipmentStatus: 'normal',
      remark: '',
      items: [],
      createTime: '',
      updateTime: ''
    };
    patrolTimeDisplay.value = formatDatetimeDisplay(new Date());
    loading.value = false;
    return;
  }
  
  try {
    // 获取巡检记录详情
    if (recordId.value) {
      const recordData = await patrolStore.fetchRecordDetail(recordId.value);
      if (recordData) {
        record.value = recordData;
        
        // 设置日期时间选择器初始值
        const dateTime = new Date(record.value.patrolTime);
        patrolDate.value = !isNaN(dateTime.getTime()) ? dateTime : new Date();
        patrolTimeDisplay.value = formatDatetimeDisplay(patrolDate.value);
      }
    }
  } catch (error) {
    console.error('获取巡检记录详情失败', error);
    showToast('获取巡检记录详情失败');
  } finally {
    loading.value = false;
  }
};

// 加载巡检计划选项
const loadPlanOptions = async () => {
  try {
    // 获取巡检计划列表
    await patrolStore.fetchPlanList();
    const plans = patrolStore.getPlanList;
    planOptions.value = plans.map(plan => ({
      text: plan.name,
      value: plan.id
    }));
  } catch (error) {
    console.error('获取巡检计划列表失败', error);
  }
};

// 加载设备选项
const loadEquipmentOptions = async () => {
  try {
    // 这里假设有设备列表API，实际需要根据项目情况调整
    // 示例数据
    equipmentOptions.value = [
      { text: '数控车床 (CNC001)', value: 'equip001' },
      { text: '铣床 (Mill002)', value: 'equip002' },
      { text: '注塑机 (IM003)', value: 'equip003' },
    ];
  } catch (error) {
    console.error('获取设备列表失败', error);
  }
};

// 选择巡检计划后的回调
const onPlanSelected = async (plan: { text: string, value: string }) => {
  showPlanPicker.value = false;
  record.value.planId = plan.value;
  record.value.planName = plan.text;
  
  // 获取计划详情，加载巡检项目
  try {
    const planDetail = await patrolStore.fetchPlanDetail(plan.value);
    if (planDetail) {
      // 初始化巡检项目列表
      record.value.items = planDetail.items.map(item => ({
        id: '',
        planItemId: item.id,
        name: item.name,
        method: item.method,
        standard: item.standard || '正常范围内',
        value: '',
        result: 'normal',
        remark: ''
      }));
    }
  } catch (error) {
    console.error('获取巡检计划详情失败', error);
  }
};

// 选择设备后的回调
const onEquipmentSelected = (equipment: { text: string, value: string }) => {
  showEquipmentPicker.value = false;
  record.value.equipmentId = equipment.value;
  
  // 解析设备名称和编码
  const match = equipment.text.match(/(.*)\s+\((.*)\)/);
  if (match) {
    record.value.equipmentName = match[1];
    record.value.equipmentCode = match[2];
  } else {
    record.value.equipmentName = equipment.text;
    record.value.equipmentCode = '';
  }
  
  // 假设设备所在车间信息
  // 实际应该从设备详情中获取
  if (record.value.equipmentId === 'equip001') {
    record.value.workshop = '机加车间';
  } else if (record.value.equipmentId === 'equip002') {
    record.value.workshop = '机加车间';
  } else if (record.value.equipmentId === 'equip003') {
    record.value.workshop = '注塑车间';
  } else {
    record.value.workshop = '未知';
  }
};

// 选择日期时间后的回调
const onDatetimeConfirm = (date: Date) => {
  showDatetimePicker.value = false;
  patrolDate.value = date;
  patrolTimeDisplay.value = formatDatetimeDisplay(date);
  record.value.patrolTime = formatDatetime(date);
};

// 格式化日期时间为yyyy-MM-dd HH:mm:ss格式
const formatDatetime = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// 格式化日期时间为显示格式
const formatDatetimeDisplay = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

// 计算巡检结果
const calculateResult = () => {
  // 如果有任何一个巡检项目异常，整体结果就是异常
  const hasAbnormal = record.value.items.some(item => item.result === 'abnormal');
  record.value.result = hasAbnormal ? 'abnormal' : 'normal';
  
  // 如果有异常，并且设备状态是正常，则修改为警告状态
  if (hasAbnormal && record.value.equipmentStatus === 'normal') {
    record.value.equipmentStatus = 'warning';
  }
};

// 保存巡检记录
const saveRecord = async () => {
  // 表单验证
  if (!record.value.planId || !record.value.planName) {
    showToast('请选择巡检计划');
    return;
  }
  
  if (!record.value.equipmentId || !record.value.equipmentName) {
    showToast('请选择设备');
    return;
  }
  
  if (!record.value.patrolTime) {
    showToast('请选择巡检时间');
    return;
  }
  
  // 验证异常项必须填写备注
  for (const item of record.value.items) {
    if (item.result === 'abnormal' && !item.remark) {
      showToast('异常项目必须填写异常说明');
      return;
    }
  }
  
  // 计算巡检结果
  calculateResult();
  
  try {
    // 保存巡检记录
    await patrolStore.saveRecord(record.value);
    showSuccessToast('保存成功');
    
    // 返回列表页
    router.push('/patrol/list');
  } catch (error) {
    console.error('保存巡检记录失败', error);
    showToast('保存失败');
  }
};

// 报修
const reportRepair = () => {
  // 预填写报修原因：根据异常项目自动生成
  const abnormalItems = record.value.items.filter(item => item.result === 'abnormal');
  if (abnormalItems.length > 0) {
    repairForm.value.reason = `${record.value.equipmentName}存在以下异常：\n` + 
      abnormalItems.map(item => `${item.name}: ${item.remark || '异常'}`).join('\n');
  } else {
    repairForm.value.reason = '';
  }
  
  showRepairDialog.value = true;
};

// 确认报修
const confirmRepair = async () => {
  try {
    // 这里简化处理，实际可能需要调用报修API
    showSuccessToast('报修成功');
    showRepairDialog.value = false;
    
    // 更新设备状态为"维修中"
    if (record.value.equipmentStatus !== 'repair') {
      const updatedRecord = { ...record.value, equipmentStatus: 'repair' };
      await patrolStore.saveRecord(updatedRecord);
      
      // 更新当前记录
      record.value = updatedRecord;
    }
  } catch (error) {
    console.error('报修失败', error);
    showToast('报修失败');
  }
};

// 监听巡检项结果变化
watch(() => record.value.items, () => {
  // 当项目值变化时重新计算整体结果
  calculateResult();
}, { deep: true });

// 初始化
onMounted(async () => {
  // 加载选项数据
  await Promise.all([loadPlanOptions(), loadEquipmentOptions()]);
  
  // 加载巡检记录数据
  await loadRecordData();
});
</script>

<style scoped>
.patrol-record-detail {
  min-height: 100vh;
  background-color: var(--van-background);
  padding-top: 46px;
  padding-bottom: 60px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 200px;
}

.loading-text {
  margin-top: 12px;
  color: var(--van-gray-6);
}

.content {
  padding: 16px;
}

.section {
  margin-bottom: 20px;
  background-color: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 16px;
  padding-left: 8px;
  border-left: 3px solid var(--van-primary-color);
}

.items-list {
  margin-top: 12px;
}

.patrol-item {
  padding: 12px;
  border-radius: 8px;
  background-color: var(--van-background);
  margin-bottom: 12px;
  border: 1px solid var(--van-gray-3);
}

.patrol-item.abnormal {
  border-color: var(--van-danger-color);
  background-color: var(--van-danger-color-light);
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.item-title {
  font-weight: bold;
  font-size: 15px;
}

.item-detail {
  font-size: 14px;
  color: var(--van-gray-7);
}

.item-detail > div {
  margin-bottom: 4px;
}

.label {
  color: var(--van-gray-6);
  margin-right: 4px;
}

.fixed-bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 10px 16px;
  background-color: white;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
}

.repair-form {
  padding: 16px;
}
</style> 