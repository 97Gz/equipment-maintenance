<template>
  <div class="page-container">
    <nav-bar :title="getPageTitle()" />
    
    <div class="content" v-if="!loading">
      <van-form ref="formRef">
        <!-- 基本信息 -->
        <div class="form-section">
          <div class="section-title">基本信息</div>
          <van-cell-group inset>
            <van-field
              v-model="formData.name"
              name="name"
              label="标准名称"
              placeholder="请输入点检标准名称"
              :readonly="isViewMode"
              :rules="[{ required: true, message: '请输入点检标准名称' }]"
            />
            <van-field
              v-model="formData.code"
              name="code"
              label="标准编码"
              placeholder="请输入标准编码"
              :readonly="isViewMode"
              :rules="[{ required: true, message: '请输入标准编码' }]"
            />
            <van-field
              v-model="formData.equipmentType"
              name="equipmentType"
              label="设备类型"
              placeholder="请选择设备类型"
              readonly
              is-link
              :disabled="isViewMode"
              @click="!isViewMode && showTypeSelector()"
              :right-icon="isViewMode ? '' : 'arrow'"
              :rules="[{ required: true, message: '请选择设备类型' }]"
            />
          </van-cell-group>
        </div>
        
        <!-- 点检项目列表 -->
        <div class="form-section">
          <div class="section-header">
            <div class="section-title">点检项目明细</div>
            <van-button v-if="!isViewMode" size="small" type="primary" icon="plus" @click="addCheckItem">添加</van-button>
          </div>
          
          <div v-if="formData.items.length === 0" class="empty-items">
            <van-empty description="暂无点检项目" />
          </div>
          
          <!-- 查看模式的项目列表 -->
          <template v-if="isViewMode">
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
                <div class="item-value">{{ item.min }} - {{ item.max }}</div>
              </div>
            </div>
          </template>
          
          <!-- 编辑模式的项目列表 -->
          <template v-else>
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
          </template>
        </div>
      </van-form>
    </div>
    
    <!-- 加载状态 -->
    <div class="loading-container" v-if="loading">
      <van-loading type="spinner" color="#1989fa" size="36" />
      <p class="loading-text">加载中...</p>
    </div>
    
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
    
    <!-- 固定在底部的保存按钮 -->
    <div class="fixed-bottom" v-if="!loading && !isViewMode">
      <van-button round block type="primary" @click="onSubmit">保存</van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { showToast, showSuccessToast, showDialog } from 'vant';
import NavBar from '@/components/NavBar.vue';
import { useCheckStore } from '@/store/check';

const route = useRoute();
const router = useRouter();
const checkStore = useCheckStore();
const loading = ref(false);
const formRef = ref(null);

// 判断是新增还是编辑
const isNewStandard = computed(() => {
  return route.name === 'CheckStandardAdd' || route.path.includes('/add');
});

// 判断是查看模式还是编辑模式
const isViewMode = computed(() => {
  return route.name === 'CheckStandardDetail' && !route.path.includes('/edit') && !route.path.includes('/add');
});

// 获取页面标题
const getPageTitle = () => {
  if (isNewStandard.value) {
    return '新增点检标准';
  } else if (isViewMode.value) {
    return '点检标准详情';
  } else {
    return '编辑点检标准';
  }
};

// 点检项目数据结构
interface CheckItem {
  id: string;
  name: string;
  method: string;
  min: string;
  max: string;
}

// 表单数据
const formData = ref({
  id: '',
  name: '',
  code: '',
  equipmentType: '',
  itemCount: 0,
  items: [] as CheckItem[]
});

// 弹窗控制
const showTypePopup = ref(false);
const selectedType = ref('');

// 设备类型选项
const typeOptions = [
  '机床设备',
  '包装设备',
  '电力设备',
  '检测设备',
  '冷却设备'
];

// 显示类型选择器
const showTypeSelector = () => {
  selectedType.value = formData.value.equipmentType;
  showTypePopup.value = true;
};

// 选择设备类型
const selectType = (type: string) => {
  formData.value.equipmentType = type;
  selectedType.value = type;
  showTypePopup.value = false;
};

// 添加点检项目
const addCheckItem = () => {
  formData.value.items.push({
    id: `ITEM${Date.now().toString().slice(-6)}`,
    name: '',
    method: '',
    min: '',
    max: ''
  });
};

// 删除点检项目
const removeCheckItem = (index: number) => {
  formData.value.items.splice(index, 1);
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
const onSubmit = async () => {
  try {
    // 验证表单
    if (!formData.value.name) {
      showToast('请输入标准名称');
      return;
    }
    if (!formData.value.code) {
      showToast('请输入标准编码');
      return;
    }
    if (!formData.value.equipmentType) {
      showToast('请选择设备类型');
      return;
    }
    if (formData.value.items.length === 0) {
      showToast('请添加至少一个点检项目');
      return;
    }
    
    // 验证所有检查项是否填写完整
    for (const item of formData.value.items) {
      if (!item.name) {
        showToast('请填写检查项名称');
        return;
      }
      if (!item.method) {
        showToast('请填写检查方法');
        return;
      }
    }
    
    // 更新项目数量
    formData.value.itemCount = formData.value.items.length;
    
    // 开始提交
    loading.value = true;
    
    if (isNewStandard.value) {
      // 新增点检标准
      await checkStore.saveStandard(formData.value);
      showSuccessToast('点检标准添加成功');
    } else {
      // 编辑点检标准
      await checkStore.saveStandard(formData.value);
      showSuccessToast('点检标准已更新');
    }
    
    // 返回点检标准列表页
    setTimeout(() => {
      router.push('/check/standard');
    }, 1500);
  } catch (error) {
    console.error('保存点检标准失败', error);
    showToast('保存失败');
  } finally {
    loading.value = false;
  }
};

// 获取点检标准详情
const fetchStandardDetail = async (id: string) => {
  try {
    loading.value = true;
    const standard = await checkStore.fetchStandardDetail(id);
    if (standard) {
      formData.value = { ...standard };
      selectedType.value = standard.equipmentType;
    } else {
      showToast('点检标准不存在');
      router.back();
    }
  } catch (error) {
    console.error('获取点检标准详情失败', error);
    showToast('获取点检标准详情失败');
    router.back();
  } finally {
    loading.value = false;
  }
};

// 页面加载时获取点检标准详情
onMounted(() => {
  if (!isNewStandard.value) {
    const id = route.params.id as string;
    fetchStandardDetail(id);
  }
});
</script>

<style scoped>
/* 使用全局样式 */

.range-fields {
  display: flex;
  gap: 8px;
}

.range-fields :deep(.van-field) {
  flex: 1;
}

:deep(.van-cell-group--inset) {
  margin: 0 0 8px 0;
}

:deep(.van-swipe-cell__right) {
  display: flex;
  align-items: stretch;
}

:deep(.van-button--danger) {
  height: 100%;
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
</style> 