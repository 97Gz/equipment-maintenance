<template>
  <div class="record-detail">
    <nav-bar :title="pageTitle" />
    
    <div class="content" v-if="!loading">
      <van-form @submit="submitForm">
        <!-- 基本信息 -->
        <div class="form-section">
          <div class="section-title">基本信息</div>
          <van-cell-group inset>
            <van-field
              v-model="formData.equipmentCode"
              label="设备编码"
              placeholder="请输入设备编码"
              :readonly="!isAddMode && !isEditMode"
              :rules="[{ required: true, message: '请输入设备编码' }]"
            />
            <van-field
              v-model="formData.equipmentName"
              label="设备名称"
              placeholder="请输入设备名称"
              :readonly="!isAddMode && !isEditMode"
              :rules="[{ required: true, message: '请输入设备名称' }]"
            />
            <van-field
              v-model="formData.workshop"
              label="使用车间"
              placeholder="请输入使用车间"
              :readonly="!isAddMode && !isEditMode"
            />
            <van-field
              v-model="formData.location"
              label="安装地点"
              placeholder="请输入安装地点"
              :readonly="!isAddMode && !isEditMode"
            />
          </van-cell-group>
        </div>
        
        <!-- 点检信息 -->
        <div class="form-section">
          <div class="section-title">点检信息</div>
          <van-cell-group inset>
            <van-field
              v-model="formData.standardName"
              label="点检标准名称"
              placeholder="请选择点检标准"
              readonly
              is-link
              :disabled="!isAddMode && !isEditMode"
              @click="showStandardPopup = true"
              :rules="[{ required: true, message: '请选择点检标准' }]"
            />
            <van-field
              v-model="formData.standardCode"
              label="点检标准编码"
              placeholder="点检标准编码"
              readonly
            />
            <van-field
              v-model="formData.checkTime"
              label="点检时间"
              placeholder="请选择点检时间"
              readonly
              is-link
              :disabled="!isAddMode && !isEditMode"
              @click="showTimePicker = true"
              :rules="[{ required: true, message: '请选择点检时间' }]"
            />
            <van-field
              v-model="formData.checker"
              label="点检员"
              placeholder="请输入点检员"
              :readonly="!isAddMode && !isEditMode"
              :rules="[{ required: true, message: '请输入点检员' }]"
            />
            <van-field
              v-model="formData.result"
              label="点检结果"
              readonly
            />
            <van-field
              v-model="formData.status"
              label="设备状态"
              readonly
            />
          </van-cell-group>
        </div>
        
        <!-- 点检项目列表 -->
        <div class="form-section">
          <div class="section-header">
            <div class="section-title">点检项目明细</div>
            <van-button 
              v-if="isAddMode || isEditMode" 
              size="small" 
              type="primary" 
              icon="plus" 
              @click="addCheckItem"
            >添加</van-button>
          </div>
          
          <div v-if="formData.items.length === 0" class="empty-items">
            <van-empty description="暂无点检项目" />
          </div>
          
          <div v-else>
            <div class="check-item-card" v-for="(item, index) in formData.items" :key="index">
              <div class="item-row">
                <div class="item-label">检查项:</div>
                <div class="item-value">{{ item.name }}</div>
              </div>
              <div class="item-row">
                <div class="item-label">检查方法:</div>
                <div class="item-value">{{ item.method }}</div>
              </div>
              <div class="item-row">
                <div class="item-label">标准范围:</div>
                <div class="item-value">{{ item.standardRange }}</div>
              </div>
              <div class="item-row">
                <div class="item-label">检查结果:</div>
                <div v-if="isAddMode || isEditMode">
                  <van-radio-group v-model="item.result" direction="horizontal">
                    <van-radio name="normal">正常</van-radio>
                    <van-radio name="abnormal">异常</van-radio>
                  </van-radio-group>
                  <van-field
                    v-if="item.result === 'abnormal'"
                    v-model="item.remark"
                    placeholder="请输入异常情况说明"
                    type="textarea"
                    rows="2"
                    autosize
                    :rules="[{ required: true, message: '请输入异常情况说明' }]"
                  />
                </div>
                <div v-else class="item-value" :class="{'text-danger': item.result === 'abnormal'}">
                  {{ item.result === 'normal' ? '正常' : '异常' }}
                  <div v-if="item.remark" class="item-remark">
                    备注: {{ item.remark }}
                  </div>
                </div>
              </div>
              <div v-if="isAddMode || isEditMode" class="item-actions">
                <van-button size="small" type="danger" @click="removeCheckItem(index)">删除</van-button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 提交按钮 -->
        <div v-if="isAddMode || isEditMode" class="submit-btn">
          <van-button round block type="primary" native-type="submit">保存</van-button>
        </div>
      </van-form>
    </div>
    
    <!-- 加载状态 -->
    <div class="loading-container" v-if="loading">
      <van-loading type="spinner" color="var(--primary-color)" size="36" />
      <p class="loading-text">加载中...</p>
    </div>
    
    <!-- 点检标准选择弹窗 -->
    <van-popup v-model:show="showStandardPopup" position="bottom" :style="{ height: '50%' }">
      <div class="popup-header">
        <div class="popup-title">选择点检标准</div>
        <van-icon name="cross" @click="showStandardPopup = false" />
      </div>
      <div class="popup-content">
        <van-radio-group v-model="selectedStandardId">
          <van-cell-group>
            <van-cell v-for="standard in standardList" :key="standard.id" clickable @click="selectStandard(standard)">
              <template #title>
                <div class="standard-title">{{ standard.name }}</div>
                <div class="standard-desc">{{ standard.code }} | 项目数: {{ standard.items?.length || 0 }}</div>
              </template>
              <template #right-icon>
                <van-radio :name="standard.id" />
              </template>
            </van-cell>
          </van-cell-group>
        </van-radio-group>
      </div>
    </van-popup>
    
    <!-- 时间选择弹窗 -->
    <van-popup v-model:show="showTimePicker" position="bottom">
      <van-datetime-picker
        title="选择点检时间"
        type="datetime"
        v-model="currentDate"
        :min-date="new Date(2020, 0, 1)"
        :max-date="new Date(2025, 11, 31)"
        @confirm="confirmTimeSelection"
        @cancel="showTimePicker = false"
      />
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { showToast, showSuccessToast } from 'vant';
import NavBar from '@/components/NavBar.vue';
import { useCheckStore } from '@/store/check';
import { useEquipmentStore } from '@/store/equipment';
import type { CheckItem, CheckStandard, CheckRecord } from '@/store/check';
import type { Equipment } from '@/store/equipment';

