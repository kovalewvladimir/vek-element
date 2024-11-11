<script setup lang="ts">
import { RouterView } from 'vue-router'

import ClassicLayout from './classic-layout.vue'
</script>

<template>
  <div>
    <classic-layout>
      <router-view v-slot="{ Component, route }">
        <!-- <transition name="el-fade-in-linear"> -->
        <keep-alive>
          <component
            :is="Component"
            :key="route.fullPath"
          />
        </keep-alive>
        <!-- </transition> -->
      </router-view>
    </classic-layout>
  </div>
</template>
