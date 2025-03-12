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
              label="设备名称"
              placeholder="请输入设备名称"
              :readonly="isViewMode"
              :rules="[{ required: true, message: '请输入设备名称' }]"
            />
            <van-field
              v-model="formData.typeName"
              name="typeName"
              label="设备类型"
              placeholder="请选择设备类型"
              readonly
              is-link
              :disabled="isViewMode"
              @click="!isViewMode && showTypeSelector()"
              :right-icon="isViewMode ? '' : 'arrow'"
              :rules="[{ required: true, message: '请选择设备类型' }]"
            />
            <van-field
              v-if="!isNewName"
              v-model="formData.id"
              name="id"
              label="名称编码"
              readonly
            />
            <van-field
              v-if="!isNewName"
              v-model="formData.createTime"
              name="createTime"
              label="创建时间"
              readonly
            />
            <van-field
              v-if="!isNewName"
              v-model="formData.updateTime"
              name="updateTime"
              label="更新时间"
              readonly
            />
          </van-cell-group>
        </div>
      </van-form>
    </div>
    
    <!-- 加载状态 -->
    <div class="loading-container" v-if="loading">
      <van-loading type="spinner" color="var(--primary-color)" size="36" />
      <p class="loading-text">加载中...</p>
    </div>
    
    <!-- 设备类型选择弹窗 -->
    <van-popup v-model:show="showTypePopup" position="bottom" :style="{ height: '40%' }">
      <div class="popup-header">
        <div class="popup-title">选择设备类型</div>
        <van-icon name="cross" @click="showTypePopup = false" />
      </div>
      <div class="popup-content">
        <van-radio-group v-model="selectedTypeId">
          <van-cell-group>
            <van-cell v-for="type in typeOptions" :key="type.id" clickable @click="selectType(type)">
              <template #title>
                <span class="item-title">{{ type.typeName }}</span>
              </template>
              <template #right-icon>
                <van-radio :name="type.id" />
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
import { showToast, showSuccessToast } from 'vant';
import NavBar from '@/components/NavBar.vue';
import { useEquipmentNameStore } from '@/store/basic/equipmentName';
import { useEquipmentTypeStore } from '@/store/basic/equipmentType';

const route = useRoute();
const router = useRouter();
const equipmentNameStore = useEquipmentNameStore();
const equipmentTypeStore = useEquipmentTypeStore();
const loading = ref(false);
const formRef = ref(null);

// 弹窗控制
const showTypePopup = ref(false);
const selectedTypeId = ref('');

// 判断是新增还是编辑
const isNewName = computed(() => {
  return route.name === 'EquipmentNameAdd' || route.path.includes('/add');
});

// 判断是查看模式还是编辑模式
const isViewMode = computed(() => {
  return route.name === 'EquipmentNameDetail' && !route.path.includes('/edit') && !route.path.includes('/add');
});

// 获取页面标题
const getPageTitle = () => {
  if (isNewName.value) {
    return '新增设备名称';
  } else if (isViewMode.value) {
    return '设备名称详情';
  } else {
    return '编辑设备名称';
  }
};

// 设备类型选项
const typeOptions = computed(() => {
  return equipmentTypeStore.getEquipmentTypeList || [];
});

// 表单数据
const formData = ref({
  id: '',
  name: '',
  typeId: '',
  typeName: '',
  createTime: '',
  updateTime: ''
});

// 显示类型选择器
const showTypeSelector = () => {
  selectedTypeId.value = formData.value.typeId;
  showTypePopup.value = true;
};

// 选择设备类型
const selectType = (type: any) => {
  formData.value.typeId = type.id;
  formData.value.typeName = type.typeName;
  selectedTypeId.value = type.id;
  showTypePopup.value = false;
};

// 表单提交
const onSubmit = async () => {
  try {
    // 验证表单
    if (!formData.value.name) {
      showToast('请输入设备名称');
      return;
    }
    if (!formData.value.typeId) {
      showToast('请选择设备类型');
      return;
    }
    
    // 开始提交
    loading.value = true;
    
    await equipmentNameStore.saveEquipmentName({
      id: isNewName.value ? undefined : formData.value.id,
      name: formData.value.name,
      typeId: formData.value.typeId,
      typeName: formData.value.typeName
    });
    
    showSuccessToast(isNewName.value ? '设备名称添加成功' : '设备名称已更新');
    
    // 返回设备名称列表页
    setTimeout(() => {
      router.push('/basic/equipment-name');
    }, 1500);
  } catch (error) {
    console.error('保存设备名称失败', error);
    showToast('保存失败');
  } finally {
    loading.value = false;
  }
};

// 获取设备名称详情
const fetchNameDetail = async (id: string) => {
  try {
    loading.value = true;
    const equipmentName = await equipmentNameStore.fetchEquipmentNameDetail(id);
    if (equipmentName) {
      formData.value = { ...equipmentName };
      selectedTypeId.value = equipmentName.typeId;
    } else {
      showToast('设备名称不存在');
      router.back();
    }
  } catch (error) {
    console.error('获取设备名称详情失败', error);
    showToast('获取设备名称详情失败');
    router.back();
  } finally {
    loading.value = false;
  }
};

// 页面加载时获取设备类型列表和设备名称详情
onMounted(async () => {
  try {
    loading.value = true;
    
    // 获取设备类型列表
    await equipmentTypeStore.fetchEquipmentTypeList();
    
    // 如果是编辑或查看，获取设备名称详情
    if (!isNewName.value) {
      const id = route.params.id as string;
      await fetchNameDetail(id);
    }
  } catch (error) {
    console.error('页面初始化失败', error);
    showToast('数据加载失败');
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
/* 使用全局样式 */
</style> 