const route = useRoute();
const router = useRouter();
const checkStore = useCheckStore();
const equipmentStore = useEquipmentStore();

// 判断当前是添加模式还是编辑模式
const isAddMode = computed(() => !route.params.id || route.path.includes('/add'));
const isEditMode = computed(() => route.path.includes('/edit'));
const isViewMode = computed(() => !isAddMode.value && !isEditMode.value);
const recordId = computed(() => route.params.id as string);

// 从查询参数中获取设备ID
const equipmentIdFromQuery = computed(() => route.query.equipmentId as string | undefined);

// 页面标题
const pageTitle = computed(() => {
  if (isAddMode.value) return '新增点检单';
  if (isEditMode.value) return '编辑点检单';
  return '点检单详情';
});

// 标准选择相关
const showStandardPopup = ref(false);
const standardList = ref<CheckStandard[]>([]);
const selectedStandardId = ref('');

// 日期选择相关
const showTimePicker = ref(false);
const currentDate = ref<Date>(new Date());

// 表单数据
const formData = reactive<CheckRecord>({
  id: '',
  equipmentId: '',
  equipmentCode: '',
  equipmentName: '',
  workshop: '',
  location: '',
  standardId: '',
  standardName: '',
  standardCode: '',
  checkTime: '',
  checker: '张工', // 默认检查人员
  result: 'normal', // 默认结果为正常
  status: '正常', // 默认状态为正常
  items: []
});

// 表单是否加载中
const loading = ref(false);

// 初始化标准列表
const initStandardList = async () => {
  try {
    await checkStore.fetchStandardList();
    standardList.value = checkStore.standardList;
  } catch (error) {
    console.error('获取点检标准列表失败', error);
    showToast('获取点检标准列表失败');
  }
};

// 选择标准
const selectStandard = (standard: CheckStandard) => {
  selectedStandardId.value = standard.id;
  formData.standardId = standard.id;
  formData.standardName = standard.name;
  formData.standardCode = standard.code;
  
  // 清空原有检查项并添加标准中的检查项
  formData.items = standard.items.map(item => ({
    name: item.name,
    method: item.method,
    standardRange: `${item.minValue} - ${item.maxValue}`,
    result: '',
    remark: ''
  }));
  
  showStandardPopup.value = false;
};

// 确认时间选择
const confirmTimeSelection = (value: Date) => {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');
  const hours = String(value.getHours()).padStart(2, '0');
  const minutes = String(value.getMinutes()).padStart(2, '0');
  
  formData.checkTime = `${year}-${month}-${day} ${hours}:${minutes}`;
  showTimePicker.value = false;
};

// 添加检查项
const addCheckItem = () => {
  formData.items.push({
    name: '',
    method: '',
    standardRange: '',
    result: '',
    remark: ''
  });
};

// 移除检查项
const removeCheckItem = (index: number) => {
  formData.items.splice(index, 1);
};

