<script setup lang="ts">
import {
  AntDesignMenuFoldOutlined,
  AntDesignMenuUnfoldOutlined,
  EpCloseIcon,
  VuContentWrap,
  VuIconSvgSlot
} from '@vek-element/ui'
import { ElDivider, ElMessage, ElTag } from 'element-plus'
import { ref } from 'vue'

const sizes: number[] = [16, 24, 32, 48, 64]

const collapse = ref(false)
const clickCount = ref(0)

const onClick = () => {
  clickCount.value++
  ElMessage.success('Клик по иконке')
}
</script>

<template>
  <vu-content-wrap>
    <template #header>
      <h2>vu-icon-svg-slot</h2>
    </template>

    <p>
      В отличие от <code>vu-icon-svg-dynamic</code> (ищет спрайт по имени), здесь svg передаётся
      слотом. Удобно для иконок, поставляемых самой библиотекой, и для инлайн-svg.
    </p>

    <el-divider content-position="left">Иконки из @vek-element/ui</el-divider>
    <div class="flex items-center gap-20px">
      <vu-icon-svg-slot><ant-design-menu-fold-outlined /></vu-icon-svg-slot>
      <vu-icon-svg-slot><ant-design-menu-unfold-outlined /></vu-icon-svg-slot>
      <vu-icon-svg-slot><ep-close-icon /></vu-icon-svg-slot>
    </div>

    <el-divider content-position="left">Аттрибут size</el-divider>
    <div class="flex items-center gap-20px">
      <vu-icon-svg-slot
        v-for="size in sizes"
        :key="size"
        :size="size"
      >
        <ant-design-menu-fold-outlined />
      </vu-icon-svg-slot>
    </div>

    <el-divider content-position="left">Аттрибуты color и hover-color</el-divider>
    <div class="flex items-center gap-20px">
      <vu-icon-svg-slot color="red"><ep-close-icon /></vu-icon-svg-slot>
      <vu-icon-svg-slot
        color="red"
        hover-color="green"
      >
        <ep-close-icon />
      </vu-icon-svg-slot>
      <vu-icon-svg-slot
        color="#409eff"
        hover-color="#f56c6c"
      >
        <ant-design-menu-fold-outlined />
      </vu-icon-svg-slot>
    </div>

    <el-divider content-position="left">Инлайн svg в слоте</el-divider>
    <div class="flex items-center gap-20px">
      <vu-icon-svg-slot
        :size="40"
        color="var(--el-color-primary)"
        hover-color="var(--el-color-warning)"
      >
        <svg viewBox="0 0 1024 1024">
          <path
            fill="currentColor"
            d="M512 64a448 448 0 1 1 0 896a448 448 0 0 1 0-896m0 832a384 384 0 0 0 0-768a384 384 0 0 0 0 768m48-176a48 48 0 1 1-96 0a48 48 0 0 1 96 0m-48-464a32 32 0 0 1 32 32v288a32 32 0 1 1-64 0V288a32 32 0 0 1 32-32"
          />
        </svg>
      </vu-icon-svg-slot>
    </div>

    <el-divider content-position="left">Событие click</el-divider>
    <div class="flex items-center gap-20px">
      <vu-icon-svg-slot
        :size="28"
        hover-color="var(--el-color-primary)"
        class="cursor-pointer"
        @click="collapse = !collapse"
      >
        <ant-design-menu-unfold-outlined v-if="collapse" />
        <ant-design-menu-fold-outlined v-else />
      </vu-icon-svg-slot>

      <vu-icon-svg-slot
        :size="28"
        hover-color="var(--el-color-danger)"
        class="cursor-pointer"
        @click="onClick"
      >
        <ep-close-icon />
      </vu-icon-svg-slot>

      <el-tag>collapse: {{ collapse }}</el-tag>
      <el-tag type="info">Кликов: {{ clickCount }}</el-tag>
    </div>
  </vu-content-wrap>
</template>
