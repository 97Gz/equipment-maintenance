<template>
  <div class="initiated-container">
    <nav-bar title="我发起的" />
    
    <div class="content">
      <van-empty description="暂无发起的事项" />
    </div>
    
    <tab-bar />
  </div>
</template>

<script setup lang="ts">
import NavBar from '@/components/NavBar.vue';
import TabBar from '@/components/TabBar.vue';
</script>

<style scoped>
.initiated-container {
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