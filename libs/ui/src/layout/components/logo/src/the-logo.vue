<script setup lang="ts">
import { useLayoutConfigStore, VuIconSvgDynamic } from '@vek-element/ui'
import { isNull } from '@vek-element/ui/utils'

const config = useLayoutConfigStore()
</script>

<template>
  <template v-if="config.logo.visible">
    <div class="h-full color-white flex items-center">
      <vu-icon-svg-dynamic
        v-if="!isNull(config.logo.svg)"
        :name="config.logo.svg"
        :size="64"
      />

      <div v-if="!config.menu.collapse">{{ config.logo.title }}</div>
    </div>
  </template>
</template>
