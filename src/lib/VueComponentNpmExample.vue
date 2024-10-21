<script setup lang="ts">
import { ref } from "vue";

defineProps({
  msg: { type: String },
});

const count = ref(0);
const increment = () => {
  console.log("increment");
  count.value++;
};
</script>

<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <button type="button" @click="increment">count is {{ count }}</button>
  </div>
</template>

