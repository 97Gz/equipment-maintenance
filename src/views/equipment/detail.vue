<template>
  <div class="equipment-detail">
    <nav-bar :title="equipment?.name || '设备详情'" />
    
    <div class="content" v-if="equipment">
      <!-- 设备基本信息 -->
      <div class="basic-info">
        <div class="equipment-image">
          <van-image
            :src="equipment.image"
            width="100"
            height="100"
            radius="8"
            fit="cover"
          />
        </div>
        <div class="info-content">
          <div class="info-header">
            <h2 class="equipment-name">{{ equipment.name }}</h2>
            <van-tag :type="getStatusType(equipment.status)" size="medium">
              {{ getStatusText(equipment.status) }}
            </van-tag>
          </div>
          
          <div class="info-list">
            <div class="info-item">
              <span class="label">设备类型：</span>
              <span class="value">{{ equipment.type }}</span>
            </div>
            <div class="info-item">
              <span class="label">规格型号：</span>
              <span class="value">{{ equipment.model }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 详情折叠面板 -->
      <van-collapse v-model="activeNames" accordion>
        <!-- 设备信息 -->
        <van-collapse-item title="设备信息" name="1">
          <van-cell-group inset>
            <van-cell title="使用车间" :value="equipment.workshop" />
            <van-cell title="安装地点" :value="equipment.location" />
            <van-cell title="设备负责人" :value="equipment.manager" />
            <van-cell title="负责人联系方式" :value="equipment.managerContact" />
            <van-cell title="生产厂商" :value="equipment.manufacturer" />
            <van-cell title="购买日期" :value="equipment.purchaseDate" />
            <van-cell title="供应商编码" :value="equipment.supplier.code" />
            <van-cell title="供应商名称" :value="equipment.supplier.name" />
            <van-cell title="启用日期" :value="equipment.enableDate" />
          </van-cell-group>
        </van-collapse-item>
        
        <!-- 设备点检 -->
        <van-collapse-item title="设备点检" name="2">
          <van-cell-group inset>
            <van-cell title="点检标准名称" :value="equipment.checkInfo.standardName" />
            <van-cell title="点检标准编码" :value="equipment.checkInfo.standardCode" />
            <van-cell title="最近点检时间" :value="equipment.checkInfo.lastCheckTime" />
          </van-cell-group>
        </van-collapse-item>
        
        <!-- 设备巡检 -->
        <van-collapse-item title="设备巡检" name="3">
          <van-cell-group inset>
            <van-cell title="巡检方案名称" :value="equipment.patrolInfo.planName" />
            <van-cell title="巡检方案编码" :value="equipment.patrolInfo.planCode" />
            <van-cell title="规定巡检日期" :value="equipment.patrolInfo.scheduledDate" />
            <van-cell title="最近巡检时间" :value="equipment.patrolInfo.lastPatrolTime" />
            <van-cell title="当天规定巡检次数" :value="equipment.patrolInfo.dailyCount.toString()" />
          </van-cell-group>
        </van-collapse-item>
        
        <!-- 报修维修 -->
        <van-collapse-item title="报修维修" name="4">
          <van-cell-group inset>
            <van-cell title="最近维修日期" :value="equipment.repairInfo.lastRepairTime || '暂无记录'" />
          </van-cell-group>
        </van-collapse-item>
        
        <!-- 维护保养 -->
        <van-collapse-item title="维护保养" name="5">
          <van-cell-group inset>
            <van-cell title="最近保养日期" :value="equipment.maintenanceInfo.lastMaintenanceTime || '暂无记录'" />
          </van-cell-group>
        </van-collapse-item>
        
        <!-- 设备报废 -->
        <van-collapse-item title="设备报废" name="6">
          <van-cell-group inset>
            <van-cell title="报废时间" :value="equipment.scrapInfo.scrapTime || '未报废'" />
          </van-cell-group>
        </van-collapse-item>
      </van-collapse>
    </div>
    
    <!-- 加载状态 -->
    <div class="loading-container" v-else>
      <van-loading type="spinner" color="#1a56db" size="36" />
      <p class="loading-text">加载设备信息...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useEquipmentStore } from '@/store/equipment';
import { showToast } from 'vant';
import NavBar from '@/components/NavBar.vue';
import { Equipment } from '@/store/equipment';

const route = useRoute();
const router = useRouter();
const equipmentStore = useEquipmentStore();
const activeNames = ref(['1']); // 默认打开第一个折叠面板

// 获取设备详情
const equipment = computed(() => equipmentStore.getCurrentEquipment);

// 获取设备状态文本
const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    normal: '正常',
    fault: '故障',
    maintenance: '维修中',
    scrapped: '已报废'
  };
  return statusMap[status] || '未知';
};

// 获取设备状态类型
const getStatusType = (status: string) => {
  const typeMap: Record<string, string> = {
    normal: 'success',
    fault: 'danger',
    maintenance: 'warning',
    scrapped: 'default'
  };
  return typeMap[status] || 'default';
};

// 页面加载时获取设备详情
onMounted(async () => {
  const id = route.params.id as string;
  if (!id) {
    showToast('设备ID不能为空');
    router.back();
    return;
  }
  
  try {
    await equipmentStore.fetchEquipmentDetail(id);
    if (!equipment.value) {
      showToast('设备不存在');
      router.back();
    }
  } catch (error) {
    console.error('获取设备详情失败', error);
    showToast('获取设备详情失败');
    router.back();
  }
});
</script>

<style scoped>
.equipment-detail {
  padding-top: 46px;
  min-height: 100vh;
  background-color: #f8fafc;
}

.content {
  padding: 16px;
  padding-bottom: 20px;
}

.basic-info {
  display: flex;
  padding: 16px;
  background-color: #fff;
  margin-bottom: 12px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.equipment-image {
  margin-right: 16px;
}

.info-content {
  flex: 1;
}

.info-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.equipment-name {
  font-size: 18px;
  font-weight: 600;
  color: #1a56db;
  margin: 0;
  margin-right: 12px;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-item {
  display: flex;
  font-size: 14px;
}

.label {
  color: #64748b;
  min-width: 80px;
}

.value {
  color: #334155;
  font-weight: 500;
}

:deep(.van-collapse) {
  margin-bottom: 16px;
  background-color: transparent;
  border-radius: 8px;
  overflow: hidden;
}

:deep(.van-collapse-item) {
  margin-bottom: 8px;
  border-radius: 8px;
  overflow: hidden;
}

:deep(.van-collapse-item__title) {
  font-weight: 500;
  color: #1a56db;
  background-color: #fff;
  padding: 12px 16px;
}

:deep(.van-cell-group) {
  margin-bottom: 12px;
}

:deep(.van-cell__title) {
  color: #64748b;
  font-size: 14px;
}

:deep(.van-cell__value) {
  color: #334155;
  font-weight: 500;
  font-size: 14px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 46px);
}

.loading-text {
  margin-top: 12px;
  color: #64748b;
  font-size: 14px;
}
</style> 