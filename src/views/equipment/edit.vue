<template>
  <div class="equipment-edit">
    <nav-bar :title="isNewEquipment ? '新增设备' : '编辑设备'" />
    
    <div class="content">
      <van-form @submit="onSubmit">
        <!-- 基本信息 -->
        <div class="form-section">
          <div class="section-title">基本信息</div>
          <van-cell-group inset>
            <van-field
              v-model="formData.name"
              name="name"
              label="设备名称"
              placeholder="请输入设备名称"
              :rules="[{ required: true, message: '请输入设备名称' }]"
            />
            <van-field
              v-model="formData.type"
              name="type"
              label="设备类型"
              placeholder="请选择设备类型"
              readonly
              is-link
              @click="showTypePopup = true"
              :rules="[{ required: true, message: '请选择设备类型' }]"
            />
            <van-field
              v-model="formData.model"
              name="model"
              label="规格型号"
              placeholder="请输入规格型号"
              :rules="[{ required: true, message: '请输入规格型号' }]"
            />
            <van-field
              v-model="formData.status"
              name="status"
              label="设备状态"
              placeholder="请选择设备状态"
              readonly
              is-link
              @click="showStatusPopup = true"
              :rules="[{ required: true, message: '请选择设备状态' }]"
            />
          </van-cell-group>
        </div>
        
        <!-- 位置信息 -->
        <div class="form-section">
          <div class="section-title">位置信息</div>
          <van-cell-group inset>
            <van-field
              v-model="formData.workshop"
              name="workshop"
              label="使用车间"
              placeholder="请输入使用车间"
            />
            <van-field
              v-model="formData.location"
              name="location"
              label="安装地点"
              placeholder="请输入安装地点"
            />
          </van-cell-group>
        </div>
        
        <!-- 负责人信息 -->
        <div class="form-section">
          <div class="section-title">负责人信息</div>
          <van-cell-group inset>
            <van-field
              v-model="formData.manager"
              name="manager"
              label="设备负责人"
              placeholder="请输入设备负责人"
            />
            <van-field
              v-model="formData.managerContact"
              name="managerContact"
              label="联系方式"
              placeholder="请输入联系方式"
            />
          </van-cell-group>
        </div>
        
        <!-- 供应商信息 -->
        <div class="form-section">
          <div class="section-title">供应商信息</div>
          <van-cell-group inset>
            <van-field
              v-model="formData.manufacturer"
              name="manufacturer"
              label="生产厂商"
              placeholder="请输入生产厂商"
            />
            <van-field
              v-model="formData.supplier.name"
              name="supplierName"
              label="供应商名称"
              placeholder="请输入供应商名称"
            />
            <van-field
              v-model="formData.supplier.code"
              name="supplierCode"
              label="供应商编码"
              placeholder="请输入供应商编码"
            />
          </van-cell-group>
        </div>
        
        <!-- 日期信息 -->
        <div class="form-section">
          <div class="section-title">日期信息</div>
          <van-cell-group inset>
            <van-field
              v-model="formData.purchaseDate"
              name="purchaseDate"
              label="购买日期"
              placeholder="请选择购买日期"
              readonly
              is-link
              @click="showPurchaseDatePicker = true"
            />
            <van-field
              v-model="formData.enableDate"
              name="enableDate"
              label="启用日期"
              placeholder="请选择启用日期"
              readonly
              is-link
              @click="showEnableDatePicker = true"
            />
          </van-cell-group>
        </div>
        
        <!-- 提交按钮 -->
        <div class="submit-btn">
          <van-button round block type="primary" native-type="submit">保存</van-button>
        </div>
      </van-form>
    </div>
    
    <!-- 设备类型选择弹窗 -->
    <van-popup v-model:show="showTypePopup" position="bottom">
      <van-picker
        title="选择设备类型"
        :columns="typeOptions"
        @confirm="onTypeConfirm"
        @cancel="showTypePopup = false"
        show-toolbar
      />
    </van-popup>
    
    <!-- 设备状态选择弹窗 -->
    <van-popup v-model:show="showStatusPopup" position="bottom">
      <van-picker
        title="选择设备状态"
        :columns="statusOptions"
        @confirm="onStatusConfirm"
        @cancel="showStatusPopup = false"
        show-toolbar
      />
    </van-popup>
    
    <!-- 购买日期选择弹窗 -->
    <van-popup v-model:show="showPurchaseDatePicker" position="bottom">
      <van-date-picker
        title="选择购买日期"
        @confirm="onPurchaseDateConfirm"
        @cancel="showPurchaseDatePicker = false"
      />
    </van-popup>
    
    <!-- 启用日期选择弹窗 -->
    <van-popup v-model:show="showEnableDatePicker" position="bottom">
      <van-date-picker
        title="选择启用日期"
        @confirm="onEnableDateConfirm"
        @cancel="showEnableDatePicker = false"
      />
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { showToast, showSuccessToast } from 'vant';
import { useEquipmentStore } from '@/store/equipment';
import NavBar from '@/components/NavBar.vue';
import type { Equipment } from '@/store/equipment';

