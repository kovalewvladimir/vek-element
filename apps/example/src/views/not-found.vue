<script setup lang="ts">
const base = import.meta.env.BASE_URL
</script>

<template>
  <div class="flex justify-center items-center h-100vh flex-col">
    <h1>404</h1>
    <p>Page not found</p>
    <a :href="base">Go to home</a>
  </div>
</template>
