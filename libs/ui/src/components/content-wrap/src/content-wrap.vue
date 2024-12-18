<template>
  <div class="vu-content-wrap">
    <div
      v-if="$slots.header"
      class="vu-content-wrap__header"
    >
      <slot name="header" />
    </div>
    <div class="vu-content-wrap__content">
      <slot />
    </div>
  </div>
</template>

<style>
.vu-content-wrap {
  display: flex;
  flex-direction: column;
  height: 100%;

  border-radius: 3px;
  border: 1px solid var(--el-border-color-light);
  background-color: var(--el-fill-color-blank);
  overflow: hidden;
  color: var(--el-text-color-primary);
  transition: var(--el-transition-duration);
}

.vu-content-wrap__header {
  padding: 10px;
  border-bottom: 1px solid var(--el-border-color-light);
}

.vu-content-wrap__content {
  flex: 1;
  overflow: auto;
  padding: 10px;
}
</style>
