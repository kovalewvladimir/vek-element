<script setup lang="ts">
import { ElBreadcrumb, ElBreadcrumbItem } from 'element-plus'
import { useRoute } from 'vue-router'

import { ElaIconSvgDynamic } from '../../../../components/icon-svg'

const route = useRoute()
</script>

<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/' }">Главная</el-breadcrumb-item>

    <el-breadcrumb-item
      v-for="item in route.matched"
      :key="item.path"
    >
      <ela-icon-svg-dynamic
        v-if="item.meta.icon"
        :name="item.meta.icon"
        :size="12"
      />
      {{ item.meta.title }}</el-breadcrumb-item
    >
  </el-breadcrumb>
</template>
