<template>
  <div class="page-container">
    <nav-bar title="仓库" />
    
    <div class="content">
      <!-- 搜索区域 -->
      <div class="filter-area">
        <van-search
          v-model="searchText"
          placeholder="搜索仓库名称/位置/管理员"
          shape="round"
          @search="onSearch"
          @clear="onClear"
        />
      </div>
      
      <!-- 仓库列表 -->
      <div class="list-container">
        <template v-if="loading">
          <van-skeleton title :row="3" v-for="i in 3" :key="i" />
        </template>
        
        <template v-else-if="filteredWarehouses.length">
          <div class="card" v-for="warehouse in filteredWarehouses" :key="warehouse.id">
            <div class="card-header">
              <div class="card-title">{{ warehouse.name }}</div>
              <div class="warehouse-id">{{ warehouse.id }}</div>
            </div>
            <div class="card-content">
              <div class="info-row">
                <div class="info-item">
                  <van-icon name="location-o" />
                  <span>位置: {{ warehouse.location || '未设置' }}</span>
                </div>
                <div class="info-item">
                  <van-icon name="manager-o" />
                  <span>管理员: {{ warehouse.manager || '未指定' }}</span>
                </div>
              </div>
              <div class="info-row">
                <div class="info-item">
                  <van-icon name="clock-o" />
                  <span>创建时间: {{ warehouse.createTime }}</span>
                </div>
              </div>
            </div>
            <div class="card-footer">
              <div class="button-group">
                <van-button size="small" type="primary" @click="viewWarehouse(warehouse.id)">查看</van-button>
                <van-button size="small" plain @click="editWarehouse(warehouse.id)">编辑</van-button>
                <van-button size="small" type="danger" plain @click="confirmDelete(warehouse)">删除</van-button>
              </div>
            </div>
          </div>
        </template>
        
        <template v-else>
          <van-empty description="暂无仓库数据" />
        </template>
      </div>
    </div>
    
    <!-- 删除确认对话框 -->
    <van-dialog
      v-model:show="showDeleteDialog"
      title="删除仓库"
      show-cancel-button
      @confirm="deleteWarehouse"
    >
      <div class="dialog-content">
        确定要删除【{{ currentWarehouse?.name }}】吗？此操作不可恢复。
      </div>
    </van-dialog>
    
    <!-- 固定在底部的添加按钮 -->
    <div class="fixed-bottom">
      <van-button 
        type="primary" 
        block 
        @click="addWarehouse"
        icon="plus"
      >新增仓库</van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { showToast, showSuccessToast } from 'vant';
import NavBar from '@/components/NavBar.vue';
import { useWarehouseStore } from '@/store/basic/warehouse';

const router = useRouter();
const warehouseStore = useWarehouseStore();
const loading = ref(true);
const searchText = ref('');

// 当前选中的仓库
const currentWarehouse = ref<any>(null);

// 对话框控制
const showDeleteDialog = ref(false);

// 筛选后的仓库列表
const filteredWarehouses = computed(() => {
  if (!warehouseStore.getWarehouseList) return [];
  
  let warehouses = warehouseStore.getWarehouseList;
  
  // 应用搜索文本筛选
  if (searchText.value) {
    const keyword = searchText.value.toLowerCase();
    warehouses = warehouses.filter(
      item => 
        item.name.toLowerCase().includes(keyword) || 
        (item.location && item.location.toLowerCase().includes(keyword)) ||
        (item.manager && item.manager.toLowerCase().includes(keyword))
    );
  }
  
  return warehouses;
});

// 搜索仓库
const onSearch = () => {
  // 已通过计算属性实现
};

// 清除搜索内容
const onClear = () => {
  searchText.value = '';
};

// 查看仓库详情
const viewWarehouse = (id: string) => {
  router.push(`/basic/warehouse/detail/${id}`);
};

// 编辑仓库
const editWarehouse = (id: string) => {
  router.push(`/basic/warehouse/edit/${id}`);
};

// 新增仓库
const addWarehouse = () => {
  router.push('/basic/warehouse/add');
};

// 确认删除
const confirmDelete = (warehouse: any) => {
  currentWarehouse.value = warehouse;
  showDeleteDialog.value = true;
};

// 删除仓库
const deleteWarehouse = async () => {
  if (!currentWarehouse.value) return;
  
  try {
    await warehouseStore.deleteWarehouse(currentWarehouse.value.id);
    showSuccessToast('删除成功');
  } catch (error) {
    console.error('删除仓库失败', error);
    showToast('删除失败');
  }
};

// 页面加载时获取仓库列表
onMounted(async () => {
  try {
    await warehouseStore.fetchWarehouseList();
  } catch (error) {
    console.error('获取仓库列表失败', error);
    showToast('获取仓库列表失败');
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
/* 使用全局样式 */
.warehouse-id {
  font-size: 12px;
  color: var(--text-color-secondary);
}
</style> 