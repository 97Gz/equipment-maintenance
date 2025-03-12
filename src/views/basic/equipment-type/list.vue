<template>
  <div class="page-container">
    <nav-bar title="设备类型" />
    
    <div class="content">
      <!-- 搜索区域 -->
      <div class="filter-area">
        <van-search
          v-model="searchText"
          placeholder="搜索设备类型名称"
          shape="round"
          @search="onSearch"
          @clear="onClear"
        />
      </div>
      
      <!-- 设备类型列表 -->
      <div class="list-container">
        <template v-if="loading">
          <van-skeleton title :row="2" v-for="i in 3" :key="i" />
        </template>
        
        <template v-else-if="filteredTypes.length">
          <div class="card" v-for="type in filteredTypes" :key="type.id">
            <div class="card-header">
              <div class="card-title">{{ type.typeName }}</div>
              <div class="type-id">{{ type.id }}</div>
            </div>
            <div class="card-content">
              <div class="info-row">
                <div class="info-item">
                  <van-icon name="clock-o" />
                  <span>创建时间: {{ type.createTime }}</span>
                </div>
                <div class="info-item">
                  <van-icon name="underway-o" />
                  <span>更新时间: {{ type.updateTime }}</span>
                </div>
              </div>
            </div>
            <div class="card-footer">
              <div class="button-group">
                <van-button size="small" type="primary" @click="viewType(type.id)">查看</van-button>
                <van-button size="small" plain @click="editType(type.id)">编辑</van-button>
                <van-button size="small" type="danger" plain @click="confirmDelete(type)">删除</van-button>
              </div>
            </div>
          </div>
        </template>
        
        <template v-else>
          <van-empty description="暂无设备类型数据" />
        </template>
      </div>
    </div>
    
    <!-- 删除确认对话框 -->
    <van-dialog
      v-model:show="showDeleteDialog"
      title="删除设备类型"
      show-cancel-button
      @confirm="deleteType"
    >
      <div class="dialog-content">
        确定要删除【{{ currentType?.typeName }}】吗？此操作不可恢复。
      </div>
    </van-dialog>
    
    <!-- 固定在底部的添加按钮 -->
    <div class="fixed-bottom">
      <van-button 
        type="primary" 
        block 
        @click="addType"
        icon="plus"
      >新增设备类型</van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { showToast, showSuccessToast } from 'vant';
import NavBar from '@/components/NavBar.vue';
import { useEquipmentTypeStore } from '@/store/basic/equipmentType';

const router = useRouter();
const equipmentTypeStore = useEquipmentTypeStore();
const loading = ref(true);
const searchText = ref('');

// 当前选中的设备类型
const currentType = ref<any>(null);

// 对话框控制
const showDeleteDialog = ref(false);

// 筛选后的设备类型列表
const filteredTypes = computed(() => {
  if (!equipmentTypeStore.getEquipmentTypeList) return [];
  
  let types = equipmentTypeStore.getEquipmentTypeList;
  
  // 应用搜索文本筛选
  if (searchText.value) {
    const keyword = searchText.value.toLowerCase();
    types = types.filter(
      item => item.typeName.toLowerCase().includes(keyword)
    );
  }
  
  return types;
});

// 搜索设备类型
const onSearch = () => {
  // 已通过计算属性实现
};

// 清除搜索内容
const onClear = () => {
  searchText.value = '';
};

// 查看设备类型详情
const viewType = (id: string) => {
  router.push(`/basic/equipment-type/detail/${id}`);
};

// 编辑设备类型
const editType = (id: string) => {
  router.push(`/basic/equipment-type/edit/${id}`);
};

// 新增设备类型
const addType = () => {
  router.push('/basic/equipment-type/add');
};

// 确认删除
const confirmDelete = (type: any) => {
  currentType.value = type;
  showDeleteDialog.value = true;
};

// 删除设备类型
const deleteType = async () => {
  if (!currentType.value) return;
  
  try {
    await equipmentTypeStore.deleteEquipmentType(currentType.value.id);
    showSuccessToast('删除成功');
  } catch (error) {
    console.error('删除设备类型失败', error);
    showToast('删除失败');
  }
};

// 页面加载时获取设备类型列表
onMounted(async () => {
  try {
    await equipmentTypeStore.fetchEquipmentTypeList();
  } catch (error) {
    console.error('获取设备类型列表失败', error);
    showToast('获取设备类型列表失败');
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
/* 使用全局样式 */
.type-id {
  font-size: 12px;
  color: var(--text-color-secondary);
}
</style> 