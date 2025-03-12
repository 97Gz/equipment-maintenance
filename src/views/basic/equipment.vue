<template>
  <div class="page-container">
    <nav-bar title="设备档案" />
    
    <div class="content">
      <!-- 搜索和筛选区域 -->
      <div class="filter-area">
        <van-search
          v-model="searchText"
          placeholder="搜索设备名称/型号"
          shape="round"
          @search="onSearch"
          @clear="onClear"
        />
        
        <van-cell-group inset>
          <van-cell title="设备类型" :value="getFilterText(filterType, typeOptions)" is-link @click="showTypeFilter = true" />
          <van-cell title="设备状态" :value="getFilterText(filterStatus, statusOptions)" is-link @click="showStatusFilter = true" />
        </van-cell-group>
      </div>
      
      <!-- 设备列表 -->
      <div class="list-container">
        <template v-if="loading">
          <van-skeleton title :row="3" v-for="i in 3" :key="i" />
        </template>
        
        <template v-else-if="filteredEquipments.length">
          <div class="card" v-for="equipment in filteredEquipments" :key="equipment.id">
            <div class="card-header">
              <div class="card-title">{{ equipment.code || 'EQ-' + equipment.id }}</div>
              <van-tag :type="getStatusType(equipment.status)">
                {{ getStatusText(equipment.status) }}
              </van-tag>
            </div>
            <div class="card-content">
              <div class="info-row">
                <div class="info-item">
                  <van-icon name="shop-o" />
                  <span>{{ equipment.name }}</span>
                </div>
                <div class="info-item">
                  <van-icon name="label-o" />
                  <span>{{ equipment.model || '无型号' }}</span>
                </div>
              </div>
              <div class="info-row">
                <div class="info-item">
                  <van-icon name="location-o" />
                  <span>{{ equipment.workshop || '未分配' }}</span>
                </div>
                <div class="info-item">
                  <van-icon name="cluster-o" />
                  <span>{{ equipment.type || '未分类' }}</span>
                </div>
              </div>
            </div>
            <div class="card-footer">
              <div class="button-group">
                <van-button size="small" type="primary" @click="viewDetail(equipment.id)">查看</van-button>
                <van-button size="small" plain @click="editEquipment(equipment.id)">编辑</van-button>
                <van-button size="small" type="success" plain @click="checkEquipment(equipment.id)">点检</van-button>
                <van-button size="small" type="danger" plain @click="confirmDelete(equipment)">删除</van-button>
              </div>
            </div>
          </div>
        </template>
        
        <template v-else>
          <van-empty description="暂无设备数据" />
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
            <van-cell v-for="option in typeOptions" :key="option.value" clickable @click="selectType(option.value)">
              <template #title>
                <span class="item-title">{{ option.text }}</span>
              </template>
              <template #right-icon>
                <van-radio :name="option.value" />
              </template>
            </van-cell>
          </van-cell-group>
        </van-radio-group>
      </div>
    </van-popup>
    
    <!-- 状态筛选弹窗 -->
    <van-popup v-model:show="showStatusFilter" position="bottom" :style="{ height: '50%' }">
      <div class="popup-header">
        <div class="popup-title">选择设备状态</div>
        <van-icon name="cross" @click="showStatusFilter = false" />
      </div>
      <div class="popup-content">
        <van-radio-group v-model="filterStatus">
          <van-cell-group>
            <van-cell v-for="option in statusOptions" :key="option.value" clickable @click="selectStatus(option.value)">
              <template #title>
                <span class="item-title">{{ option.text }}</span>
              </template>
              <template #right-icon>
                <van-radio :name="option.value" />
              </template>
            </van-cell>
          </van-cell-group>
        </van-radio-group>
      </div>
    </van-popup>
    
    <!-- 删除确认对话框 -->
    <van-dialog
      v-model:show="showDeleteDialog"
      title="删除设备"
      show-cancel-button
      @confirm="deleteEquipment"
    >
      <div class="dialog-content">
        确定要删除【{{ currentEquipment?.name }}】吗？此操作不可恢复。
      </div>
    </van-dialog>
    
    <!-- 固定在底部的添加按钮 -->
    <div class="fixed-bottom">
      <van-button 
        type="primary" 
        block 
        @click="addEquipment"
        icon="plus"
      >新增设备</van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { showToast, showSuccessToast } from 'vant';
