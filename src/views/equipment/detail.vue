<template>
  <div class="equipment-detail">
    <nav-bar :title="getPageTitle()" />
    
    <div class="content" v-if="equipment">
      <van-form ref="formRef">
        <!-- 基本信息 -->
        <div class="form-section">
          <div class="section-title">基本信息</div>
          <van-cell-group inset>
            <van-field
              v-model="formData.code"
              label="设备编号"
              placeholder="请输入设备编号"
              :readonly="isViewMode"
              :rules="[{ required: true, message: '请输入设备编号' }]"
            />
            <van-field
              v-model="formData.name"
              label="设备名称"
              placeholder="请输入设备名称"
              :readonly="isViewMode"
              :rules="[{ required: true, message: '请输入设备名称' }]"
            />
            <van-field
              v-model="formData.statusText"
              label="设备状态"
              placeholder="请选择设备状态"
              readonly
              is-link
              :disabled="isViewMode"
              @click="!isViewMode && showStatusSelector()"
              :right-icon="isViewMode ? '' : 'arrow'"
            >
              <template #input>
                <div class="status-display">
                  <van-tag :type="getStatusType(formData.status)" size="medium">
                    {{ getStatusText(formData.status) }}
                  </van-tag>
                </div>
              </template>
            </van-field>
            <van-field
              v-model="formData.type"
              label="设备类型"
              placeholder="请选择设备类型"
              readonly
              is-link
              :disabled="isViewMode"
              @click="!isViewMode && showTypeSelector()"
              :right-icon="isViewMode ? '' : 'arrow'"
            />
            <van-field
              v-model="formData.model"
              label="规格型号"
              placeholder="请输入规格型号"
              :readonly="isViewMode"
              :rules="[{ required: true, message: '请输入规格型号' }]"
            />
          </van-cell-group>
        </div>
        
        <!-- 使用信息 -->
        <div class="form-section">
          <div class="section-title">使用信息</div>
          <van-cell-group inset>
            <van-field
              v-model="formData.workshop"
              label="使用车间"
              placeholder="请输入使用车间"
              :readonly="isViewMode"
              :rules="[{ required: true, message: '请输入使用车间' }]"
            />
            <van-field
              v-model="formData.location"
              label="安装地点"
              placeholder="请输入安装地点"
              :readonly="isViewMode"
              :rules="[{ required: true, message: '请输入安装地点' }]"
            />
            <van-field
              v-model="formData.manager"
              label="设备负责人"
              placeholder="请输入设备负责人"
              :readonly="isViewMode"
              :rules="[{ required: true, message: '请输入设备负责人' }]"
            />
            <van-field
              v-model="formData.managerContact"
              label="联系方式"
              placeholder="请输入联系方式"
              :readonly="isViewMode"
              :rules="[{ required: true, message: '请输入联系方式' }]"
            />
          </van-cell-group>
        </div>
        
        <!-- 购买信息 -->
        <div class="form-section">
          <div class="section-title">购买信息</div>
          <van-cell-group inset>
            <van-field
              v-model="formData.manufacturer"
              label="生产厂商"
              placeholder="请输入生产厂商"
              :readonly="isViewMode"
              :rules="[{ required: true, message: '请输入生产厂商' }]"
            />
            <van-field
              v-model="formData.purchaseDate"
              label="购买日期"
              placeholder="请选择购买日期"
              readonly
              is-link
              :disabled="isViewMode"
              @click="!isViewMode && showDateSelector('purchase')"
              :right-icon="isViewMode ? '' : 'arrow'"
            />
            <van-field
              v-model="formData.supplier.name"
              label="供应商名称"
              placeholder="请输入供应商名称"
              :readonly="isViewMode"
              :rules="[{ required: true, message: '请输入供应商名称' }]"
            />
            <van-field
              v-model="formData.supplier.code"
              label="供应商编码"
              placeholder="请输入供应商编码"
              :readonly="isViewMode"
              :rules="[{ required: true, message: '请输入供应商编码' }]"
            />
            <van-field
              v-model="formData.enableDate"
              label="启用日期"
              placeholder="请选择启用日期"
              readonly
              is-link
              :disabled="isViewMode"
              @click="!isViewMode && showDateSelector('enable')"
              :right-icon="isViewMode ? '' : 'arrow'"
            />
          </van-cell-group>
        </div>
        
        <!-- 只在查看模式下显示这些信息 -->
        <template v-if="isViewMode">
          <!-- 点检信息 -->
          <div class="form-section">
            <div class="section-title">点检信息</div>
            <van-cell-group inset>
              <van-cell title="点检标准名称" :value="formData.checkInfo.standardName || '暂无'" />
              <van-cell title="点检标准编码" :value="formData.checkInfo.standardCode || '暂无'" />
              <van-cell title="最近点检时间" :value="formData.checkInfo.lastCheckTime || '暂无记录'" />
            </van-cell-group>
          </div>
          
          <!-- 巡检信息 -->
          <div class="form-section">
            <div class="section-title">巡检信息</div>
            <van-cell-group inset>
              <van-cell title="巡检方案名称" :value="formData.patrolInfo.planName || '暂无'" />
              <van-cell title="巡检方案编码" :value="formData.patrolInfo.planCode || '暂无'" />
              <van-cell title="规定巡检日期" :value="formData.patrolInfo.scheduledDate || '暂无'" />
              <van-cell title="最近巡检时间" :value="formData.patrolInfo.lastPatrolTime || '暂无记录'" />
              <van-cell title="当天规定巡检次数" :value="formData.patrolInfo.dailyCount ? formData.patrolInfo.dailyCount.toString() : '0'" />
            </van-cell-group>
          </div>
          
          <!-- 报修维修 -->
          <div class="form-section">
            <div class="section-title">报修维修</div>
            <van-cell-group inset>
              <van-cell title="最近维修日期" :value="formData.repairInfo.lastRepairTime || '暂无记录'" />
            </van-cell-group>
          </div>
          
          <div class="form-section">
            <div class="section-title">维护保养</div>
            <van-cell-group inset>
              <van-cell title="最近保养日期" :value="formData.maintenanceInfo.lastMaintenanceTime || '暂无记录'" />
            </van-cell-group>
          </div>
          
          <div class="form-section">
            <div class="section-title">设备报废</div>
            <van-cell-group inset>
              <van-cell title="报废时间" :value="formData.scrapInfo.scrapTime || '未报废'" />
            </van-cell-group>
          </div>
        </template>
      </van-form>
    </div>
    
    <!-- 加载状态 -->
    <div class="loading-container" v-if="loading">
      <van-loading type="spinner" color="#1989fa" size="36" />
      <p class="loading-text">加载设备信息...</p>
    </div>
    
    <!-- 设备状态选择弹窗 -->
    <van-popup v-model:show="showStatusPopup" position="bottom" :style="{ height: '40%' }">
      <div class="popup-header">
        <div class="popup-title">选择设备状态</div>
        <van-icon name="cross" @click="showStatusPopup = false" />
      </div>
      <div class="popup-content">
        <van-radio-group v-model="selectedStatus">
          <van-cell-group>
            <van-cell v-for="option in statusOptions" :key="option.value" clickable @click="selectStatus(option)">
              <template #title>
                <span class="item-title">{{ option.text }}</span>
              </template>
              <template #right-icon>
                <van-radio :name="option.value" />
              </template>
            </van-cell>
          </van-cell-group>
        </van-radio-group>
      </div>
    </van-popup>
    
    <!-- 设备类型选择弹窗 -->
    <van-popup v-model:show="showTypePopup" position="bottom" :style="{ height: '40%' }">
      <div class="popup-header">
        <div class="popup-title">选择设备类型</div>
        <van-icon name="cross" @click="showTypePopup = false" />
      </div>
      <div class="popup-content">
        <van-radio-group v-model="selectedType">
          <van-cell-group>
            <van-cell v-for="type in typeOptions" :key="type" clickable @click="selectType(type)">
              <template #title>
                <span class="item-title">{{ type }}</span>
              </template>
              <template #right-icon>
                <van-radio :name="type" />
              </template>
            </van-cell>
          </van-cell-group>
        </van-radio-group>
      </div>
    </van-popup>
    
    <!-- 日期选择器 -->
    <van-calendar
      v-model:show="showDatePicker"
      @confirm="onDateConfirm"
      :show-confirm="true"
      :round="false"
      :title="datePickerTitle"
      color="#1989fa"
    />
    
    <!-- 固定底部按钮 -->
    <div class="fixed-bottom" v-if="equipment">
      <!-- 查看模式 -->
      <van-button 
        v-if="isViewMode" 
        type="primary" 
        block 
        @click="goToCheck"
      >设备点检</van-button>
      
      <!-- 编辑或新增模式 -->
      <van-button 
        v-else 
        type="primary" 
        block 
        @click="saveEquipment"
      >保存</van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useEquipmentStore } from '@/store/equipment';
