<template>
  <div class="equipment-container">
    <nav-bar title="设备档案" />
    
    <div class="content">
      <div class="filter-bar">
        <van-search
          v-model="searchText"
          placeholder="搜索设备名称/型号"
          shape="round"
          show-action
          @search="onSearch"
          @cancel="onCancel"
          @clear="onClear"
        />
        
        <van-dropdown-menu>
          <van-dropdown-item v-model="filterType" :options="typeOptions" />
          <van-dropdown-item v-model="filterStatus" :options="statusOptions" />
        </van-dropdown-menu>
      </div>
      
      <div class="equipment-list">
        <template v-if="loading">
          <van-skeleton title avatar :row="3" v-for="i in 3" :key="i" />
        </template>
        
        <template v-else-if="filteredEquipments.length">
          <equipment-card
            v-for="equipment in filteredEquipments"
            :key="equipment.id"
            :equipment="equipment"
          />
        </template>
        
        <template v-else>
          <van-empty description="暂无设备数据" />
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useEquipmentStore } from '@/store/equipment';
import NavBar from '@/components/NavBar.vue';
import EquipmentCard from '@/components/EquipmentCard.vue';

const equipmentStore = useEquipmentStore();
const loading = ref(true);
const searchText = ref('');
const filterType = ref('');
const filterStatus = ref('');

// 类型筛选选项
const typeOptions = [
  { text: '全部类型', value: '' },
  { text: '机床设备', value: '机床设备' },
  { text: '包装设备', value: '包装设备' },
  { text: '电力设备', value: '电力设备' },
  { text: '检测设备', value: '检测设备' },
  { text: '冷却设备', value: '冷却设备' }
];

// 状态筛选选项
const statusOptions = [
  { text: '全部状态', value: '' },
  { text: '正常', value: 'normal' },
  { text: '故障', value: 'fault' },
  { text: '维修中', value: 'maintenance' },
  { text: '已报废', value: 'scrapped' }
];

// 筛选后的设备列表
const filteredEquipments = computed(() => {
  let result = equipmentStore.getEquipmentList;
  
  // 按设备类型筛选
  if (filterType.value) {
    result = result.filter(item => item.type === filterType.value);
  }
  
  // 按设备状态筛选
  if (filterStatus.value) {
    result = result.filter(item => item.status === filterStatus.value);
  }
  
  // 按关键字搜索
  if (searchText.value) {
    const keyword = searchText.value.toLowerCase();
    result = result.filter(
      item => 
        item.name.toLowerCase().includes(keyword) || 
        item.model.toLowerCase().includes(keyword)
    );
  }
  
  return result;
});

// 搜索设备
const onSearch = () => {
  // 已通过计算属性实现
};

// 取消搜索
const onCancel = () => {
  searchText.value = '';
};

// 清除搜索内容
const onClear = () => {
  searchText.value = '';
};

// 页面加载时获取设备列表
onMounted(async () => {
  try {
    await equipmentStore.fetchEquipmentList();
  } catch (error) {
    console.error('获取设备列表失败', error);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.equipment-container {
  padding-top: 46px;
  padding-bottom: 50px;
  min-height: 100vh;
  background-color: #f8fafc;
}

.content {
  padding: 16px;
}

.filter-bar {
  position: sticky;
  top: 46px;
  z-index: 10;
  background-color: #f8fafc;
  margin-bottom: 16px;
}

.equipment-list {
  margin-top: 16px;
}

:deep(.van-dropdown-menu) {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  overflow: hidden;
  margin-top: 12px;
}

:deep(.van-dropdown-menu__bar) {
  background-color: #fff;
}

:deep(.van-dropdown-menu__title) {
  color: #1a56db;
}

:deep(.van-dropdown-menu__title::after) {
  border-color: #1a56db transparent transparent;
}

:deep(.van-dropdown-menu__title--active) {
  color: #1a56db;
}

:deep(.van-search) {
  padding: 0;
  background-color: transparent;
}

:deep(.van-search__content) {
  background-color: #fff;
}
</style> 