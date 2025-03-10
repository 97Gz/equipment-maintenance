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
      <van-button size="small" type="primary" @click="viewDetail">查看详情</van-button>
    </template>
  </van-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';

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
</script>

<style scoped>
.van-card {
  background-color: #fff;
  border-radius: 8px;
  margin-bottom: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
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
  color: #646566;
  font-size: 13px;
}

.value {
  font-size: 13px;
  color: #323233;
}

.van-button {
  background-color: #1a56db;
  border-color: #1a56db;
}
</style> 