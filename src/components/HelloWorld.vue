<script setup lang="ts">
import { ElaAutocompleteRemote } from 'element-plus-aa';
import { ElCard } from 'element-plus';
import { ref } from 'vue';
import { asyncSleep } from 'element-plus-aa/utils';

const value = ref<string>('');


const getOptions = async () => {
  await asyncSleep(3000)
  return {
    data: [
      {value: 'Test1', label: 'Test1'},
      {value: 'Test2', label: 'Test2'},
      {value: 'Test3', label: 'Test3'},
    ],
  };
};
</script>

<template>
  <el-card header="ela-autocomplete-remote" style="width: 300px;">
    <ela-autocomplete-remote v-model="value" :get-loading-options="getOptions" />
  </el-card>
</template>

