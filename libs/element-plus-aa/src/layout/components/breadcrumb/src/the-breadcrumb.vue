<script setup lang="ts">
import { ElBreadcrumb, ElBreadcrumbItem } from 'element-plus'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { ElaIconSvgDynamic } from '../../../../components/icon-svg'

const route = useRoute()

const matchedRoutes = computed(() => route.matched.filter((item) => item.meta.breadcrumb))
</script>

<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/' }">Главная</el-breadcrumb-item>

    <el-breadcrumb-item
      v-for="item in matchedRoutes"
      :key="item.path"
    >
      <ela-icon-svg-dynamic
        v-if="item.meta.icon"
        :name="item.meta.icon"
        :size="12"
      />
      <span>{{ item.meta.title }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>
