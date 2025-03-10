<script setup lang="ts">
// 主应用组件
</script>

<template>
  <router-view />
</template>

<style>
body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f8fafc;
  color: #334155;
}

* {
  box-sizing: border-box;
}

:root {
  --van-primary-color: #1a56db;
  --van-success-color: #10b981;
  --van-danger-color: #ef4444;
  --van-warning-color: #f59e0b;
}
</style>