const route = useRoute();
const router = useRouter();
const equipmentStore = useEquipmentStore();

// 判断是新增还是编辑
const isNewEquipment = computed(() => route.params.id === 'new');

// 表单数据
const formData = ref<Partial<Equipment>>({
  id: '',
  name: '',
  type: '',
  model: '',
  status: '',
  image: 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg', // 默认图片
  workshop: '',
  location: '',
  manager: '',
  managerContact: '',
  manufacturer: '',
  supplier: {
    id: '',
    code: '',
    name: ''
  },
  purchaseDate: '',
  enableDate: '',
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

// 弹窗控制
const showTypePopup = ref(false);
const showStatusPopup = ref(false);
const showPurchaseDatePicker = ref(false);
const showEnableDatePicker = ref(false);

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
  { text: '正常', value: 'normal' },
  { text: '故障', value: 'fault' },
  { text: '维修中', value: 'maintenance' },
  { text: '已报废', value: 'scrapped' }
];

// 设备类型确认
const onTypeConfirm = (value: string) => {
  formData.value.type = value;
  showTypePopup.value = false;
};

// 设备状态确认
const onStatusConfirm = (value: { text: string, value: string }) => {
  formData.value.status = value.value as any;
  showStatusPopup.value = false;
};

// 购买日期确认
const onPurchaseDateConfirm = (value: Date) => {
  formData.value.purchaseDate = formatDate(value);
  showPurchaseDatePicker.value = false;
};

// 启用日期确认
const onEnableDateConfirm = (value: Date) => {
  formData.value.enableDate = formatDate(value);
  showEnableDatePicker.value = false;
};

// 格式化日期
const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// 表单提交
const onSubmit = () => {
  if (isNewEquipment.value) {
    // 新增设备
    formData.value.id = `EQ${Date.now().toString().slice(-6)}`;
    equipmentStore.equipmentList.push(formData.value as Equipment);
    showSuccessToast('设备添加成功');
  } else {
    // 编辑设备
    const index = equipmentStore.equipmentList.findIndex(item => item.id === formData.value.id);
    if (index !== -1) {
      equipmentStore.equipmentList[index] = formData.value as Equipment;
      showSuccessToast('设备信息已更新');
    }
  }
  
  // 返回设备列表页
  router.push('/basic/equipment');
};

// 页面加载时获取设备详情
onMounted(async () => {
  if (!isNewEquipment.value) {
    const id = route.params.id as string;
    try {
      await equipmentStore.fetchEquipmentDetail(id);
      const equipment = equipmentStore.getCurrentEquipment;
      if (equipment) {
        formData.value = { ...equipment };
      } else {
        showToast('设备不存在');
        router.back();
      }
    } catch (error) {
      console.error('获取设备详情失败', error);
      showToast('获取设备详情失败');
      router.back();
    }
  }
});
</script>

<style scoped>
.equipment-edit {
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
  color: var(--text-color-secondary);
  margin-bottom: 8px;
  padding-left: 12px;
}

.submit-btn {
  margin: 24px 16px;
}

:deep(.van-cell-group--inset) {
  margin: 0;
}

:deep(.van-field__label) {
  width: 90px;
  color: var(--text-color);
}
</style> 