<script setup lang="ts"></script>

<template>
  <div class=":uno: h-full p-10px">
    <div
      class=":uno: h-full bg-red-2 overflow-hidden overflow-y-auto"
      style="height: 100%; box-sizing: border-box"
    >
      <div
        v-for="item in 15"
        :key="item"
        class=":uno: h-100px bg-red-3 m-10px"
      />
    </div>
  </div>
</template>
