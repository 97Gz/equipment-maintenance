<template>
  <div class="check-list-container">
    <nav-bar title="设备点检单" />
    
    <div class="content">
      <div class="search-bar">
        <van-search
          v-model="searchText"
          placeholder="搜索设备名称"
          shape="round"
          @search="onSearch"
          @clear="onClear"
        />
      </div>
      
      <div class="check-list">
        <template v-if="loading">
          <van-skeleton title :row="3" v-for="i in 3" :key="i" />
        </template>
        
        <template v-else-if="filteredRecords.length">
          <div class="check-card" v-for="record in filteredRecords" :key="record.id">
            <div class="card-header">
              <div class="card-title">{{ record.equipmentName }}</div>
              <van-tag :type="getStatusType(record.result)">
                {{ record.result === 'normal' ? '正常' : '异常' }}
              </van-tag>
            </div>
            <div class="card-content">
              <div class="info-row">
                <div class="info-item">
                  <van-icon name="bar-code" />
                  <span>设备编码：{{ record.equipmentCode }}</span>
                </div>
                <div class="info-item">
                  <van-icon name="notes-o" />
                  <span>点检标准：{{ record.standardName }}</span>
                </div>
              </div>
              <div class="info-row">
                <div class="info-item">
                  <van-icon name="clock-o" />
                  <span>点检时间：{{ record.checkTime }}</span>
                </div>
                <div class="info-item">
                  <van-icon name="contact" />
                  <span>点检人员：{{ record.checker }}</span>
                </div>
              </div>
            </div>
            <div class="card-footer">
              <van-button size="small" type="primary" @click="viewDetail(record.id)">查看</van-button>
              <van-button size="small" plain @click="editRecord(record.id)">编辑</van-button>
              <van-button size="small" type="success" plain @click="reportRepair(record)">报修</van-button>
              <van-button size="small" type="danger" plain @click="confirmDelete(record)">删除</van-button>
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
    
    <!-- 添加按钮 -->
    <van-fab
      class="add-button"
      icon="plus"
      type="primary"
      @click="addRecord"
    />
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

// 筛选后的点检记录列表
const filteredRecords = computed(() => {
  if (!checkStore.getRecordList) return [];
  
  if (!searchText.value) {
    return checkStore.getRecordList;
  }
  
  const keyword = searchText.value.toLowerCase();
  return checkStore.getRecordList.filter(
    item => 
      item.equipmentName.toLowerCase().includes(keyword) || 
      item.equipmentCode.toLowerCase().includes(keyword)
  );
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
    showSuccessToast('删除成功');
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
  showSuccessToast('报修成功');
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
  gap: 8px;
}

.dialog-content {
  padding: 16px;
  text-align: center;
}

.repair-form {
  padding: 16px;
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