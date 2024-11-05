<script setup lang="ts">
import { ElMenu, ElMenuItem, ElSubMenu } from 'element-plus'
</script>

<template>
  <img src="" />
  <el-menu collapse>
    <el-menu-item index="1">Option 1</el-menu-item>
    <el-menu-item index="2">Option 1</el-menu-item>
    <el-sub-menu index="3">
      <template #title>Option 3</template>
      <el-menu-item index="3-1">Option 3-1</el-menu-item>
      <el-menu-item index="3-2">Option 3-2</el-menu-item>
      <el-menu-item index="3-3">Option 3-3</el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>
