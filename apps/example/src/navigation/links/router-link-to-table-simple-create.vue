<script setup lang="ts">
import { useNavigationStore } from '@vek-element/ui'
import { ElButton } from 'element-plus'
import { RouterLink } from 'vue-router'

const navigation = useNavigationStore()
const link = navigation.getFullPathByName('TableSimpleCreate')
</script>

<template>
  <router-link
    v-if="link"
    :to="link"
    ><slot><el-button type="success">Добавить</el-button></slot></router-link
  >
</template>
