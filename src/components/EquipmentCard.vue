<template>
  <van-card
    :thumb="equipment.image"
    :title="equipment.name"
    :tag="getStatusTag(equipment.status)"
    :price="null"
  >
    <template #desc>
      <div class="equipment-info">
        <div class="info-item">
          <span class="label">设备类型：</span>
          <span class="value">{{ equipment.type }}</span>
        </div>
        <div class="info-item">
          <span class="label">规格型号：</span>
          <span class="value">{{ equipment.model }}</span>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="card-footer">
        <van-button size="small" type="primary" @click="viewDetail">查看详情</van-button>
        <div class="action-buttons">
          <van-button size="small" plain @click="editEquipment">编辑</van-button>
          <van-button size="small" type="success" plain @click="checkEquipment">点检</van-button>
          <van-button size="small" type="danger" plain @click="confirmDelete">删除</van-button>
        </div>
      </div>
    </template>
  </van-card>
  
  <!-- 删除确认对话框 -->
  <van-dialog
    v-model:show="showDeleteDialog"
    title="删除设备"
    show-cancel-button
    @confirm="deleteEquipment"
  >
    <div class="dialog-content">
      确定要删除【{{ equipment.name }}】吗？此操作不可恢复。
    </div>
  </van-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { showToast, showSuccessToast } from 'vant';

// 设备状态类型
type EquipmentStatus = 'normal' | 'fault' | 'maintenance' | 'scrapped';

// 设备信息接口
interface EquipmentInfo {
  id: string;
  type: string;
  name: string;
  status: EquipmentStatus;
  model: string;
  image: string;
}

// 组件属性
interface Props {
  equipment: EquipmentInfo;
}

const props = defineProps<Props>();
const router = useRouter();
const showDeleteDialog = ref(false);

// 定义事件
const emit = defineEmits(['delete']);

// 根据状态获取标签文本和颜色
const getStatusTag = (status: EquipmentStatus) => {
  switch (status) {
    case 'normal':
      return '正常';
    case 'fault':
      return '故障';
    case 'maintenance':
      return '维修中';
    case 'scrapped':
      return '已报废';
    default:
      return '';
  }
};

// 查看详情
const viewDetail = () => {
  router.push(`/equipment/detail/${props.equipment.id}`);
};

// 编辑设备
const editEquipment = () => {
  router.push(`/equipment/edit/${props.equipment.id}`);
};

// 设备点检
const checkEquipment = () => {
  router.push(`/equipment/check/${props.equipment.id}`);
};

// 显示删除确认框
const confirmDelete = () => {
  showDeleteDialog.value = true;
};

// 删除设备
const deleteEquipment = () => {
  // 这里实际应该调用API删除设备
  emit('delete', props.equipment.id);
  showSuccessToast('设备已删除');
};
</script>

<style scoped>
.van-card {
  background-color: var(--card-background);
  border-radius: 8px;
  margin-bottom: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.equipment-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 8px;
}

.info-item {
  display: flex;
  align-items: center;
}

.label {
  color: var(--text-color-secondary);
  font-size: 13px;
}

.value {
  font-size: 13px;
  color: var(--text-color);
}

.card-footer {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.dialog-content {
  padding: 20px;
  text-align: center;
}

/* 调整按钮样式 */
:deep(.van-button) {
  height: 28px;
  padding: 0 10px;
  font-size: 12px;
}

:deep(.van-button--primary) {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}

:deep(.van-button--danger) {
  color: var(--danger-color);
  border-color: var(--danger-color);
}

:deep(.van-button--success) {
  color: var(--success-color);
  border-color: var(--success-color);
}
</style> 