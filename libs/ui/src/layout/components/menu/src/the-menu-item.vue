<script setup lang="ts">
import { type IMenuItem } from '@vek-element/ui'
import { VuIconSvgDynamic } from '@vek-element/ui-components'
import { ElMenuItem, ElSubMenu } from 'element-plus'
import { useRouter } from 'vue-router'

const { menuItem } = defineProps<{
  menuItem: IMenuItem
}>()

const router = useRouter()

const menuItemClk = async () => {
  if (!menuItem.fullPath) return
  await router.push(menuItem.fullPath)
}
</script>

<template>
  <template v-if="!menuItem.hidden">
    <template v-if="menuItem.children">
      <el-sub-menu :index="menuItem.name">
        <template #title>
          <vu-icon-svg-dynamic
            v-if="menuItem.icon"
            :name="menuItem.icon"
          />
          <span>{{ menuItem.title }}</span>
        </template>
        <the-menu-item
          v-for="(item, index) in menuItem.children"
          :key="index"
          :menu-item="item"
        />
      </el-sub-menu>
    </template>

    <template v-else>
      <el-menu-item
        :index="menuItem.name"
        @click="menuItemClk"
      >
        <vu-icon-svg-dynamic
          v-if="menuItem.icon"
          :name="menuItem.icon"
        />
        <span>{{ menuItem.title }}</span>
      </el-menu-item>
    </template>
  </template>
  <template v-else>
    <template v-if="menuItem.children">
      <the-menu-item
        v-for="(item, index) in menuItem.children"
        :key="index"
        :menu-item="item"
      />
    </template>
  </template>
</template>
