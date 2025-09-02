<script setup lang="ts" generic="T">
import { useLoading } from '@vek-element/ui-components/hooks'
import {
  ElAutocomplete,
  ElSkeleton,
  ElSkeletonItem,
  useGlobalComponentSettings
} from 'element-plus'
import { computed, onMounted, toValue, useTemplateRef } from 'vue'

const {
  getLoadingOptions,
  valueKey = 'value',
  placeholder = '',
  maxReturnComplete = 50,
  waitSearch = 500
} = defineProps<{
  /**
   * TODO: Описание
   */
  getLoadingOptions: () => Promise<{ data: ReadonlyArray<T> }>
  /**
   * Ключ значения
   *
   * default "value"
   */
  valueKey?: string
  /**
   * placeholder
   *
   * default ""
   */
  placeholder?: string
  /**
   * Максимальное количество возвращаемых значений
   *
   * default 50
   */
  maxReturnComplete?: number
  /**
   * Задержка перед поиском
   *
   * default 500
   */
  waitSearch?: number
}>()

const value = defineModel<string>({ required: true })

const { loading, loadingWrapper } = useLoading(0)
const { size: globalSize } = useGlobalComponentSettings('autocomplete')

const inputRef = useTemplateRef<InstanceType<typeof ElAutocomplete>>('inputRef')
let options: ReadonlyArray<T> = []

onMounted(
  loadingWrapper(async () => {
    const { data } = await getLoadingOptions()
    options = data
  })
)

const querySearch = (query: string, cb: any) => {
  const result: Array<any> = []

  if (query) {
    query = query.toLowerCase()
    let i = 0
    for (const option of options) {
      if (
        String(option[valueKey as keyof typeof option])
          .toLowerCase()
          .includes(query)
      ) {
        result.push(option)
        if (++i === maxReturnComplete) break
      }
    }
  } else {
    result.push(...options.slice(0, maxReturnComplete))
  }

  cb(result)
}

const nextFocusInput = () => {
  inputRef.value?.blur()
}

const skeletonSize = computed(() => {
  switch (toValue(globalSize)) {
    case 'small': {
      return { height: 'var(--el-component-size-small)' }
    }
    case 'large': {
      return { height: 'var(--el-component-size-large)' }
    }
    default: {
      return { height: 'var(--el-component-size)' }
    }
  }
})

const isValid = (): boolean => {
  return options.some((option) => String(option[valueKey as keyof typeof option]) === value.value)
}

// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
const getOption = (): T | undefined => {
  return options.find((option) => String(option[valueKey as keyof typeof option]) === value.value)
}

defineExpose({ isValid, getOption })
</script>

<template>
  <el-skeleton
    :loading="loading"
    animated
    :style="skeletonSize"
  >
    <template #template>
      <el-skeleton-item :style="skeletonSize" />
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
        @select="nextFocusInput"
      />
    </template>
  </el-skeleton>
</template>
