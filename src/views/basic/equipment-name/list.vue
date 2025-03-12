<template>
  <div class="page-container">
    <nav-bar title="设备名称" />
    
    <div class="content">
      <!-- 搜索和筛选区域 -->
      <div class="filter-area">
        <van-search
          v-model="searchText"
          placeholder="搜索设备名称"
          shape="round"
          @search="onSearch"
          @clear="onClear"
        />
        
        <van-cell-group inset>
          <van-cell title="设备类型" :value="getFilterText(filterType)" is-link @click="showTypeFilter = true" />
        </van-cell-group>
      </div>
      
      <!-- 设备名称列表 -->
      <div class="list-container">
        <template v-if="loading">
          <van-skeleton title :row="3" v-for="i in 3" :key="i" />
        </template>
        
        <template v-else-if="filteredNames.length">
          <div class="card" v-for="item in filteredNames" :key="item.id">
            <div class="card-header">
              <div class="card-title">{{ item.name }}</div>
              <van-tag type="primary">{{ item.typeName }}</van-tag>
            </div>
            <div class="card-content">
              <div class="info-row">
                <div class="info-item">
                  <van-icon name="bar-code" />
                  <span>编码: {{ item.id }}</span>
                </div>
                <div class="info-item">
                  <van-icon name="clock-o" />
                  <span>创建: {{ item.createTime }}</span>
                </div>
              </div>
            </div>
            <div class="card-footer">
              <div class="button-group">
                <van-button size="small" type="primary" @click="viewName(item.id)">查看</van-button>
                <van-button size="small" plain @click="editName(item.id)">编辑</van-button>
                <van-button size="small" type="danger" plain @click="confirmDelete(item)">删除</van-button>
              </div>
            </div>
          </div>
        </template>
        
        <template v-else>
          <van-empty description="暂无设备名称数据" />
        </template>
      </div>
    </div>
    
    <!-- 类型筛选弹窗 -->
    <van-popup v-model:show="showTypeFilter" position="bottom" :style="{ height: '40%' }">
      <div class="popup-header">
        <div class="popup-title">选择设备类型</div>
        <van-icon name="cross" @click="showTypeFilter = false" />
      </div>
      <div class="popup-content">
        <van-radio-group v-model="filterType">
          <van-cell-group>
            <van-cell clickable @click="selectType('')">
              <template #title>
                <span class="item-title">全部类型</span>
              </template>
              <template #right-icon>
                <van-radio :name="''" />
              </template>
            </van-cell>
            <van-cell v-for="type in typeOptions" :key="type.id" clickable @click="selectType(type.id)">
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
    
    <!-- 删除确认对话框 -->
    <van-dialog
      v-model:show="showDeleteDialog"
      title="删除设备名称"
      show-cancel-button
      @confirm="deleteName"
    >
      <div class="dialog-content">
        确定要删除【{{ currentName?.name }}】吗？此操作不可恢复。
      </div>
    </van-dialog>
    
    <!-- 固定在底部的添加按钮 -->
    <div class="fixed-bottom">
      <van-button 
        type="primary" 
        block 
        @click="addName"
        icon="plus"
      >新增设备名称</van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { showToast, showSuccessToast } from 'vant';
import NavBar from '@/components/NavBar.vue';
import { useEquipmentNameStore } from '@/store/basic/equipmentName';
import { useEquipmentTypeStore } from '@/store/basic/equipmentType';

const router = useRouter();
const equipmentNameStore = useEquipmentNameStore();
const equipmentTypeStore = useEquipmentTypeStore();
const loading = ref(true);
const searchText = ref('');
const filterType = ref('');

// 弹窗控制
const showTypeFilter = ref(false);

// 当前选中的设备名称
const currentName = ref<any>(null);

// 对话框控制
const showDeleteDialog = ref(false);

// 设备类型选项
const typeOptions = computed(() => {
  return equipmentTypeStore.getEquipmentTypeList || [];
});

// 获取筛选文本
const getFilterText = (typeId: string) => {
  if (!typeId) return '全部类型';
  const type = typeOptions.value.find(item => item.id === typeId);
  return type ? type.typeName : '全部类型';
};

// 选择类型
const selectType = (typeId: string) => {
  filterType.value = typeId;
  showTypeFilter.value = false;
};

// 筛选后的设备名称列表
const filteredNames = computed(() => {
  if (!equipmentNameStore.getEquipmentNameList) return [];
  
  let names = equipmentNameStore.getEquipmentNameList;
  
  // 按设备类型筛选
  if (filterType.value) {
    names = names.filter(item => item.typeId === filterType.value);
  }
  
  // 按搜索文本筛选
  if (searchText.value) {
    const keyword = searchText.value.toLowerCase();
    names = names.filter(
      item => item.name.toLowerCase().includes(keyword)
    );
  }
  
  return names;
});

// 搜索设备名称
const onSearch = () => {
  // 已通过计算属性实现
};

// 清除搜索内容
const onClear = () => {
  searchText.value = '';
};

// 查看设备名称详情
const viewName = (id: string) => {
  router.push(`/basic/equipment-name/detail/${id}`);
};

// 编辑设备名称
const editName = (id: string) => {
  router.push(`/basic/equipment-name/edit/${id}`);
};

// 新增设备名称
const addName = () => {
  router.push('/basic/equipment-name/add');
};

// 确认删除
const confirmDelete = (name: any) => {
  currentName.value = name;
  showDeleteDialog.value = true;
};

// 删除设备名称
const deleteName = async () => {
  if (!currentName.value) return;
  
  try {
    await equipmentNameStore.deleteEquipmentName(currentName.value.id);
    showSuccessToast('删除成功');
  } catch (error) {
    console.error('删除设备名称失败', error);
    showToast('删除失败');
  }
};

// 页面加载时获取设备名称列表和设备类型列表
onMounted(async () => {
  try {
    loading.value = true;
    
    // 并行获取数据
    await Promise.all([
      equipmentNameStore.fetchEquipmentNameList(),
      equipmentTypeStore.fetchEquipmentTypeList()
    ]);
  } catch (error) {
    console.error('获取数据失败', error);
    showToast('获取设备名称列表失败');
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
/* 使用全局样式 */
</style> 