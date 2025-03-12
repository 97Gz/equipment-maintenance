<template>
  <div class="patrol-plan-container">
    <nav-bar title="巡检方案" />
    
    <div class="content">
      <!-- 搜索区域 -->
      <div class="filter-area">
        <van-search
          v-model="searchText"
          placeholder="搜索巡检方案名称"
          shape="round"
          @search="onSearch"
          @clear="onClear"
        />
      </div>
      
      <!-- 巡检方案列表 -->
      <div class="plan-list">
        <template v-if="loading">
          <van-skeleton title :row="3" v-for="i in 3" :key="i" />
        </template>
        
        <template v-else-if="filteredPlans.length">
          <div class="plan-card" v-for="plan in filteredPlans" :key="plan.id">
            <div class="card-header">
              <div class="card-title">{{ plan.name }}</div>
              <van-tag type="primary">
                {{ getFrequencyTypeText(plan.frequencyType) }}
              </van-tag>
            </div>
            <div class="card-content">
              <div class="info-row">
                <div class="info-item">
                  <van-icon name="clock-o" />
                  <span>首次巡检: {{ plan.firstTime }}</span>
                </div>
                <div class="info-item">
                  <van-icon name="replay" />
                  <span>下次巡检: {{ plan.nextTime }}</span>
                </div>
              </div>
              <div class="info-row">
                <div class="info-item">
                  <van-icon name="description" />
                  <span>巡检项: {{ plan.items?.length || 0 }}项</span>
                </div>
                <div class="info-item">
                  <van-icon name="underway-o" />
                  <span>
                    {{ getFrequencyDetailText(plan) }}
                  </span>
                </div>
              </div>
            </div>
            <div class="card-footer">
              <div class="button-group">
                <van-button size="small" type="primary" @click="viewDetail(plan.id)">查看</van-button>
                <van-button size="small" plain @click="editPlan(plan.id)">编辑</van-button>
                <van-button size="small" type="success" plain @click="createPatrol(plan)">生成巡检单</van-button>
                <van-button size="small" type="danger" plain @click="confirmDelete(plan)">删除</van-button>
              </div>
            </div>
          </div>
        </template>
        
        <template v-else>
          <van-empty description="暂无巡检方案" />
        </template>
      </div>
    </div>
    
    <!-- 删除确认对话框 -->
    <van-dialog
      v-model:show="showDeleteDialog"
      title="删除巡检方案"
      show-cancel-button
      @confirm="deletePlan"
    >
      <div class="dialog-content">
        确定要删除此巡检方案吗？此操作不可恢复。
      </div>
    </van-dialog>
    
    <!-- 生成巡检单对话框 -->
    <van-dialog
      v-model:show="showCreateDialog"
      title="生成巡检单"
      show-cancel-button
      @confirm="confirmCreate"
    >
      <div class="patrol-create-form">
        <van-field
          v-model="createForm.equipmentId"
          label="设备"
          placeholder="请选择设备"
          readonly
          is-link
          @click="showEquipmentPopup = true"
          :rules="[{ required: true, message: '请选择设备' }]"
        />
      </div>
    </van-dialog>
    
    <!-- 设备选择弹窗 -->
    <van-popup v-model:show="showEquipmentPopup" position="bottom" :style="{ height: '60%' }">
      <div class="popup-header">
        <div class="popup-title">选择设备</div>
        <van-icon name="cross" @click="showEquipmentPopup = false" />
      </div>
      <div class="popup-content">
        <van-search
          v-model="equipmentSearchText"
          placeholder="搜索设备名称/编码"
          @input="filterEquipmentList"
        />
        <van-radio-group v-model="selectedEquipmentId">
          <van-cell-group>
            <van-cell v-for="equipment in filteredEquipmentList" :key="equipment.id" clickable @click="selectEquipment(equipment)">
              <template #title>
                <div class="equipment-title">{{ equipment.name }}</div>
                <div class="equipment-desc">{{ equipment.type }} | {{ equipment.workshop }}</div>
              </template>
              <template #right-icon>
                <van-radio :name="equipment.id" />
              </template>
            </van-cell>
          </van-cell-group>
        </van-radio-group>
      </div>
    </van-popup>
    
    <!-- 固定在底部的添加按钮 -->
    <div class="fixed-bottom">
      <van-button 
        type="primary" 
        block 
        @click="addPlan"
        icon="plus"
      >新增巡检方案</van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { showToast, showSuccessToast } from 'vant';
import NavBar from '@/components/NavBar.vue';
import { usePatrolStore } from '@/store/patrol';
import { useEquipmentStore } from '@/store/equipment';
import type { PatrolPlan } from '@/utils/mock/patrol';
import type { Equipment } from '@/store/equipment';

const router = useRouter();
const patrolStore = usePatrolStore();
const equipmentStore = useEquipmentStore();
const loading = ref(true);
const searchText = ref('');

// 当前选中的方案
const currentPlan = ref<PatrolPlan | null>(null);

