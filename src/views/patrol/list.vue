<template>
  <div class="patrol-list-container">
    <nav-bar title="设备巡检单" />
    
    <div class="content">
      <!-- 搜索和筛选区域 -->
      <div class="filter-area">
        <van-search
          v-model="searchText"
          placeholder="搜索设备名称/编码"
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
      
      <!-- 巡检单列表 -->
      <div class="patrol-list">
        <template v-if="loading">
          <van-skeleton title :row="3" v-for="i in 3" :key="i" />
        </template>
        
        <template v-else-if="filteredRecords.length">
          <div class="patrol-card" v-for="record in filteredRecords" :key="record.id">
            <div class="card-header">
              <div class="card-title">{{ record.equipmentName }}</div>
              <van-tag :type="getResultType(record.result)">
                {{ record.result === 'normal' ? '正常' : '异常' }}
              </van-tag>
            </div>
            <div class="card-content">
              <div class="info-row">
                <div class="info-item">
                  <van-icon name="bar-code" />
                  <span>{{ record.equipmentCode }}</span>
                </div>
                <div class="info-item">
                  <van-icon name="location-o" />
                  <span>{{ record.workshop }}</span>
                </div>
              </div>
              <div class="info-row">
                <div class="info-item">
                  <van-icon name="description" />
                  <span>{{ record.planName }}</span>
                </div>
                <div class="info-item">
                  <van-icon name="clock-o" />
                  <span>{{ record.patrolTime }}</span>
                </div>
              </div>
              <div class="info-row">
                <div class="info-item">
                  <van-icon name="setting-o" />
                  <span>设备状态: {{ getStatusText(record.equipmentStatus) }}</span>
                </div>
              </div>
            </div>
            <div class="card-footer">
              <div class="button-group">
                <van-button size="small" type="primary" @click="viewDetail(record.id)">查看</van-button>
                <van-button size="small" plain @click="editRecord(record.id)">编辑</van-button>
                <van-button 
                  v-if="record.result === 'abnormal'" 
                  size="small" 
                  type="warning" 
                  plain 
                  @click="reportRepair(record)"
                >报修</van-button>
                <van-button size="small" type="danger" plain @click="confirmDelete(record)">删除</van-button>
              </div>
            </div>
          </div>
        </template>
        
        <template v-else>
          <van-empty description="暂无巡检记录" />
        </template>
      </div>
    </div>
    
    <!-- 删除确认对话框 -->
    <van-dialog
      v-model:show="showDeleteDialog"
      title="删除巡检记录"
      show-cancel-button
      @confirm="deleteRecord"
    >
      <div class="dialog-content">
        确定要删除此巡检记录吗？此操作不可恢复。
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
      >新增巡检单</van-button>
    </div>
    
    <tab-bar />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { showToast, showSuccessToast } from 'vant';
import NavBar from '@/components/NavBar.vue';
import TabBar from '@/components/TabBar.vue';
import { usePatrolStore } from '@/store/patrol';
import type { PatrolRecord } from '@/store/patrol';

const router = useRouter();
const patrolStore = usePatrolStore();
const loading = ref(true);
const searchText = ref('');

// 日期筛选相关
const showDatePicker = ref(false);
const filterDate = ref('');

// 当前选中的记录
const currentRecord = ref<PatrolRecord | null>(null);

// 对话框控制
const showDeleteDialog = ref(false);
const showRepairDialog = ref(false);

// 报修表单
const repairForm = ref({
  reason: '',
  contact: '',
  phone: ''
});

// 根据日期和搜索文本筛选的巡检记录列表
const filteredRecords = computed(() => {
  if (!patrolStore.getRecordList) return [];
  
  let records = patrolStore.getRecordList;
  
  // 应用日期筛选
  if (filterDate.value) {
    const filterDateStr = filterDate.value.split(' ')[0]; // 只取日期部分，不考虑时间
    records = records.filter(item => 
      item.patrolTime.startsWith(filterDateStr)
    );
  }
  
  // 应用搜索文本筛选
  if (searchText.value) {
    const keyword = searchText.value.toLowerCase();
    records = records.filter(
      item => 
        item.equipmentName.toLowerCase().includes(keyword) || 
        item.equipmentCode.toLowerCase().includes(keyword)
    );
  }
  
  return records;
});

