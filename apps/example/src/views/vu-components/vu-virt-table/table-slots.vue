<script setup lang="ts">
import {
  Columns,
  type IOnLoadDataParams,
  VuButtonIcon,
  VuContentWrap,
  VuIconSvgDynamic,
  VuVirtTable
} from '@vek-element/ui'
import { asyncSleep, dateIsoToFrontendFormat } from '@vek-element/ui/utils'
import { ElButton, ElMessage, ElTag, ElTooltip } from 'element-plus'
import { ref, useTemplateRef } from 'vue'

// ==================
// Types
// ==================

type StatusType = 'new' | 'work' | 'done'

interface IRow {
  id: number
  name: string
  status: StatusType
  comment: string
  amount: number
  dateCreate: string
  note: string
}

// ==================
// Constants
// ==================

const PAGE_SIZE = 50
const TOTAL = 300

const STATUS_META: Record<StatusType, { label: string; type: 'info' | 'warning' | 'success' }> = {
  new: { label: 'Новая', type: 'info' },
  work: { label: 'В работе', type: 'warning' },
  done: { label: 'Готово', type: 'success' }
}

const STATUSES: StatusType[] = ['new', 'work', 'done']

// ==================
// Variables
// ==================

const tableRef = useTemplateRef('table')

const columns = ref(
  new Columns(
    // menu: false — по колонке нельзя открыть меню сортировки/фильтра
    // resizable: false — границу колонки нельзя тянуть
    { prop: 'id', label: 'ID', type: 'number', width: 70, menu: false, resizable: false },
    { prop: 'name', label: 'Название', type: 'string', width: 260 },
    { prop: 'status', label: 'Статус', type: 'string', width: 140 },
    // showOverflowTooltip: false — обрезанный текст не показывает подсказку
    {
      prop: 'comment',
      label: 'Комментарий (без подсказки)',
      type: 'string',
      width: 220,
      showOverflowTooltip: false
    },
    {
      prop: 'amount',
      label: 'Сумма',
      type: 'number',
      width: 140,
      align: 'right',
      formatter: (value: number) => value.toFixed(2),
      summary: ({ rows }: { rows: IRow[] }) => {
        let total = 0
        for (const row of rows) total += row.amount
        return total
      }
    },
    // sort: 'DESC' — сортировка, с которой таблица делает первый запрос
    {
      prop: 'dateCreate',
      label: 'Дата',
      type: 'date',
      width: 140,
      sort: 'DESC',
      formatter: dateIsoToFrontendFormat
    },
    // visible: false — колонка скрыта; включается через меню любой колонки
    { prop: 'note', label: 'Скрытая колонка', type: 'string', width: 200, visible: false }
  )
)

const lastSort = ref<string>('—')

// ==================
// Methods
// ==================

let generatedId = 0
const generateItem = (): IRow => {
  generatedId++
  const start = new Date(2024, 0, 1).getTime()
  const date = new Date(start + Math.random() * (Date.now() - start))

  return {
    id: generatedId,
    name: `Задача ${generatedId}`,
    status: STATUSES[generatedId % STATUSES.length],
    comment: `Длинный комментарий к задаче ${generatedId}, который не помещается в колонку`,
    amount: Math.round(Math.random() * 100_000) / 100,
    dateCreate: date.toISOString(),
    note: `Заметка ${generatedId}`
  }
}

const loadData = async ({ page, sort }: IOnLoadDataParams) => {
  lastSort.value = sort ? `${sort.prop} ${sort.sort}` : 'без сортировки'

  await asyncSleep(400)

  const from = (page - 1) * PAGE_SIZE
  if (from >= TOTAL) return []

  return Array.from({ length: Math.min(PAGE_SIZE, TOTAL - from) }, () => generateItem())
}

/** Итоги «с сервера» — приходят в summary.serverData и в слот f-* */
const loadSummary = async () => {
  await asyncSleep(300)
  return { amount: 999_999.99 }
}

const setSummaryManually = () => {
  tableRef.value?.setSummary({ amount: 1 })
  ElMessage.success('setSummary({ amount: 1 })')
}

