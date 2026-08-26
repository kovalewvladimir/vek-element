<script setup lang="ts">
import { VuContentWrap } from '@vek-element/ui'
import {
  isAsyncLoadComponent,
  isNull,
  isUndefined,
  joinPath,
  randomString,
  trimEndPath,
  trimStartPath
} from '@vek-element/ui/utils'
import { ElButton, ElDivider, ElInput, ElTable, ElTableColumn, ElTag } from 'element-plus'
import { computed, ref } from 'vue'

// =========================
// Data
// =========================

const values: { label: string; value: unknown }[] = [
  { label: 'null', value: null },
  { label: 'undefined', value: undefined },
  { label: '0', value: 0 },
  { label: "''", value: '' },
  { label: 'false', value: false },
  { label: '{}', value: {} }
]

/** Асинхронный компонент — функция, возвращающая промис */
const asyncComponent = () => import('@/views/utils/the-utils-sleep.vue')

const rootPath = ref<string>('/vu-components/')
const subPath = ref<string>('/vu-virt-table/simple')

const randoms = ref<string[]>([randomString(), randomString(), randomString()])

// =========================
// Computed
// =========================

const isRows = computed(() =>
  values.map((item) => ({
    label: item.label,
    isNull: isNull(item.value),
    isUndefined: isUndefined(item.value)
  }))
)

const pathRows = computed(() => [
  {
    fn: 'joinPath(root, sub)',
    input: `('${rootPath.value}', '${subPath.value}')`,
    result: joinPath(rootPath.value, subPath.value)
  },
  {
    fn: 'trimEndPath(root)',
    input: `('${rootPath.value}')`,
    result: trimEndPath(rootPath.value)
  },
  {
    fn: 'trimStartPath(sub)',
    input: `('${subPath.value}')`,
    result: trimStartPath(subPath.value)
  }
])

// =========================
// Methods
// =========================

const regenerate = () => {
  randoms.value = Array.from({ length: 3 }, () => randomString())
}
</script>

<template>
  <vu-content-wrap>
    <template #header>
      <h2>utils / is, random, url</h2>
    </template>

    <p>
      Мелкие утилиты <code>@vek-element/ui/utils</code>: type guards, генератор случайной строки и
      сборка путей — тем же кодом навигация склеивает пути роутов.
    </p>

    <el-divider content-position="left">is — type guards</el-divider>
    <p>
      <code>isNull</code> и <code>isUndefined</code> различают <code>null</code> и
      <code>undefined</code>, в отличие от проверки на falsy.
    </p>
    <div class="max-w-600px">
      <el-table :data="isRows">
        <el-table-column
          prop="label"
          label="Значение"
          width="160"
        />
        <el-table-column
          label="isNull"
          width="160"
        >
          <template #default="{ row }">
            <el-tag :type="row.isNull ? 'success' : 'info'">{{ row.isNull }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="isUndefined">
          <template #default="{ row }">
            <el-tag :type="row.isUndefined ? 'success' : 'info'">{{ row.isUndefined }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <p class="mt-10px">
      <code>isAsyncLoadComponent(() =&gt; import('...'))</code> —
      <el-tag type="success">{{ isAsyncLoadComponent(asyncComponent) }}</el-tag>
      <span class="ml-20px"><code>isAsyncLoadComponent(VuContentWrap)</code> — </span>
      <el-tag type="info">{{ isAsyncLoadComponent(VuContentWrap) }}</el-tag>
    </p>

    <el-divider content-position="left">random</el-divider>
    <div class="flex items-center gap-10px">
      <el-button @click="regenerate">randomString()</el-button>
      <el-tag
        v-for="item in randoms"
        :key="item"
        type="info"
        >{{ item }}</el-tag
      >
    </div>

    <el-divider content-position="left">url</el-divider>
    <div class="mb-10px flex items-center gap-10px">
      <el-input
        v-model="rootPath"
        class="!w-260px"
        placeholder="rootPath"
      />
      <el-input
        v-model="subPath"
        class="!w-260px"
        placeholder="subPath"
      />
    </div>
    <div class="max-w-800px">
      <el-table :data="pathRows">
        <el-table-column
          prop="fn"
          label="Функция"
          width="220"
        />
        <el-table-column
          prop="input"
          label="Аргументы"
          show-overflow-tooltip
        />
        <el-table-column
          label="Результат"
          width="280"
        >
          <template #default="{ row }">
            <el-tag>{{ row.result }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </vu-content-wrap>
</template>
