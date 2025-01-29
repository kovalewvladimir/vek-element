import type VirtTable from './src/virt-table.vue'

type VuVirtTableInstance = InstanceType<typeof VirtTable>

export type { IOnLoadDataParams, onLoadDataType } from './src/types'
export type { VuVirtTableInstance }
export { Column, Columns, type IColumn } from './src/types'
export { default as VuVirtTable } from './src/virt-table.vue'