// 加载设备信息
const loadEquipmentInfo = async (equipmentId: string) => {
  try {
    await equipmentStore.fetchEquipmentDetail(equipmentId);
    const equipment = equipmentStore.getCurrentEquipment;
    
    if (equipment) {
      formData.equipmentId = equipment.id;
      formData.equipmentName = equipment.name;
      formData.equipmentCode = equipment.code || '';
      formData.workshop = equipment.workshop || '';
      formData.location = equipment.location || '';

      // 如果设备有关联的点检标准，自动选择该标准
      if (equipment.checkInfo && equipment.checkInfo.standardId) {
        const foundStandard = standardList.value.find(s => s.id === equipment.checkInfo.standardId);
        if (foundStandard) {
          selectStandard(foundStandard);
        }
      }
    }
  } catch (error) {
    console.error('获取设备信息失败', error);
    showToast('获取设备信息失败');
  }
};

// 提交表单
const submitForm = async () => {
  // 表单验证
  if (!formData.equipmentId || !formData.equipmentName) {
    showToast('请选择设备');
    return;
  }
  
  if (!formData.standardId || !formData.standardName) {
    showToast('请选择点检标准');
    return;
  }
  
  if (!formData.checkTime) {
    showToast('请选择点检时间');
    return;
  }
  
  if (!formData.checker) {
    showToast('请输入点检员');
    return;
  }
  
  if (formData.items.length === 0) {
    showToast('请添加检查项');
    return;
  }
  
  // 检查所有检查项是否填写完整
  for (const item of formData.items) {
    if (!item.name) {
      showToast('请填写检查项名称');
      return;
    }
    
    if (!item.result) {
      showToast('请填写检查结果');
      return;
    }
  }
  
  try {
    loading.value = true;
    
    // 根据模式判断是新增还是更新
    if (isAddMode.value) {
      await checkStore.saveRecord({
        ...formData,
        id: Date.now().toString() // 临时ID，实际应由后端生成
      });
      showSuccessToast('新增点检单成功');
    } else {
      await checkStore.saveRecord(formData);
      showSuccessToast('更新点检单成功');
    }
    
    // 保存成功后返回列表页
    setTimeout(() => {
      router.push('/check/list');
    }, 1500);
  } catch (error) {
    console.error('保存点检单失败', error);
    showToast('保存点检单失败');
  } finally {
    loading.value = false;
  }
};

// 页面初始化
onMounted(async () => {
  loading.value = true;
  
  try {
    // 初始化标准列表
    await initStandardList();
    
    // 添加模式
    if (isAddMode.value) {
      // 设置当前时间为点检时间
      const now = new Date();
      currentDate.value = now;
      confirmTimeSelection(now);
      
      // 如果有传入的设备ID，加载设备信息
      if (equipmentIdFromQuery.value) {
        await loadEquipmentInfo(equipmentIdFromQuery.value);
      }
    } 
    // 编辑或查看模式
    else {
      // 获取记录详情
      await checkStore.fetchRecordDetail(recordId.value);
      const record = checkStore.currentRecord;
      
      if (record) {
        // 填充表单数据
        Object.assign(formData, record);
        
        // 解析检查时间字符串为Date对象
        if (record.checkTime) {
          const [datePart, timePart] = record.checkTime.split(' ');
          const [year, month, day] = datePart.split('-').map(Number);
          const [hours, minutes] = timePart.split(':').map(Number);
          currentDate.value = new Date(year, month - 1, day, hours, minutes);
        }
      } else {
        showToast('获取点检单详情失败');
        router.push('/check/list');
      }
    }
  } catch (error) {
    console.error('初始化页面失败', error);
    showToast('初始化页面失败');
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.record-detail {
  padding-top: 46px;
  min-height: 100vh;
  background-color: var(--background-color);
}

.content {
  padding: 8px;
  padding-bottom: 20px;
}

.form-section {
  margin-bottom: 16px;
}

.section-title {
  font-size: 15px;
  font-weight: 500;
  color: var(--text-color);
  margin-bottom: 8px;
  padding-left: 12px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.empty-items {
  background-color: var(--card-background);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
}

.check-item-card {
  background-color: var(--card-background);
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.item-row {
  display: flex;
  margin-bottom: 8px;
}

.item-label {
  width: 80px;
  color: var(--text-color-secondary);
  font-size: 14px;
}

.item-value {
  flex: 1;
  font-size: 14px;
  color: var(--text-color);
}

.item-remark {
  margin-top: 4px;
  font-size: 13px;
  color: var(--text-color-secondary);
}

.item-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
}

.text-danger {
  color: var(--danger-color);
}

.submit-btn {
  margin: 24px 16px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
}

.loading-text {
  margin-top: 12px;
  color: var(--text-color-secondary);
  font-size: 14px;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid var(--border-color);
}

.popup-title {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-color);
}

.popup-content {
  padding: 8px 0;
  height: calc(100% - 50px);
  overflow-y: auto;
}

.standard-title {
  font-size: 15px;
  color: var(--text-color);
  margin-bottom: 4px;
}

.standard-desc {
  font-size: 13px;
  color: var(--text-color-secondary);
}

:deep(.van-cell-group--inset) {
  margin: 0;
}

:deep(.van-radio__label) {
  margin-left: 4px;
}
</style> 