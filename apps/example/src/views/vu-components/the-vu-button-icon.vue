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

    <div class="flex gap-5">
      <div class="flex-1">
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
      </div>

      <div class="flex-1">
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
            >{{ type }}</vu-button-icon
          >
        </div>
      </div>
    </div>

    <div class="flex gap-5">
      <div class="flex-1">
        <el-divider content-position="left">Аттрибут text</el-divider>
        <div
          v-for="icon in icons"
          :key="icon"
          class="mb-10px"
        >
          <vu-button-icon
            v-for="type in types"
            :key="type"
            text
            :type="type"
            :icon="icon"
          />
        </div>
      </div>

      <div class="flex-1">
        <el-divider content-position="left">Аттрибут text bg</el-divider>
        <div
          v-for="icon in icons"
          :key="icon"
          class="mb-10px"
        >
          <vu-button-icon
            v-for="type in types"
            :key="type"
            text
            bg
            :type="type"
            :icon="icon"
          />
        </div>
      </div>

      <div class="flex-1">
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
          />
        </div>
      </div>
    </div>
  </vu-content-wrap>
</template>