import { showToast, showSuccessToast } from 'vant';
import NavBar from '@/components/NavBar.vue';
import { Equipment } from '@/store/equipment';

const route = useRoute();
const router = useRouter();
const equipmentStore = useEquipmentStore();
const loading = ref(true);
const formRef = ref(null);

// 表单数据
const formData = reactive({
  id: '',
  code: '',
  name: '',
  type: '',
  status: 'normal',
  statusText: '',
  model: '',
  workshop: '',
  location: '',
  manager: '',
  managerContact: '',
  manufacturer: '',
  purchaseDate: '',
  enableDate: '',
  supplier: {
    id: '',
    code: '',
    name: ''
  },
  checkInfo: {
    standardName: '',
    standardCode: '',
    lastCheckTime: ''
  },
  patrolInfo: {
    planName: '',
    planCode: '',
    scheduledDate: '',
    lastPatrolTime: '',
    dailyCount: 0
  },
  repairInfo: {
    lastRepairTime: ''
  },
  maintenanceInfo: {
    lastMaintenanceTime: ''
  },
  scrapInfo: {
    scrapTime: ''
  }
});

// 获取设备详情
const equipment = computed(() => equipmentStore.getCurrentEquipment);

// 判断页面模式：查看、编辑或新增
const pageMode = computed(() => {
  if (route.path.includes('/add')) {
    return 'add';
  } else if (route.path.includes('/edit')) {
    return 'edit';
  } else {
    return 'view';
  }
});

