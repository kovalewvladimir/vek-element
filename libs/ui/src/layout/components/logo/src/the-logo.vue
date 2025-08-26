<script setup lang="ts">
import { useLayoutConfigStore } from '@vek-element/ui'
import { isNull } from '@vek-element/ui/utils'
import { VuIconSvgDynamic } from '@vek-element/ui-components'

const { isText = true, size = 64 } = defineProps<{
  isText?: boolean
  size?: number
}>()

const config = useLayoutConfigStore()
</script>

<template>
  <template v-if="config.logo.visible">
    <div class="h-full flex items-center">
      <vu-icon-svg-dynamic
        v-if="!isNull(config.logo.svg)"
        :name="config.logo.svg"
        :size="size"
      />
      <img
        v-if="!isNull(config.logo.image)"
        :src="config.logo.image"
        :alt="config.logo.title"
        :width="size"
      />

      <template v-if="isText">
        <div
          v-if="!config.menu.collapse"
          class="ml-5px"
          >{{ config.logo.title }}</div
        >
      </template>
    </div>
  </template>
</template>
