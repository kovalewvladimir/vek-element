<script setup lang="ts">
import { Columns, type OnLoadDataType, VuContentWrap, VuVirtTable } from '@vek-element/ui'
import { asyncSleep, dateIsoToFrontendFormat } from '@vek-element/ui/utils'
import { ElButton, ElButtonGroup, ElTag } from 'element-plus'
import { ref, useTemplateRef } from 'vue'

// ==================
// Constants
// ==================

const COUNT_GENERATE_ITEMS = 10

// ==================
// Variables
// ==================

const tableRef = useTemplateRef('table')

const columns = ref(
  new Columns(
    { prop: 'id', label: 'ID', type: 'number' },
    { prop: 'name', label: 'Name', type: 'string' },
    { prop: 'name1', label: 'Name1', type: 'string' },
    { prop: 'name2', label: 'Name2', type: 'string' },
    { prop: 'name3', label: 'Name3', type: 'string' },
    { prop: 'name4', label: 'Name4', type: 'string' },
    { prop: 'name5', label: 'Name5', type: 'string' },
    { prop: 'name6', label: 'Name6', type: 'string' },
    { prop: 'name7', label: 'Name7', type: 'string' },
    { prop: 'dateCreate', label: 'dateCreate', type: 'string', formatter: dateIsoToFrontendFormat },
    { prop: 'date.create', label: 'date.create', type: 'date', formatter: dateIsoToFrontendFormat }
  )
)

// ==================
// Methods
// ==================

const getRandomDate = () => {
  const start = new Date(2020, 0, 1).getTime()
  const end = new Date()
  return new Date(start + Math.random() * (end.getTime() - start)).toISOString()
}

let id = 0
const generateItem = (name: string = '') => ({
  id: id++,
  isExpandable: Math.random() > 0.5,
  name: `${name ? name + ' - ' : ''}Name ${Math.floor(Math.random() * 1000)}`,
  name1: `Name ${Math.floor(Math.random() * 1000)}`,
  name2: `Name ${Math.floor(Math.random() * 1000)}`,
  name3: `Name ${Math.floor(Math.random() * 1000)}`,
  name4: `Name ${Math.floor(Math.random() * 1000)}`,
  name5: `Name ${Math.floor(Math.random() * 1000)}`,
  name6: `Name ${Math.floor(Math.random() * 1000)}`,
  name7: `Name ${Math.floor(Math.random() * 1000)}`,
  dateCreate: getRandomDate(),
  date: {
    create: getRandomDate()
  }
})

const loadData: OnLoadDataType = async () => {
  await asyncSleep(1000)
  return Array.from({ length: COUNT_GENERATE_ITEMS }).map(() => generateItem())
}

const addDataItem = () => {
  tableRef?.value?.createDataItem(generateItem())
}
const updateDataItem = () => {
  const item = tableRef?.value?.data[0]
  const genItem = generateItem()
  genItem.id = item.id

  tableRef?.value?.updateDataItem(genItem, { index: 0 })
}
const deleteDataItem = () => {
  tableRef?.value?.deleteDataItem(0)
}

async function expandAll() {
  if (tableRef.value === null) throw new Error('tableRef is not defined')

  for (let j = 1; j <= 4; j++) {
    const tasks = []
    for (let i = 0; i < tableRef.value.data.length; i++) {
      tasks.push(tableRef.value.toggleRowExpansion(i, true))
    }
    await Promise.all(tasks)
  }
}
</script>

<template>
  <vu-content-wrap>
    <template #header>
      <el-button
        type="primary"
        @click="tableRef?.reloadData()"
        >Reload</el-button
      >

      <el-button-group class="mx-10px">
        <el-button
          type="success"
          @click="addDataItem"
          >Добавить</el-button
        >
        <el-button
          type="warning"
          @click="updateDataItem"
          >Изменить</el-button
        >
        <el-button
          type="danger"
          @click="deleteDataItem"
          >Удалить</el-button
        >
      </el-button-group>

      <el-button
        type="info"
        @click="expandAll"
        >Expand All</el-button
      >
    </template>

    <vu-virt-table
      ref="table"
      height="100%"
      :columns="columns"
      :on-load-data="loadData"
      :tree="{
        enabled: true,
        onLoadData: async (row) => {
          await asyncSleep(1000)
          return Array.from({ length: COUNT_GENERATE_ITEMS }).map(() => generateItem(row.id))
        }
      }"
      @change-active-row="
        (row) => {
          console.log('change-active-row', row)
        }
      "
    >
      <template #name1="{ row }">
        <el-button>{{ row.name1 }}</el-button>
      </template>

      <template #name2="{ row }">
        <el-tag disable-transitions>{{ row.name2 }}</el-tag>
      </template>
    </vu-virt-table>
  </vu-content-wrap>
</template>
