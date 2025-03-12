<template>
  <div class="page-container">
    <nav-bar title="点检标准" />
    
    <div class="content">
      <!-- 搜索区域 -->
      <div class="filter-area">
        <van-search
          v-model="searchText"
          placeholder="搜索点检标准名称/编码"
          shape="round"
          @search="searchStandards"
          @clear="clearSearch"
        />
      </div>
      
      <!-- 点检标准列表 -->
      <div class="list-container">
        <template v-if="loading">
          <van-skeleton title :row="3" v-for="i in 3" :key="i" />
        </template>
        
        <template v-else-if="filteredStandards.length">
          <div class="card" v-for="standard in filteredStandards" :key="standard.id">
            <div class="card-header">
              <div class="card-title">{{ standard.name }}</div>
            </div>
            <div class="card-content">
              <div class="info-row">
                <div class="info-item">
                  <van-icon name="bar-code" />
                  <span>{{ standard.code }}</span>
                </div>
                <div class="info-item">
                  <van-icon name="apps-o" />
                  <span>{{ standard.equipmentType }}</span>
                </div>
              </div>
              <div class="info-row">
                <div class="info-item">
                  <van-icon name="description" />
                  <span>检查项数量: {{ standard.itemCount }}</span>
                </div>
                <div class="info-item">
                  <van-icon name="clock-o" />
                  <span>{{ standard.lastUpdateTime || '暂无更新' }}</span>
                </div>
              </div>
            </div>
            <div class="card-footer">
              <div class="button-group">
                <van-button size="small" type="primary" @click="viewStandard(standard.id)">查看</van-button>
                <van-button size="small" plain @click="editStandard(standard.id)">编辑</van-button>
                <van-button size="small" type="danger" plain @click="confirmDelete(standard)">删除</van-button>
              </div>
            </div>
          </div>
        </template>
        
        <template v-else>
          <van-empty description="暂无点检标准" />
        </template>
      </div>
    </div>
    
    <!-- 删除确认对话框 -->
    <van-dialog
      v-model:show="showDeleteDialog"
      title="删除点检标准"
      show-cancel-button
      @confirm="deleteStandard"
    >
      <div class="dialog-content">
        确定要删除【{{ currentStandard?.name }}】吗？此操作不可恢复。
      </div>
    </van-dialog>
    
    <!-- 固定在底部的添加按钮 -->
    <div class="fixed-bottom">
      <van-button 
        type="primary" 
        block 
        @click="addStandard"
        icon="plus"
      >新增点检标准</van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { showToast, showSuccessToast } from 'vant';
import NavBar from '@/components/NavBar.vue';
import { useCheckStore } from '@/store/check';

const router = useRouter();
const checkStore = useCheckStore();
const loading = ref(true);
const searchText = ref('');

// 当前选中的标准
const currentStandard = ref<any>(null);

// 对话框控制
const showDeleteDialog = ref(false);

// 筛选后的标准列表
const filteredStandards = computed(() => {
  if (!checkStore.getStandardList) return [];
  
  let standards = checkStore.getStandardList;
  
  // 应用搜索文本筛选
  if (searchText.value) {
    const keyword = searchText.value.toLowerCase();
    standards = standards.filter(
      item => 
        item.name.toLowerCase().includes(keyword) || 
        item.code.toLowerCase().includes(keyword) ||
        item.equipmentType.toLowerCase().includes(keyword)
    );
  }
  
  return standards;
});

// 搜索标准
const searchStandards = () => {
  // 已通过计算属性实现
};

// 清除搜索
const clearSearch = () => {
  searchText.value = '';
};

// 查看标准详情
const viewStandard = (id: string) => {
  router.push(`/check/standard/${id}`);
};

// 编辑标准
const editStandard = (id: string) => {
  router.push(`/check/standard/edit/${id}`);
};

// 添加标准
const addStandard = () => {
  router.push('/check/standard/add');
};

// 确认删除
const confirmDelete = (standard: any) => {
  currentStandard.value = standard;
  showDeleteDialog.value = true;
};

// 删除标准
const deleteStandard = async () => {
  if (!currentStandard.value) return;
  
  try {
    await checkStore.deleteStandard(currentStandard.value.id);
    showSuccessToast('删除成功');
  } catch (error) {
    console.error('删除标准失败', error);
    showToast('删除失败');
  }
};

// 页面加载时获取标准列表
onMounted(async () => {
  try {
    await checkStore.fetchStandardList();
  } catch (error) {
    console.error('获取点检标准列表失败', error);
    showToast('获取点检标准列表失败');
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
/* 使用全局样式 */
</style> 