// 是否为查看模式
const isViewMode = computed(() => {
  return pageMode.value === 'view';
});

// 获取页面标题
const getPageTitle = () => {
  switch (pageMode.value) {
    case 'add':
      return '新增设备';
    case 'edit':
      return '编辑设备';
    default:
      return equipment.value?.name || '设备详情';
  }
};

// 弹窗控制
const showStatusPopup = ref(false);
const showTypePopup = ref(false);
const showDatePicker = ref(false);
const datePickerType = ref('purchase'); // 'purchase' 或 'enable'
const datePickerTitle = ref('选择日期');

// 选中的值
const selectedStatus = ref('');
const selectedType = ref('');

// 设备类型选项
const typeOptions = [
  '机床设备',
  '包装设备',
  '电力设备',
  '检测设备',
  '冷却设备'
];

// 设备状态选项
const statusOptions = [
  { text: '正常运行', value: 'normal' },
  { text: '带病运行', value: 'warning' },
  { text: '维修中', value: 'repairing' },
  { text: '备用', value: 'standby' },
  { text: '停用', value: 'disabled' },
  { text: '报废', value: 'scrapped' }
];

// 获取设备状态文本
const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    'normal': '正常运行',
    'warning': '带病运行',
    'repairing': '维修中',
    'standby': '备用',
    'disabled': '停用',
    'scrapped': '报废'
  };
  return statusMap[status] || '未知';
};

