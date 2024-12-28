<script setup lang="ts">
import { VuIconSvgDynamic } from '@vek-element/ui'
import { ElBreadcrumb, ElBreadcrumbItem } from 'element-plus'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

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
      <div class="flex justify-center">
        <vu-icon-svg-dynamic
          v-if="item.meta.icon"
          :name="item.meta.icon"
          :size="14"
          class="mr-3px"
        />
        <span>{{ item.meta.title }}</span>
      </div>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>