import { useEquipmentStore } from '@/store/equipment';
import NavBar from '@/components/NavBar.vue';

const router = useRouter();
const equipmentStore = useEquipmentStore();
const loading = ref(true);
const searchText = ref('');
const filterType = ref('');
const filterStatus = ref('');

// 弹窗控制
const showTypeFilter = ref(false);
const showStatusFilter = ref(false);

// 当前选中的设备
const currentEquipment = ref<any>(null);

// 对话框控制
const showDeleteDialog = ref(false);

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
  { text: '正常运行', value: 'normal' },
  { text: '带病运行', value: 'warning' },
  { text: '维修中', value: 'repairing' },
  { text: '备用', value: 'standby' },
  { text: '停用', value: 'disabled' },
  { text: '报废', value: 'scrapped' }
];

// 获取筛选文本
const getFilterText = (value: string, options: { text: string, value: string }[]) => {
  const option = options.find(item => item.value === value);
  return option ? option.text : options[0].text;
};

// 选择类型
const selectType = (value: string) => {
  filterType.value = value;
  showTypeFilter.value = false;
};

// 选择状态
const selectStatus = (value: string) => {
  filterStatus.value = value;
  showStatusFilter.value = false;
};

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
        (item.model && item.model.toLowerCase().includes(keyword)) ||
        (item.code && item.code.toLowerCase().includes(keyword))
    );
  }
  
  return result;
});

// 获取状态文本
const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    'normal': '正常运行',
    'warning': '带病运行',
    'repairing': '维修中',
    'standby': '备用',
    'disabled': '停用',
    'scrapped': '报废'
  };
  return statusMap[status] || '未知';
};

// 获取状态类型
const getStatusType = (status: string) => {
  const typeMap: Record<string, string> = {
    'normal': 'success',
    'warning': 'warning',
    'repairing': 'primary',
    'standby': 'purple',
    'disabled': 'danger',
    'scrapped': 'default'
  };
  return typeMap[status] || 'default';
};

// 搜索设备
const onSearch = () => {
  // 已通过计算属性实现
};

// 清除搜索内容
const onClear = () => {
  searchText.value = '';
};

// 查看设备详情
const viewDetail = (id: string) => {
  router.push(`/equipment/detail/${id}`);
};

// 编辑设备
const editEquipment = (id: string) => {
  router.push(`/equipment/detail/edit/${id}`);
};

// 点检设备
const checkEquipment = (id: string) => {
  router.push(`/check/record/add?equipmentId=${id}`);
};

// 新增设备
const addEquipment = () => {
  router.push('/equipment/detail/add');
};

// 确认删除
const confirmDelete = (equipment: any) => {
  currentEquipment.value = equipment;
  showDeleteDialog.value = true;
};

// 删除设备
const deleteEquipment = async () => {
  if (!currentEquipment.value) return;
  
  try {
    // 实际项目中这里应调用API删除设备
    console.log('删除设备:', currentEquipment.value.id);
    // 此处仅做前端数据处理示例
    equipmentStore.equipmentList = equipmentStore.equipmentList.filter(
      item => item.id !== currentEquipment.value.id
    );
    showSuccessToast('设备已删除');
  } catch (error) {
    console.error('删除设备失败', error);
    showToast('删除失败');
  }
};

// 页面加载时获取设备列表
onMounted(async () => {
  try {
    await equipmentStore.fetchEquipmentList();
  } catch (error) {
    console.error('获取设备列表失败', error);
    showToast('获取设备列表失败');
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
/* 使用全局样式 */
</style> 