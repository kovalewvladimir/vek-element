<script setup lang="ts">
import { layoutConfigStore as config } from '~/layout/stores/layoutConfigStore'
import { isNull } from '~/utils'
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
