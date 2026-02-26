<template>
  <div class="app-container home">
    <!-- 子系统统计页面展示区域 -->
    <div v-if="currentClientUrl" class="statistics-wrapper">
      <div class="iframe-container">
        <iframe
          :key="currentClientUrl"
          :src="currentClientUrl"
          frameborder="0"
          width="100%"
          height="100%"
        />
      </div>
    </div>

    <!-- 未选择时的提示 -->
    <div v-else class="empty-state">
      <el-empty description="请在顶部菜单栏选择一个 IM 平台查看统计数据" />
    </div>
  </div>
</template>

<script setup name="Index" lang="ts">
import { useImClientStore } from '@/store/modules/imClient';

const imClientStore = useImClientStore();

// 当前平台的统计页面 URL
const currentClientUrl = computed(() => imClientStore.currentClientUrl);
</script>

<style lang="scss" scoped>
.home {
  height: calc(100vh - 120px);
  overflow: hidden;

  .statistics-wrapper {
    height: 100%;
    padding-top: 10px;

    .iframe-container {
      width: 100%;
      height: 100%;
      background: #fff;
      border-radius: 4px;
      overflow: hidden;

      iframe {
        display: block;
        width: 100%;
        height: 100%;
      }
    }
  }

  .empty-state {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
}
</style>
