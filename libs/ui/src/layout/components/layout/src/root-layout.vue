<script setup lang="ts">
import { TheLoading } from '@vek-element/ui/layout'
import { ElConfigProvider } from 'element-plus'
import ru from 'element-plus/es/locale/lang/ru'
import { RouterView } from 'vue-router'

const LOCALE = ru
const SIZE = 'small'
</script>

<template>
  <el-config-provider
    :locale="LOCALE"
    :size="SIZE"
  >
    <router-view v-slot="{ Component }">
      <template v-if="Component">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </template>
      <template v-else>
        <the-loading />
      </template>
    </router-view>
  </el-config-provider>
</template>
