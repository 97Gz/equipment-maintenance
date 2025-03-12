<template>
  <div class="check-list-container">
    <nav-bar title="设备点检单" />
    
    <div class="content">
      <!-- 搜索和筛选区域 -->
      <div class="filter-area">
        <van-search
          v-model="searchText"
          placeholder="搜索单据编号/设备名称"
          shape="round"
          @search="onSearch"
          @clear="onClear"
        />
        
        <!-- 日期筛选 -->
        <div class="date-filter">
          <van-cell 
            title="选择日期" 
            :value="filterDate || '全部'" 
            is-link 
            @click="showDatePicker = true"
          />
        </div>
      </div>
      
      <!-- 点检记录列表 -->
      <div class="check-list">
        <template v-if="loading">
          <van-skeleton title :row="3" v-for="i in 3" :key="i" />
        </template>
        
        <template v-else-if="filteredRecords.length">
          <div class="check-card" v-for="record in filteredRecords" :key="record.id">
            <div class="card-header">
              <div class="card-title">{{ record.recordNo }}</div>
              <van-tag :type="getStatusType(record.result)">
                {{ record.result === 'normal' ? '正常' : '异常' }}
              </van-tag>
            </div>
            <div class="card-content">
              <div class="info-row">
                <div class="info-item">
                  <van-icon name="shop-o" />
                  <span>{{ record.equipmentName }}</span>
                </div>
                <div class="info-item">
                  <van-icon name="bar-code" />
                  <span>{{ record.equipmentCode }}</span>
                </div>
              </div>
              <div class="info-row">
                <div class="info-item">
                  <van-icon name="clock-o" />
                  <span>{{ record.checkTime }}</span>
                </div>
                <div class="info-item">
                  <van-icon name="contact" />
                  <span>{{ record.checker }}</span>
                </div>
              </div>
            </div>
            <div class="card-footer">
              <div class="button-group">
                <van-button size="small" type="primary" @click="viewDetail(record.id)">查看</van-button>
                <van-button size="small" plain @click="editRecord(record.id)">编辑</van-button>
                <van-button size="small" type="success" plain @click="reportRepair(record)">报修</van-button>
                <van-button size="small" type="danger" plain @click="confirmDelete(record)">删除</van-button>
              </div>
            </div>
          </div>
        </template>
        
        <template v-else>
          <van-empty description="暂无点检记录" />
        </template>
      </div>
    </div>
    
    <!-- 删除确认对话框 -->
    <van-dialog
      v-model:show="showDeleteDialog"
      title="删除点检记录"
      show-cancel-button
      @confirm="deleteRecord"
    >
      <div class="dialog-content">
        确定要删除此点检记录吗？此操作不可恢复。
      </div>
    </van-dialog>
    
    <!-- 报修确认对话框 -->
    <van-dialog
      v-model:show="showRepairDialog"
      title="设备报修"
      show-cancel-button
      @confirm="confirmRepair"
    >
      <div class="repair-form">
        <van-field
          v-model="repairForm.reason"
          label="报修原因"
          type="textarea"
          placeholder="请输入报修原因"
          :rules="[{ required: true, message: '请输入报修原因' }]"
          rows="2"
          autosize
        />
        <van-field
          v-model="repairForm.contact"
          label="联系人"
          placeholder="请输入联系人"
          :rules="[{ required: true, message: '请输入联系人' }]"
        />
        <van-field
          v-model="repairForm.phone"
          label="联系电话"
          placeholder="请输入联系电话"
          :rules="[{ required: true, message: '请输入联系电话' }]"
        />
      </div>
    </van-dialog>
    
    <!-- 日期选择器 -->
    <van-calendar
      v-model:show="showDatePicker"
      @confirm="onSelectDate"
      :show-confirm="true"
      :round="false"
      title="选择筛选日期"
      color="#1989fa"
    />
    
    <!-- 固定在底部的添加按钮 -->
    <div class="fixed-bottom">
      <van-button 
        type="primary" 
        block 
        @click="addRecord"
        icon="plus"
      >新增点检单</van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { showToast, showNotify } from 'vant';
import NavBar from '@/components/NavBar.vue';
import { useCheckStore } from '@/store/check';

const router = useRouter();
const checkStore = useCheckStore();
const loading = ref(true);
const searchText = ref('');

// 日期筛选相关
const showDatePicker = ref(false);
const filterDate = ref('');

// 当前选中的记录
const currentRecord = ref<any>(null);

// 对话框控制
const showDeleteDialog = ref(false);
const showRepairDialog = ref(false);

