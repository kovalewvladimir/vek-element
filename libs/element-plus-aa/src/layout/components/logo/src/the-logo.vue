<script setup lang="ts">
import IconSvgDynamic from '../../../../components/icon-svg/src/icon-svg-dynamic.vue'
import { isNull } from '../../../../utils'
import { useLayoutConfigStore } from '../../../stores/layoutConfigStore'

const config = useLayoutConfigStore()
</script>

<template>
  <template v-if="config.logo.visible">
    <div class="h-full color-white flex items-center">
      <icon-svg-dynamic
        v-if="!isNull(config.logo.svg)"
        :name="config.logo.svg"
        :size="64"
      />

      <div v-if="!config.menu.collapse">{{ config.logo.title }}</div>
    </div>
  </template>
</template>