// 对话框控制
const showDeleteDialog = ref(false);
const showCreateDialog = ref(false);
const showEquipmentPopup = ref(false);

// 设备选择相关
const equipmentSearchText = ref('');
const selectedEquipmentId = ref('');
const filteredEquipmentList = ref<Equipment[]>([]);

// 生成巡检单表单
const createForm = ref({
  equipmentId: '',
  equipmentName: '',
  planId: ''
});

// 根据搜索文本筛选的巡检方案列表
const filteredPlans = computed(() => {
  if (!patrolStore.getPlanList) return [];
  
  let plans = patrolStore.getPlanList;
  
  // 应用搜索文本筛选
  if (searchText.value) {
    const keyword = searchText.value.toLowerCase();
    plans = plans.filter(
      item => item.name.toLowerCase().includes(keyword)
    );
  }
  
  return plans;
});

// 获取频率类型文本
const getFrequencyTypeText = (type: string) => {
  const typeMap: Record<string, string> = {
    'interval': '固定间隔',
    'weekly': '每周几',
    'monthly': '每月几号'
  };
  return typeMap[type] || '未知';
};

// 获取频率详细文本
const getFrequencyDetailText = (plan: PatrolPlan) => {
  if (plan.frequencyType === 'interval' && plan.intervalDays !== undefined) {
    return `每${plan.intervalDays}天`;
  } else if (plan.frequencyType === 'weekly' && plan.weekDay !== undefined) {
    const weekDayMap = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return weekDayMap[plan.weekDay];
  } else if (plan.frequencyType === 'monthly' && plan.monthDay !== undefined) {
    return `每月${plan.monthDay}号`;
  }
  return '';
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
  router.push(`/patrol/plan/${id}`);
};

// 编辑方案
const editPlan = (id: string) => {
  router.push(`/patrol/plan/edit/${id}`);
};

// 添加方案
const addPlan = () => {
  router.push('/patrol/plan/add');
};

// 确认删除
const confirmDelete = (plan: PatrolPlan) => {
  currentPlan.value = plan;
  showDeleteDialog.value = true;
};

// 删除方案
const deletePlan = async () => {
  if (!currentPlan.value) return;
  
  try {
    await patrolStore.deletePlan(currentPlan.value.id);
    showSuccessToast('删除成功');
    await patrolStore.fetchPlanList();
  } catch (error) {
    console.error('删除巡检方案失败', error);
  }
};

// 生成巡检单
const createPatrol = (plan: PatrolPlan) => {
  currentPlan.value = plan;
  createForm.value.planId = plan.id;
  showCreateDialog.value = true;
};

// 确认生成巡检单
const confirmCreate = async () => {
  if (!currentPlan.value || !createForm.value.equipmentId) {
    showToast('请选择设备');
    return;
  }
  
  try {
    // 这里简化处理，直接跳转到巡检单新增页面，并传递设备ID和方案ID
    router.push({
      path: '/patrol/add',
      query: {
        equipmentId: createForm.value.equipmentId,
        planId: createForm.value.planId
      }
    });
  } catch (error) {
    console.error('生成巡检单失败', error);
    showToast('生成巡检单失败');
  }
};

// 过滤设备列表
const filterEquipmentList = () => {
  if (!equipmentStore.getEquipmentList) return;
  
  const equipmentList = equipmentStore.getEquipmentList;
  if (!equipmentSearchText.value) {
    filteredEquipmentList.value = equipmentList;
    return;
  }
  
  const keyword = equipmentSearchText.value.toLowerCase();
  filteredEquipmentList.value = equipmentList.filter(
    item => 
      item.name.toLowerCase().includes(keyword) || 
      item.code.toLowerCase().includes(keyword)
  );
};

// 选择设备
const selectEquipment = (equipment: Equipment) => {
  selectedEquipmentId.value = equipment.id;
  createForm.value.equipmentId = equipment.id;
  createForm.value.equipmentName = equipment.name;
  showEquipmentPopup.value = false;
};

// 初始化
onMounted(async () => {
  try {
    await patrolStore.fetchPlanList();
    await equipmentStore.fetchEquipmentList();
    filteredEquipmentList.value = equipmentStore.getEquipmentList || [];
  } catch (error) {
    console.error('获取数据失败', error);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.patrol-plan-container {
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


.plan-list {
  padding: 12px;
}

.plan-card {
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
  color: var(--van-gray-7);
}

.info-item .van-icon {
  margin-right: 4px;
  font-size: 16px;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
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

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid var(--van-gray-3);
}

.popup-title {
  font-size: 18px;
  font-weight: bold;
}

.popup-content {
  padding: 0 0 16px;
  height: calc(100% - 56px);
  overflow-y: auto;
}

.equipment-title {
  font-weight: bold;
}

.equipment-desc {
  font-size: 12px;
  color: var(--van-gray-6);
  margin-top: 4px;
}

.patrol-create-form {
  padding: 16px;
}
</style> 