// 报修表单
const repairForm = ref({
  reason: '',
  contact: '',
  phone: ''
});

// 根据日期和搜索文本筛选的点检记录列表
const filteredRecords = computed(() => {
  if (!checkStore.getRecordList) return [];
  
  let records = checkStore.getRecordList;
  
  // 应用日期筛选
  if (filterDate.value) {
    const filterDateStr = filterDate.value.split(' ')[0]; // 只取日期部分，不考虑时间
    records = records.filter((item: any) => 
      item.checkTime.startsWith(filterDateStr)
    );
  }
  
  // 应用搜索文本筛选
  if (searchText.value) {
    const keyword = searchText.value.toLowerCase();
    records = records.filter(
      (item: any) => 
        item.recordNo.toLowerCase().includes(keyword) || 
        item.equipmentName.toLowerCase().includes(keyword) || 
        item.equipmentCode.toLowerCase().includes(keyword)
    );
  }
  
  return records;
});

// 获取状态类型
const getStatusType = (status: string) => {
  return status === 'normal' ? 'success' : 'danger';
};

// 搜索
const onSearch = () => {
  // 已通过计算属性实现
};

// 清除搜索内容
const onClear = () => {
  searchText.value = '';
};

// 选择日期回调
const onSelectDate = (date: Date) => {
  // 格式化日期为'YYYY-MM-DD'
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  filterDate.value = `${year}-${month}-${day}`;
  showDatePicker.value = false;
};

// 清除日期筛选
const clearDateFilter = () => {
  filterDate.value = '';
};

// 查看详情
const viewDetail = (id: string) => {
  router.push(`/check/record/${id}`);
};

// 编辑记录
const editRecord = (id: string) => {
  router.push(`/check/record/edit/${id}`);
};

// 添加记录
const addRecord = () => {
  router.push('/check/record/add');
};

// 确认删除
const confirmDelete = (record: any) => {
  currentRecord.value = record;
  showDeleteDialog.value = true;
};

// 删除记录
const deleteRecord = async () => {
  if (!currentRecord.value) return;
  
  try {
    await checkStore.deleteRecord(currentRecord.value.id);
    showNotify({ type: 'success', message: '删除成功' });
  } catch (error) {
    showToast('删除失败');
    console.error('删除点检记录失败', error);
  }
};

// 报修
const reportRepair = (record: any) => {
  currentRecord.value = record;
  repairForm.value = {
    reason: '',
    contact: '',
    phone: ''
  };
  showRepairDialog.value = true;
};

// 确认报修
const confirmRepair = () => {
  // 这里应该调用API报修
  showNotify({ type: 'success', message: '报修成功' });
  // 导航到报修页面也可以
  // router.push(`/repair/maintenance/add?equipmentId=${currentRecord.value.equipmentId}`);
};

// 页面加载时获取点检记录列表
onMounted(async () => {
  try {
    await checkStore.fetchRecordList();
  } catch (error) {
    showToast('获取数据失败');
    console.error('获取点检记录列表失败', error);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.check-list-container {
  padding-top: 46px;
  padding-bottom: 56px; /* 为底部固定按钮留出空间 */
  min-height: 100vh;
  background-color: var(--background-color);
}

.content {
  padding: 8px;
  padding-bottom: 16px;
}

.filter-area {
  margin-bottom: 12px;
  background-color: var(--card-background);
  border-radius: 8px;
  overflow: hidden;
}

.date-filter {
  margin-top: 4px;
}

.check-list {
  margin-top: 8px;
}

.check-card {
  background-color: var(--card-background);
  border-radius: 8px;
  margin-bottom: 12px;
  padding: 12px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.card-title {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-color);
}

.card-content {
  margin-bottom: 12px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.info-item {
  display: flex;
  align-items: center;
  font-size: 13px;
  color: var(--text-color-secondary);
}

.info-item .van-icon {
  margin-right: 4px;
  color: var(--primary-color);
}

.card-footer {
  display: flex;
  justify-content: flex-end; /* 让按钮在右侧 */
}

.button-group {
  display: flex;
  gap: 8px;
}

.button-group .van-button {
  flex: 1;
  min-width: 60px; /* 设置按钮最小宽度 */
}

.dialog-content {
  padding: 16px;
  text-align: center;
}

.repair-form {
  padding: 16px;
}

.fixed-bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 8px 16px;
  background-color: #fff;
  box-shadow: 0 -2px 6px rgba(0, 0, 0, 0.05);
  z-index: 99;
}

:deep(.van-search) {
  padding: 0;
  background-color: transparent;
}

:deep(.van-search__content) {
  background-color: var(--card-background);
}
</style> 