const resetSummary = () => {
  tableRef.value?.setSummary(null)
  ElMessage.success('setSummary(null)')
}

const reloadSummary = async () => {
  await tableRef.value?.reloadSummary()
  ElMessage.success('reloadSummary()')
}

/** Удаление нескольких строк подряд, начиная с индекса 0 */
const deleteFirstRows = () => {
  const deleted = tableRef.value?.deleteDataItems(0, 5) ?? []
  ElMessage.success(`deleteDataItems(0, 5) — удалено ${deleted.length}`)
}

const onRowAction = (row: IRow) => ElMessage.success(`Действие по строке ${row.id}`)
</script>

<template>
  <vu-content-wrap>
    <template #header>
      <div class="flex items-center gap-10px">
        <el-button
          type="primary"
          @click="tableRef?.reloadData()"
          >Обновить</el-button
        >
        <el-button @click="deleteFirstRows">deleteDataItems(0, 5)</el-button>
        <el-button @click="setSummaryManually">setSummary</el-button>
        <el-button @click="resetSummary">setSummary(null)</el-button>
        <el-button @click="reloadSummary">reloadSummary</el-button>
        <el-tag type="info">Сортировка запроса: {{ lastSort }}</el-tag>
      </div>
    </template>

    <div class="h-full flex flex-col">
      <p class="mb-10px">
        Слоты колонок: <code>#h-prop</code> — заголовок, <code>#prop-before</code> — вставка перед
        значением ячейки, <code>#prop</code> — сама ячейка, <code>#f-prop</code> — ячейка строки
        ИТОГО. Аттрибуты колонок: <code>menu</code>, <code>resizable</code>,
        <code>showOverflowTooltip</code>, <code>visible</code>, <code>sort</code>. Скрытую колонку
        «Заметка» можно включить через меню любой колонки (правый клик по заголовку).
      </p>

      <div class="min-h-0 flex-1">
        <vu-virt-table
          ref="table"
          height="100%"
          row-unique-key="id"
          :columns="columns"
          :on-load-data="loadData"
          :summary="{ enabled: true, label: 'ИТОГО', onLoad: loadSummary }"
        >
          <!-- Свой заголовок колонки -->
          <template #h-name="{ column }">
            <div class="flex items-center gap-5px">
              <vu-icon-svg-dynamic
                name="el-icon-menu"
                :size="14"
              />
              <b>{{ column.label }}</b>
            </div>
          </template>

          <!-- Вставка перед значением ячейки -->
          <template #name-before="{ row }">
            <el-tooltip
              :content="STATUS_META[row.status].label"
              placement="top"
            >
              <span
                class="mr-5px h-8px w-8px shrink-0 rounded-full"
                :class="{
                  'bg-[var(--el-color-info)]': row.status === 'new',
                  'bg-[var(--el-color-warning)]': row.status === 'work',
                  'bg-[var(--el-color-success)]': row.status === 'done'
                }"
              />
            </el-tooltip>
          </template>

          <!-- Своя ячейка -->
          <template #status="{ row }">
            <el-tag
              size="small"
              disable-transitions
              :type="STATUS_META[row.status].type"
              >{{ STATUS_META[row.status].label }}</el-tag
            >
          </template>

          <template #id="{ row }">
            <vu-button-icon
              text
              type="primary"
              icon="el-icon-menu"
              :icon-size="14"
              :tooltip="`Строка ${row.id}`"
              @click="onRowAction(row)"
              >{{ row.id }}</vu-button-icon
            >
          </template>

          <!-- Ячейки строки ИТОГО -->
          <template #f-name>
            <span class="c-[var(--el-text-color-secondary)]">Свой слот f-name</span>
          </template>

          <template #f-amount="{ value }">
            <b class="c-[var(--el-color-primary)]">
              {{ typeof value === 'number' ? `${value.toFixed(2)} ₽` : '—' }}
            </b>
          </template>
        </vu-virt-table>
      </div>
    </div>
  </vu-content-wrap>
</template>