// 获取结果类型
const getResultType = (result: string) => {
  return result === 'normal' ? 'success' : 'danger';
};

// 获取设备状态文本
const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    'normal': '正常运行',
    'warning': '带病运行',
    'repair': '维修中',
    'standby': '备用',
    'stop': '停用',
    'scrap': '报废'
  };
  return statusMap[status] || '未知';
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

// 查看详情
const viewDetail = (id: string) => {
  router.push(`/patrol/record-detail/${id}`);
};

// 编辑记录
const editRecord = (id: string) => {
  router.push(`/patrol/record-edit/${id}`);
};

// 添加记录
const addRecord = () => {
  router.push('/patrol/record-add');
};

// 确认删除
const confirmDelete = (record: PatrolRecord) => {
  currentRecord.value = record;
  showDeleteDialog.value = true;
};

// 删除记录
const deleteRecord = async () => {
  if (!currentRecord.value) return;
  
  try {
    await patrolStore.deleteRecord(currentRecord.value.id);
    showSuccessToast('删除成功');
    await patrolStore.fetchRecordList();
  } catch (error) {
    console.error('删除巡检记录失败', error);
    showToast('删除失败');
  }
};

// 报修
const reportRepair = (record: PatrolRecord) => {
  currentRecord.value = record;
  // 预填写报修原因：根据异常项目自动生成
  const abnormalItems = record.items.filter(item => item.result === 'abnormal');
  if (abnormalItems.length > 0) {
    repairForm.value.reason = `${record.equipmentName}存在以下异常：\n` + 
      abnormalItems.map(item => `${item.name}: ${item.remark || '异常'}`).join('\n');
  } else {
    repairForm.value.reason = '';
  }
  
  showRepairDialog.value = true;
};

// 确认报修
const confirmRepair = async () => {
  if (!currentRecord.value) return;
  
  try {
    // 这里简化处理，实际可能需要调用报修API
    showSuccessToast('报修成功');
    showRepairDialog.value = false;
    
    // 更新设备状态为"维修中"
    if (currentRecord.value.equipmentStatus !== 'repair') {
      const updatedRecord = { ...currentRecord.value, equipmentStatus: 'repair' };
      await patrolStore.saveRecord(updatedRecord);
      await patrolStore.fetchRecordList();
    }
  } catch (error) {
    console.error('报修失败', error);
    showToast('报修失败');
  }
};

// 初始化
onMounted(async () => {
  try {
    await patrolStore.fetchRecordList();
  } catch (error) {
    console.error('获取巡检记录列表失败', error);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.patrol-list-container {
  padding-top: 46px;
  padding-bottom: 50px;
  min-height: 100vh;
  background-color: var(--van-background);
}

.content {
  padding-bottom: 70px;
}

.filter-area {
  margin-bottom: 12px;
  background-color: var(--card-background);
  border-radius: 8px;
  overflow: hidden;
}

.patrol-list {
  padding: 12px;
}

.patrol-card {
  background-color: white;
  border-radius: 8px;
  margin-bottom: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.card-title {
  font-size: 16px;
  font-weight: bold;
}

.card-content {
  margin-bottom: 16px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-bottom: 8px;
}

.info-item {
  display: flex;
  align-items: center;
  color: var(--van-gray-7);
  margin-right: 8px;
  margin-bottom: 4px;
}

.info-item .van-icon {
  margin-right: 4px;
  font-size: 16px;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  flex-wrap: wrap;
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

.dialog-content {
  padding: 16px;
  text-align: center;
}

.repair-form {
  padding: 16px;
}

.date-filter {
  margin: 0 12px 12px;
}
</style>