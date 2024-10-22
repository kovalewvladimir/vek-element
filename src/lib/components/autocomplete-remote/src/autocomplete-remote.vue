<script setup lang="ts">
import type { ElAutocomplete } from "element-plus";
import { ref } from "vue";

import { useLoading } from '~/hooks/useLoading';

const {
  getLoadingOptions,
  valueKey = "value",
  placeholder = "",
  maxReturnComplete = 50,
  waitSearch = 500,
} = defineProps<{
  /**
   * TODO: Описание
   */
  getLoadingOptions: () => Promise<{data: ReadonlyArray<any>}>;
  /**
   * Ключ значения
   * 
   * default "value"
   */
  valueKey?: string;
  /**
   * placeholder
   *
   * default ""
   */
  placeholder?: string;
  /**
   * Максимальное количество возвращаемых значений
   *
   * default 50
   */
  maxReturnComplete?: number;
  /**
   * Задержка перед поиском
   *
   * default 500
   */
  waitSearch?: number;
}>();

const value = defineModel<string>({ required: true });

const {loading, loadingWrapper} = useLoading();
const inputRef = ref<InstanceType<typeof ElAutocomplete>>();
const options = ref<ReadonlyArray<any>>([]);

loadingWrapper(async () => {
  const { data } = await getLoadingOptions();

  options.value = data;
})();

const querySearch = (query: string, cb: any) => {
  const result: Array<any> = [];

  if (query) {
    query = query.toLowerCase();
    let i = 0;
    for (const option of options.value) {
      if (option[valueKey].toLowerCase().indexOf(query) !== -1) {
        result.push(option);
        if (++i === maxReturnComplete) break;
      }
    }
  } else {
    result.push(...options.value.slice(0, maxReturnComplete));
  }

  cb(result);
};

const nextFocusInput = () => {
  inputRef.value?.blur();
};

const isValid = (): boolean => {
  return (
    options.value.find((option) => option[valueKey] === value.value) !==
    undefined
  );
};
defineExpose({ isValid });
</script>

<template>
  <el-skeleton :loading="loading" animated style="height: 24px">
    <template #template>
      <el-skeleton-item style="height: 24px" />
    </template>
    <template #default>
      <el-autocomplete
        ref="inputRef"
        v-model="value"
        :value-key="valueKey"
        :fetch-suggestions="querySearch"
        :trigger-on-focus="false"
        clearable
        :debounce="waitSearch"
        :placeholder="placeholder"
        style="width: 100%"
        @select="nextFocusInput"
      />
    </template>
  </el-skeleton>
</template>
