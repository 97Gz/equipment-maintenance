<template>
  <van-nav-bar
    :title="title"
    :left-text="showBack ? '返回' : ''"
    :left-arrow="showBack"
    :right-text="rightText"
    :fixed="fixed"
    @click-left="onClickLeft"
    @click-right="onClickRight"
  />
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

// 组件属性
interface Props {
  title?: string;
  showBack?: boolean;
  rightText?: string;
  fixed?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  showBack: true,
  rightText: '',
  fixed: true
});

// 事件
const emit = defineEmits(['click-right']);

// 返回上一页
const onClickLeft = () => {
  if (props.showBack) {
    router.back();
  }
};

// 右侧按钮点击事件
const onClickRight = () => {
  emit('click-right');
};
</script>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'NavBar'
});
</script>

<style scoped>
.van-nav-bar {
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.van-nav-bar :deep(.van-nav-bar__title) {
  color: #1a56db;
  font-weight: 600;
}

.van-nav-bar :deep(.van-icon),
.van-nav-bar :deep(.van-nav-bar__text) {
  color: #1a56db;
}
</style> 