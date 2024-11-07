<script setup lang="ts">
import IconSvgDynamic from '../../../../components/icon-svg/src/icon-svg-dynamic.vue'
import { isNull } from '../../../../utils'
import { useLayoutConfigStore } from '../../../stores/layoutConfigStore'

const config = useLayoutConfigStore()
</script>

<template>
  <template v-if="config.logo.visible">
    <icon-svg-dynamic
      v-if="!isNull(config.logo.svg)"
      :name="config.logo.svg"
    />

    <div>{{ config.logo.title }}</div>
  </template>
</template>
