<script setup lang="ts">
import { VuContentWrap } from '@vek-element/ui'
import { ElCol, ElRow, ElTable, ElTableColumn } from 'element-plus'

const tableData = Array.from({ length: 100 }, (_, index) => ({
  date: `2016-05-0${index + 1}`,
  name: 'Tom',
  address: `No. ${index + 1}, Some street, Some city, Some country`
}))
</script>

<template>
  <el-row
    class="h-full"
    :gutter="10"
  >
    <el-col
      class="h-full"
      :span="8"
    >
      <vu-content-wrap>
        <template #header>
          <h1 class="text-2xl">Table 1</h1>
        </template>
        <el-table
          :data="tableData"
          height="100%"
          border
        >
          <el-table-column
            prop="date"
            label="Date"
          />
          <el-table-column
            prop="name"
            label="Name"
          />
          <el-table-column
            prop="address"
            label="Address"
          />
        </el-table>
      </vu-content-wrap>
    </el-col>

    <el-col
      class="h-full"
      :span="16"
    >
      <vu-content-wrap>
        <template #header>
          <h1 class="text-2xl">Table 2</h1>
        </template>
        <el-table
          :data="tableData"
          height="100%"
          border
        >
          <el-table-column
            prop="date"
            label="Date"
          />
          <el-table-column
            prop="name"
            label="Name"
          />
          <el-table-column
            prop="address"
            label="Address"
          />
        </el-table>
      </vu-content-wrap>
    </el-col>
  </el-row>
</template>
