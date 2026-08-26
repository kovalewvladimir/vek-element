<script setup lang="ts">
import { useNavigationProgress } from '@vek-element/ui'

const { isNavigating } = useNavigationProgress()
</script>

<template>
  <div
    v-if="isNavigating"
    class="progress"
    role="progressbar"
    aria-label="Загрузка страницы"
  ></div>
</template>

<style scoped>
.progress {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 2000;

  height: 2px;
  overflow: hidden;

  background-color: var(--el-color-primary-light-8);
}

.progress::before {
  content: '';

  position: absolute;
  top: 0;
  bottom: 0;
  width: 40%;

  background-color: var(--el-color-primary);

  animation: navigation-progress 1s ease-in-out infinite;
}

@keyframes navigation-progress {
  from {
    left: -40%;
  }
  to {
    left: 100%;
  }
}
</style>
