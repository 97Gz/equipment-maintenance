<template>
  <div class="page-container">
    <nav-bar title="车间" />
    
    <div class="content">
      <!-- 搜索区域 -->
      <div class="filter-area">
        <van-search
          v-model="searchText"
          placeholder="搜索车间名称"
          shape="round"
          @search="onSearch"
          @clear="onClear"
        />
      </div>
      
      <!-- 车间列表 -->
      <div class="list-container">
        <template v-if="loading">
          <van-skeleton title :row="2" v-for="i in 3" :key="i" />
        </template>
        
        <template v-else-if="filteredWorkshops.length">
          <div class="card" v-for="workshop in filteredWorkshops" :key="workshop.id">
            <div class="card-header">
              <div class="card-title">{{ workshop.name }}</div>
              <div class="workshop-id">{{ workshop.id }}</div>
            </div>
            <div class="card-content">
              <div class="info-row">
                <div class="info-item">
                  <van-icon name="clock-o" />
                  <span>创建时间: {{ workshop.createTime }}</span>
                </div>
                <div class="info-item">
                  <van-icon name="underway-o" />
                  <span>更新时间: {{ workshop.updateTime }}</span>
                </div>
              </div>
            </div>
            <div class="card-footer">
              <div class="button-group">
                <van-button size="small" type="primary" @click="viewWorkshop(workshop.id)">查看</van-button>
                <van-button size="small" plain @click="editWorkshop(workshop.id)">编辑</van-button>
                <van-button size="small" type="danger" plain @click="confirmDelete(workshop)">删除</van-button>
              </div>
            </div>
          </div>
        </template>
        
        <template v-else>
          <van-empty description="暂无车间数据" />
        </template>
      </div>
    </div>
    
    <!-- 删除确认对话框 -->
    <van-dialog
      v-model:show="showDeleteDialog"
      title="删除车间"
      show-cancel-button
      @confirm="deleteWorkshop"
    >
      <div class="dialog-content">
        确定要删除【{{ currentWorkshop?.name }}】吗？此操作不可恢复。
      </div>
    </van-dialog>
    
    <!-- 固定在底部的添加按钮 -->
    <div class="fixed-bottom">
      <van-button 
        type="primary" 
        block 
        @click="addWorkshop"
        icon="plus"
      >新增车间</van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { showToast, showSuccessToast } from 'vant';
import NavBar from '@/components/NavBar.vue';
import { useWorkshopStore } from '@/store/basic/workshop';

const router = useRouter();
const workshopStore = useWorkshopStore();
const loading = ref(true);
const searchText = ref('');

// 当前选中的车间
const currentWorkshop = ref<any>(null);

// 对话框控制
const showDeleteDialog = ref(false);

// 筛选后的车间列表
const filteredWorkshops = computed(() => {
  if (!workshopStore.getWorkshopList) return [];
  
  let workshops = workshopStore.getWorkshopList;
  
  // 应用搜索文本筛选
  if (searchText.value) {
    const keyword = searchText.value.toLowerCase();
    workshops = workshops.filter(
      item => item.name.toLowerCase().includes(keyword)
    );
  }
  
  return workshops;
});

// 搜索车间
const onSearch = () => {
  // 已通过计算属性实现
};

// 清除搜索内容
const onClear = () => {
  searchText.value = '';
};

// 查看车间详情
const viewWorkshop = (id: string) => {
  router.push(`/basic/workshop/detail/${id}`);
};

// 编辑车间
const editWorkshop = (id: string) => {
  router.push(`/basic/workshop/edit/${id}`);
};

// 新增车间
const addWorkshop = () => {
  router.push('/basic/workshop/add');
};

// 确认删除
const confirmDelete = (workshop: any) => {
  currentWorkshop.value = workshop;
  showDeleteDialog.value = true;
};

// 删除车间
const deleteWorkshop = async () => {
  if (!currentWorkshop.value) return;
  
  try {
    await workshopStore.deleteWorkshop(currentWorkshop.value.id);
    showSuccessToast('删除成功');
  } catch (error) {
    console.error('删除车间失败', error);
    showToast('删除失败');
  }
};

// 页面加载时获取车间列表
onMounted(async () => {
  try {
    await workshopStore.fetchWorkshopList();
  } catch (error) {
    console.error('获取车间列表失败', error);
    showToast('获取车间列表失败');
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
/* 使用全局样式 */
.workshop-id {
  font-size: 12px;
  color: var(--text-color-secondary);
}
</style> 