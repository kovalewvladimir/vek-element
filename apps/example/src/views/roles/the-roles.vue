<script setup lang="ts">
import { useCan } from 'element-plus-aa'

const can = useCan()
</script>

<template>
  <h1>The Roles</h1>

  <div>isCanRW: {{ can.isRW }}</div>
  <div>isCanRO: {{ can.isRO }}</div>
</template>
