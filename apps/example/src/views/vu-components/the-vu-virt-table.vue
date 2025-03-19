<script setup lang="ts">
import { Columns, type OnLoadDataType, VuContentWrap, VuVirtTable } from '@vek-element/ui'
import { asyncSleep, dateIsoToFrontendFormat } from '@vek-element/ui/utils'
import { ElButton, ElButtonGroup } from 'element-plus'
import { ref, useTemplateRef } from 'vue'

const tableRef = useTemplateRef('table')

const COUNT_GENERATE_ITEMS = 1000

const columns = ref(
  new Columns(
    { prop: 'id', label: 'ID', type: 'number' },
    { prop: 'name', label: 'Name', type: 'string' },
    { prop: 'dateCreate', label: 'dateCreate', type: 'string', formatter: dateIsoToFrontendFormat },
    { prop: 'date.create', label: 'date.create', type: 'date', formatter: dateIsoToFrontendFormat }
  )
)

const getRandomDate = () => {
  const start = new Date(2020, 0, 1).getTime()
  const end = new Date()
  return new Date(start + Math.random() * (end.getTime() - start)).toISOString()
}

const generateItem = () => ({
  id: Math.floor(Math.random() * 1000),
  name: `Name ${Math.floor(Math.random() * 1000)}`,
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

  tableRef?.value?.updateDataItem(genItem, 'id')
}
const deleteDataItem = () => {
  tableRef?.value?.deleteDataItem(tableRef?.value?.data[0], 'id')
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
    </template>

    <vu-virt-table
      ref="table"
      height="100%"
      :columns="columns"
      :on-load-data="loadData"
      :size-page="COUNT_GENERATE_ITEMS"
    >
      <!-- <template #date_create="{ row }">{{ row }}</template> -->
    </vu-virt-table>
  </vu-content-wrap>
</template>
