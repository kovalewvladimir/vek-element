<script setup lang="ts">
import { VuButtonIcon, type VuButtonIconType, VuContentWrap } from '@vek-element/ui'
import { ElDivider } from 'element-plus'

const icons: string[] = ['el-icon-menu', 'el-logo', 'ep--close']

const types: VuButtonIconType[] = ['default', 'success', 'warning', 'info', 'primary', 'danger']
</script>

<template>
  <vu-content-wrap>
    <template #header>
      <h2>vu-button-icon</h2>
    </template>

    <el-divider content-position="left">Аттрибут tooltip</el-divider>
    <div
      v-for="icon in icons"
      :key="icon"
      class="mb-10px"
    >
      <vu-button-icon
        v-for="type in types"
        :key="type"
        :type="type"
        :icon="icon"
        :tooltip="`Type: ${type}, Icon: ${icon}`"
      />
    </div>

    <el-divider content-position="left">Аттрибут link</el-divider>
    <div
      v-for="icon in icons"
      :key="icon"
      class="mb-10px"
    >
      <vu-button-icon
        v-for="type in types"
        :key="type"
        link
        :type="type"
        :icon="icon"
        :tooltip="`Type: ${type}, Icon: ${icon}`"
      />
    </div>

    <el-divider content-position="left">С текстом</el-divider>
    <div
      v-for="icon in icons"
      :key="icon"
      class="mb-10px"
    >
      <vu-button-icon
        v-for="type in types"
        :key="type"
        :type="type"
        :icon="icon"
        :tooltip="`Type: ${type}, Icon: ${icon}`"
        >{{ type }}</vu-button-icon
      >
    </div>
  </vu-content-wrap>
</template>
