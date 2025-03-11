<template>
  <div class="check-standard-container">
    <nav-bar title="点检标准" />
    
    <div class="content">
      <div class="search-bar">
        <van-search
          v-model="searchText"
          placeholder="搜索点检标准"
          shape="round"
          @search="searchStandards"
          @clear="clearSearch"
        />
      </div>
      
      <div class="standard-list">
        <template v-if="loading">
          <van-skeleton title :row="3" v-for="i in 3" :key="i" />
        </template>
        
        <template v-else-if="filteredStandards.length">
          <div class="standard-card" v-for="standard in filteredStandards" :key="standard.id" @click="viewStandard(standard.id)">
            <div class="standard-title">{{ standard.name }}</div>
            <div class="standard-info">
              <div class="info-item">
                <span class="label">编码:</span>
                <span class="value">{{ standard.code }}</span>
              </div>
              <div class="info-item">
                <span class="label">设备类型:</span>
                <span class="value">{{ standard.equipmentType }}</span>
              </div>
              <div class="info-item">
                <span class="label">检查项数量:</span>
                <span class="value">{{ standard.itemCount }}</span>
              </div>
              <div class="info-item">
                <span class="label">最后更新:</span>
                <span class="value">{{ standard.lastUpdateTime }}</span>
              </div>
            </div>
          </div>
        </template>
        
        <template v-else>
          <van-empty description="暂无点检标准" />
        </template>
      </div>
    </div>
    
    <!-- 添加按钮 -->
    <van-fab
      class="add-button"
      icon="plus"
      type="primary"
      @click="addStandard"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import NavBar from '@/components/NavBar.vue';

const router = useRouter();
const loading = ref(true);
const searchText = ref('');

// 点检标准数据结构
interface CheckStandard {
  id: string;
  name: string;
  code: string;
  equipmentType: string;
  itemCount: number;
  description?: string;
  lastUpdateTime?: string;
}

// 模拟点检标准列表
const standardList = ref<CheckStandard[]>([
  {
    id: 'STD001',
    name: '数控机床日常点检标准',
    code: 'DAILY-CNC-001',
    equipmentType: '数控机床',
    itemCount: 8,
    lastUpdateTime: '2023-05-10'
  },
  {
    id: 'STD002',
    name: '注塑机月度点检标准',
    code: 'MONTHLY-INJ-001',
    equipmentType: '注塑机',
    itemCount: 12,
    lastUpdateTime: '2023-06-15'
  },
  {
    id: 'STD003',
    name: '电气设备安全点检标准',
    code: 'SAFETY-ELEC-001',
    equipmentType: '电气设备',
    itemCount: 6,
    lastUpdateTime: '2023-07-20'
  }
]);

// 筛选后的标准列表
const filteredStandards = ref<CheckStandard[]>([]);

// 获取点检标准列表
const fetchStandardList = () => {
  // 实际项目中应从API获取数据
  filteredStandards.value = standardList.value;
  loading.value = false;
};

// 搜索标准
const searchStandards = () => {
  if (!searchText.value) {
    filteredStandards.value = standardList.value;
    return;
  }
  
  const keyword = searchText.value.toLowerCase();
  filteredStandards.value = standardList.value.filter(
    item => 
      item.name.toLowerCase().includes(keyword) || 
      item.code.toLowerCase().includes(keyword) ||
      item.equipmentType.toLowerCase().includes(keyword)
  );
};

// 清除搜索
const clearSearch = () => {
  searchText.value = '';
  filteredStandards.value = standardList.value;
};

// 查看标准详情
const viewStandard = (id: string) => {
  router.push(`/check/standard/${id}`);
};

// 添加标准
const addStandard = () => {
  router.push('/check/standard/add');
};

// 页面加载时获取标准列表
onMounted(() => {
  fetchStandardList();
});
</script>

<style scoped>
.check-standard-container {
  padding-top: 46px;
  padding-bottom: 50px;
  min-height: 100vh;
  background-color: var(--background-color);
}

.content {
  padding: 8px;
}

.search-bar {
  margin-bottom: 8px;
}

.standard-list {
  margin-top: 8px;
}

:deep(.van-cell-group--inset) {
  margin: 0 0 8px 0;
}

:deep(.van-search) {
  padding: 0;
  background-color: transparent;
}

:deep(.van-search__content) {
  background-color: var(--card-background);
}

.add-button {
  position: fixed;
  right: 16px;
  bottom: 66px;
  z-index: 10;
}
</style> 