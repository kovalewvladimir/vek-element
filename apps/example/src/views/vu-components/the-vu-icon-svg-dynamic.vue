<script setup lang="ts">
import { VuContentWrap, VuIconSvgDynamic } from '@vek-element/ui'
import { ElDivider } from 'element-plus'

const icons: string[] = ['el-icon-menu', 'el-logo', 'ep--close']

const sizes: number[] = [16, 24, 32, 48, 64]
</script>

<template>
  <vu-content-wrap>
    <template #header>
      <h2>vu-icon-svg-dynamic</h2>
    </template>

    <el-divider content-position="left">Разные иконки</el-divider>
    <div class="flex items-center gap-20px">
      <vu-icon-svg-dynamic
        v-for="icon in icons"
        :key="icon"
        :name="icon"
      />
    </div>

    <el-divider content-position="left">Аттрибут size</el-divider>
    <div class="flex items-center gap-20px">
      <vu-icon-svg-dynamic
        v-for="size in sizes"
        :key="size"
        name="el-icon-menu"
        :size="size"
      />
    </div>

    <el-divider content-position="left">Аттрибуты color и hover-color</el-divider>
    <div class="flex items-center gap-20px">
      <vu-icon-svg-dynamic
        name="ep--close"
        color="red"
        hover-color="green"
      />
      <vu-icon-svg-dynamic
        name="el-icon-menu"
        color="#409eff"
        hover-color="#f56c6c"
      />
    </div>
  </vu-content-wrap>
</template>
