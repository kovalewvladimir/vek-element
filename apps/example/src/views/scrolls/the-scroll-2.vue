<script setup lang="ts">
import { ElTable, ElTableColumn } from 'element-plus'

const tableData = Array.from({ length: 500 }, (_, index) => ({
  date: `2016-05-0${index + 1}`,
  name: 'Tom',
  address: `No. ${index + 1}, Some street, Some city, Some country`
}))
</script>

<template>
  <div class=":uno: flex flex-col h-full">
    <div class="">
      <h1>Header</h1>
    </div>
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
  </div>
</template>
