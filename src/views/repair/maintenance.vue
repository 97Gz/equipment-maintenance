<template>
  <div class="repair-maintenance-container">
    <nav-bar title="设备维修单" />
    
    <div class="content">
      <van-empty description="暂无维修单" />
    </div>
    
    <tab-bar />
  </div>
</template>

<script setup lang="ts">
import NavBar from '@/components/NavBar.vue';
import TabBar from '@/components/TabBar.vue';
</script>

<style scoped>
.repair-maintenance-container {
  padding-top: 46px;
  padding-bottom: 50px;
  min-height: 100vh;
  background-color: #f8fafc;
}

.content {
  padding: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 96px);
}
</style> 