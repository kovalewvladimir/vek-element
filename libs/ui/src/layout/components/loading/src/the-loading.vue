<script setup lang="ts">
import { TheLogo } from '@vek-element/ui/layout'
</script>

<template>
  <div class="app-loading">
    <div class="app-loading-wrap">
      <div class="app-loading-title">
        <the-logo class="app-loading-logo" />
      </div>
      <div class="app-loading-item">
        <div class="app-loading-outer"></div>
        <div class="app-loading-inner"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.app-loading {
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background: #f0f2f5;
}

.app-loading .app-loading-wrap {
  position: absolute;
  top: 50%;
  left: 50%;
  display: flex;
  transform: translate3d(-50%, -50%, 0);
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.app-loading .app-loading-title {
  margin-bottom: 30px;
  font-size: 20px;
  font-weight: bold;
  text-align: center;
}

.app-loading .app-loading-logo {
  margin: 0 auto 15px auto;
}

.app-loading .app-loading-item {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 60px;
  vertical-align: middle;
  border-radius: 50%;
}

.app-loading .app-loading-outer {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 4px solid #2d8cf0;
  border-bottom: 0;
  border-left-color: transparent;
  border-radius: 50%;
  animation: loader-outer 0.5s cubic-bezier(0.42, 0.61, 0.58, 0.41) infinite;
}

.app-loading .app-loading-inner {
  position: absolute;
  top: calc(50% - 20px);
  left: calc(50% - 20px);
  width: 40px;
  height: 40px;
  border: 4px solid #87bdff;
  border-right: 0;
  border-top-color: transparent;
  border-radius: 50%;
  animation: loader-inner 0.5s cubic-bezier(0.42, 0.61, 0.58, 0.41) infinite;
}

@keyframes loader-outer {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

@keyframes loader-inner {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(-360deg);
  }
}
</style>
