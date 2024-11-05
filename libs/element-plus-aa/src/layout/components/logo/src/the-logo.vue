<script setup lang="ts">
import { isNull } from '../../../../utils'
import { layoutConfigStore as config } from '../../../stores/layoutConfigStore'
</script>

<template>
  <template v-if="config.logo.visible">
    <img
      v-if="!isNull(config.logo.img)"
      :src="config.logo.img"
      alt="Logo"
    />

    <div>{{ config.logo.title }}</div>
  </template>
</template>
