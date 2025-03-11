<template>
  <div class="standard-detail">
    <nav-bar :title="isNewStandard ? '新增点检标准' : '点检标准详情'" />
    
    <div class="content">
      <van-form @submit="onSubmit">
        <!-- 基本信息 -->
        <div class="form-section">
          <div class="section-title">基本信息</div>
          <van-cell-group inset>
            <van-field
              v-model="formData.name"
              name="name"
              label="标准名称"
              placeholder="请输入点检标准名称"
              :rules="[{ required: true, message: '请输入点检标准名称' }]"
            />
          </van-cell-group>
        </div>
        
        <!-- 点检项目列表 -->
        <div class="form-section">
          <div class="section-header">
            <div class="section-title">点检项目明细</div>
            <van-button size="small" type="primary" icon="plus" @click="addCheckItem">添加</van-button>
          </div>
          
          <div v-if="formData.items.length === 0" class="empty-items">
            <van-empty description="暂无点检项目" />
          </div>
          
          <van-swipe-cell
            v-for="(item, index) in formData.items"
            :key="index"
            :before-close="(position, done) => beforeCloseSwipe(position, done, index)"
          >
            <van-cell-group inset>
              <van-field
                v-model="item.name"
                label="检查项"
                placeholder="请输入检查项名称"
                :rules="[{ required: true, message: '请输入检查项名称' }]"
              />
              <van-field
                v-model="item.method"
                label="检查方法"
                placeholder="请输入检查方法"
                :rules="[{ required: true, message: '请输入检查方法' }]"
              />
              <div class="range-fields">
                <van-field
                  v-model="item.min"
                  label="最小值"
                  placeholder="最小值"
                  :rules="[{ required: true, message: '请输入最小值' }]"
                />
                <van-field
                  v-model="item.max"
                  label="最大值"
                  placeholder="最大值"
                  :rules="[{ required: true, message: '请输入最大值' }]"
                />
              </div>
            </van-cell-group>
            <template #right>
              <van-button square type="danger" text="删除" @click="removeCheckItem(index)" />
            </template>
          </van-swipe-cell>
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { showToast, showSuccessToast, showDialog } from 'vant';
import NavBar from '@/components/NavBar.vue';

const route = useRoute();
const router = useRouter();

// 判断是新增还是编辑
const isNewStandard = computed(() => {
  return route.name === 'CheckStandardAdd' || route.params.id === 'add';
});

// 点检项目数据结构
interface CheckItem {
  id: string;
  name: string;
  method: string;
  min: string;
  max: string;
}

// 点检标准数据结构
interface CheckStandard {
  id: string;
  name: string;
  equipmentType: string;
  itemCount: number;
  items: CheckItem[];
}

// 表单数据
const formData = ref<Partial<CheckStandard>>({
  id: '',
  name: '',
  equipmentType: '',
  itemCount: 0,
  items: []
});

// 弹窗控制
const showTypePopup = ref(false);

// 设备类型选项
const typeOptions = [
  '机床设备',
  '包装设备',
  '电力设备',
  '检测设备',
  '冷却设备'
];

// 设备类型确认
const onTypeConfirm = (value: string) => {
  formData.value.equipmentType = value;
  showTypePopup.value = false;
};

// 添加点检项目
const addCheckItem = () => {
  formData.value.items?.push({
    id: `ITEM${Date.now().toString().slice(-6)}`,
    name: '',
    method: '',
    min: '',
    max: ''
  });
};

// 删除点检项目
const removeCheckItem = (index: number) => {
  formData.value.items?.splice(index, 1);
};

// 滑动删除前确认
const beforeCloseSwipe = (position: 'left' | 'right' | 'cell' | 'outside', done: () => void, index: number) => {
  if (position === 'right') {
    showDialog({
      title: '确认删除',
      message: '确定要删除该点检项目吗？',
      showCancelButton: true,
    }).then((action) => {
      if (action === 'confirm') {
        removeCheckItem(index);
      }
      done();
    });
  } else {
    done();
  }
};

// 表单提交
const onSubmit = () => {
  // 更新项目数量
  formData.value.itemCount = formData.value.items?.length || 0;
  
  if (isNewStandard.value) {
    // 新增点检标准
    formData.value.id = `STD${Date.now().toString().slice(-6)}`;
    // 这里应该调用API保存点检标准
    showSuccessToast('点检标准添加成功');
  } else {
    // 编辑点检标准
    // 这里应该调用API更新点检标准
    showSuccessToast('点检标准已更新');
  }
  
  // 返回点检标准列表页
  setTimeout(() => {
    router.push('/check/standard');
  }, 1500);
};

// 模拟点检标准数据
const mockStandards: Record<string, CheckStandard> = {
  'STD001': {
    id: 'STD001',
    name: '机床设备日常点检标准',
    equipmentType: '机床设备',
    itemCount: 5,
    items: [
      { id: 'ITEM001', name: '主轴转速', method: '转速表测量', min: '1000', max: '2000' },
      { id: 'ITEM002', name: '油压', method: '压力表测量', min: '0.5', max: '0.8' },
      { id: 'ITEM003', name: '温度', method: '温度计测量', min: '20', max: '40' },
      { id: 'ITEM004', name: '噪音', method: '噪音计测量', min: '0', max: '70' },
      { id: 'ITEM005', name: '振动', method: '振动测量仪', min: '0', max: '5' }
    ]
  },
  'STD002': {
    id: 'STD002',
    name: '包装设备点检标准',
    equipmentType: '包装设备',
    itemCount: 4,
    items: [
      { id: 'ITEM006', name: '封口温度', method: '温度计测量', min: '120', max: '150' },
      { id: 'ITEM007', name: '传送带速度', method: '速度计测量', min: '10', max: '20' },
      { id: 'ITEM008', name: '气压', method: '压力表测量', min: '0.4', max: '0.6' },
      { id: 'ITEM009', name: '电压', method: '电压表测量', min: '220', max: '240' }
    ]
  },
  'STD003': {
    id: 'STD003',
    name: '电力设备点检标准',
    equipmentType: '电力设备',
    itemCount: 3,
    items: [
      { id: 'ITEM010', name: '电压', method: '电压表测量', min: '380', max: '420' },
      { id: 'ITEM011', name: '电流', method: '电流表测量', min: '10', max: '50' },
      { id: 'ITEM012', name: '温度', method: '红外测温仪', min: '0', max: '60' }
    ]
  }
};

// 页面加载时获取点检标准详情
onMounted(() => {
  if (!isNewStandard.value) {
    const id = route.params.id as string;
    if (id && mockStandards[id]) {
      formData.value = { ...mockStandards[id] };
    } else {
      showToast('点检标准不存在');
      router.back();
    }
  }
});
</script>

<style scoped>
.standard-detail {
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

.range-fields {
  display: flex;
  gap: 8px;
}

.range-fields :deep(.van-field) {
  flex: 1;
}

.submit-btn {
  margin: 24px 16px;
}

:deep(.van-cell-group--inset) {
  margin: 0 0 8px 0;
}

:deep(.van-field__label) {
  width: 90px;
  color: var(--text-color);
}

:deep(.van-swipe-cell__right) {
  display: flex;
  align-items: stretch;
}

:deep(.van-button--danger) {
  height: 100%;
}
</style> 