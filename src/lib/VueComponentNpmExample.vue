<script setup lang="ts">
import { ref } from "vue";
import { ElButton } from "element-plus";


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
    <el-button>count is {{ count }}</el-button>
    <button type="button" @click="increment">count is {{ count }}</button>
  </div>
</template>

<style scoped>
.card {
  border: 1px solid #ccc;
  padding: 10px;
  margin-top: 10px;
}
</style>