// 获取设备状态类型
const getStatusType = (status: string) => {
  const typeMap: Record<string, string> = {
    'normal': 'success',
    'warning': 'warning',
    'repairing': 'primary',
    'standby': 'purple',
    'disabled': 'danger',
    'scrapped': 'default'
  };
  return typeMap[status] || 'default';
};

// 显示状态选择器
const showStatusSelector = () => {
  selectedStatus.value = formData.status;
  showStatusPopup.value = true;
};

// 选择状态
const selectStatus = (option: { text: string; value: string }) => {
  formData.status = option.value;
  formData.statusText = option.text;
  showStatusPopup.value = false;
};

// 显示类型选择器
const showTypeSelector = () => {
  selectedType.value = formData.type;
  showTypePopup.value = true;
};

// 选择类型
const selectType = (type: string) => {
  formData.type = type;
  showTypePopup.value = false;
};

// 显示日期选择器
const showDateSelector = (type: 'purchase' | 'enable') => {
  datePickerType.value = type;
  datePickerTitle.value = type === 'purchase' ? '选择购买日期' : '选择启用日期';
  showDatePicker.value = true;
};

// 日期确认
const onDateConfirm = (date: Date) => {
  // 格式化日期为'YYYY-MM-DD'
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;
  
  if (datePickerType.value === 'purchase') {
    formData.purchaseDate = formattedDate;
  } else {
    formData.enableDate = formattedDate;
  }
  
  showDatePicker.value = false;
};

// 保存设备
const saveEquipment = async () => {
  try {
    // 基本验证
    if (!formData.code) {
      showToast('请输入设备编号');
      return;
    }
    if (!formData.name) {
      showToast('请输入设备名称');
      return;
    }
    if (!formData.type) {
      showToast('请选择设备类型');
      return;
    }
    
    loading.value = true;
    
    // 这里应该调用API保存设备
    showSuccessToast('设备信息已保存');
    
    // 返回设备列表页
    setTimeout(() => {
      router.push('/equipment');
    }, 1500);
  } catch (error) {
    console.error('保存设备失败', error);
    showToast('保存失败');
  } finally {
    loading.value = false;
  }
};

// 跳转到设备点检
const goToCheck = () => {
  router.push(`/check/record/add?equipmentId=${formData.id}`);
};

// 页面加载时初始化
onMounted(async () => {
  try {
    loading.value = true;
    
    // 如果是新增，不需要获取设备详情
    if (pageMode.value === 'add') {
      // 设置默认值
      formData.status = 'normal';
      formData.statusText = getStatusText('normal');
      
      // 如果有传入的设备类型，自动选择该类型
      const typeParam = route.query.type as string;
      if (typeParam && typeOptions.includes(typeParam)) {
        formData.type = typeParam;
      }
      
      loading.value = false;
      return;
    }
    
    const id = route.params.id as string;
    if (!id) {
      showToast('设备ID不能为空');
      router.back();
      return;
    }
    
    await equipmentStore.fetchEquipmentDetail(id);
    
    if (!equipment.value) {
      showToast('设备不存在');
      router.back();
      return;
    }
    
    // 将获取的设备数据赋值给表单
    Object.assign(formData, equipment.value);
    formData.statusText = getStatusText(formData.status);
    
  } catch (error) {
    console.error('获取设备详情失败', error);
    showToast('获取设备详情失败');
    router.back();
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.equipment-detail {
  padding-top: 46px;
  padding-bottom: 60px;
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

.status-display {
  display: flex;
  align-items: center;
}

.fixed-bottom {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 8px 16px;
  background-color: #fff;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 46px);
}

.loading-text {
  margin-top: 12px;
  color: var(--text-color-secondary);
  font-size: 14px;
}

:deep(.van-cell-group--inset) {
  margin: 0 0 8px 0;
}

:deep(.van-field__label) {
  width: 90px;
  color: var(--text-color);
}

:deep(.van-tag--purple) {
  background-color: #8b5cf6;
  color: white;
}
</style> 