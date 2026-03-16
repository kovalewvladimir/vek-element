<script setup lang="ts">
import { useNavigationStore } from '@vek-element/ui'
import { ElLink } from 'element-plus'
import { RouterLink } from 'vue-router'

const { id } = defineProps<{ id: number }>()

const navigation = useNavigationStore()
const routePath = navigation.getFullPathByName('TableSimpleUpdate')
const link = routePath?.replaceAll(/:id[^/]*/g, String(id))
</script>

<template>
  <router-link
    v-if="link"
    :to="link"
    ><slot
      ><el-link
        type="primary"
        style="font-size: 12px"
        >{{ id }}</el-link
      ></slot
    ></router-link
  >
  <template v-else>{{ id }}</template>
</template>
