<script setup lang="ts">
import { Columns, VuContentWrap, VuVirtTable } from '@vek-element/ui'
import { dateIsoToFrontendFormat } from '@vek-element/ui/utils'
import { ElButton, ElInputNumber, ElSwitch, ElTag } from 'element-plus'
import { nextTick, ref, useTemplateRef } from 'vue'

// ==================
// Types
// ==================

interface IRow {
  id: number
  name: string
  name1: string
  name2: string
  name3: string
  name4: string
  name5: string
  name6: string
  name7: string
  amount: number
  qty: number
  dateCreate: string
  date: { create: string }
}

/** Результат одного сценария. `samples` — кадры для скролла, итерации для остальных */
interface IBenchResult {
  name: string
  hint: string
  /**
   * Что именно измерено.
   *
   * `время кадра` — интервал между двумя rAF. При 60 Гц он равен 16.7 мс, пока работа
   * влезает в бюджет, поэтому p50 у скролла почти всегда упирается в vsync и сам по себе
   * ничего не говорит. Смотреть надо на max, «пропущено» и «сверх бюджета».
   *
   * `время работы` — реальная длительность синхронного обработчика вместе с перерисовкой.
   * Здесь значима каждая колонка.
   */
  metric: 'время кадра' | 'время работы'
  samples: number
  p50: number
  p95: number
  max: number
  dropped: number
  over: number
  total: number
}

// ==================
// Constants
// ==================

/** Бюджет кадра при 60 Гц */
const FRAME_BUDGET = 1000 / 60

/**
 * Порог пропущенного кадра. Не сам бюджет: кадр длиной ровно 16.7 мс — норма, а джиттер
 * в пару миллисекунд вокруг vsync превратил бы половину идеального прогона в «просевшие».
 * 25 мс — это уже пропущенный vsync.
 */
const DROPPED_FRAME = FRAME_BUDGET * 1.5

/** Шаг медленного скролла в px. При rowHeight=28 окно сдвигается раз в 14 кадров */
const SLOW_STEP = 2
const SLOW_FRAMES = 600

/** Шаг быстрого скролла: 8 строк за кадр — окно сдвигается каждый кадр */
const FAST_STEP = 28 * 8
const FAST_FRAMES = 200

const CLICK_ITERATIONS = 20
const APPEND_PAGES = 10

// ==================
// Variables
// ==================

const tableRef = useTemplateRef('table')

const query = new URLSearchParams(globalThis.location.search)
const queryNumber = (key: string, fallback: number) => {
  const value = Number(query.get(key))
  return Number.isFinite(value) && value > 0 ? value : fallback
}

const totalRows = ref(queryNumber('rows', 50_000))
const sizePage = ref(queryNumber('size', 100))
const summaryEnabled = ref(query.get('summary') !== 'off')

/** Пересоздаёт таблицу целиком: параметры вроде sizePage на лету не подхватываются */
const tableKey = ref(0)

const loadedRows = ref(0)
const results = ref<IBenchResult[]>([])
const running = ref('')

const columns = ref(
  new Columns(
    { prop: 'id', label: 'ID', type: 'number', width: 70 },
    { prop: 'name', label: 'Name', type: 'string' },
    { prop: 'name1', label: 'Name1', type: 'string' },
    { prop: 'name2', label: 'Name2', type: 'string' },
    { prop: 'name3', label: 'Name3', type: 'string' },
    { prop: 'name4', label: 'Name4', type: 'string' },
    { prop: 'name5', label: 'Name5', type: 'string' },
    { prop: 'name6', label: 'Name6', type: 'string' },
    { prop: 'name7', label: 'Name7', type: 'string' },
    {
      prop: 'amount',
      label: 'Сумма',
      type: 'number',
      width: 110,
      align: 'right',
      formatter: (value: number) => value.toFixed(2),
      summary: ({ rows }: { rows: IRow[] }) => {
        let total = 0
        for (const row of rows) total += row.amount
        return total
      }
    },
    {
      prop: 'qty',
      label: 'Кол-во',
      type: 'number',
      width: 90,
      align: 'right',
      summary: ({ rows }: { rows: IRow[] }) => {
        let total = 0
        for (const row of rows) total += row.qty
        return total
      }
    },
    { prop: 'dateCreate', label: 'dateCreate', type: 'string', formatter: dateIsoToFrontendFormat },
    { prop: 'date.create', label: 'date.create', type: 'date', formatter: dateIsoToFrontendFormat }
  )
)

// ==================
// Data
// ==================

/**
 * Детерминированный ГПСЧ. Нужен, чтобы прогон «до правки» и «после» шёл на идентичных
 * данных — иначе разница в замерах частично объясняется разной длиной строк.
 */
function mulberry32(seed: number) {
  let a = seed
  return () => {
    // eslint-disable-next-line unicorn/prefer-math-trunc -- нужно переполнение int32, а не усечение
    a = (a + 0x6d_2b_79_f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4_294_967_296
  }
}

let rand = mulberry32(1)
let nextId = 0

const DATE_START = new Date(2020, 0, 1).getTime()
const DATE_END = new Date(2026, 0, 1).getTime()
const randomDate = () => new Date(DATE_START + rand() * (DATE_END - DATE_START)).toISOString()

const makeRow = (): IRow => ({
  id: nextId++,
  name: `Name ${Math.floor(rand() * 1000)}`,
  name1: `Name ${Math.floor(rand() * 1000)}`,
  name2: `Name ${Math.floor(rand() * 1000)}`,
  name3: `Name ${Math.floor(rand() * 1000)}`,
  name4: `Name ${Math.floor(rand() * 1000)}`,
  name5: `Name ${Math.floor(rand() * 1000)}`,
  name6: `Name ${Math.floor(rand() * 1000)}`,
  name7: `Name ${Math.floor(rand() * 1000)}`,
  amount: Math.round(rand() * 1_000_000) / 100,
  qty: Math.floor(rand() * 100),
  dateCreate: randomDate(),
  date: { create: randomDate() }
})

/** Весь набор генерируется один раз — загрузка страницы не должна попадать в профиль */
let source: IRow[] = []

const regenerate = () => {
  rand = mulberry32(1)
  nextId = 0
  source = Array.from({ length: totalRows.value }, () => makeRow())
}
regenerate()

/**
 * Отдаёт страницу мгновенно и копиями: сервер вернул бы новые объекты, а injectFormatMetaData
 * мутирует то, что ему передали — иначе reloadData работал бы на грязных строках.
 */
const loadData = ({ page, size }: { page: number; size: number }) => {
  const from = (page - 1) * size
  return Promise.resolve(source.slice(from, from + size).map((row) => ({ ...row })))
}

// ==================
// Measurement
// ==================

const nextFrame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

/** Скроллящий контейнер таблицы. Обёртки над ним нет — берём по data-testid */
const getBody = () => document.querySelector<HTMLElement>('[data-testid="virt-table-body"]') ?? null

const percentile = (sorted: number[], p: number) =>
  sorted[Math.min(sorted.length - 1, Math.round((sorted.length - 1) * p))] ?? 0

const summarize = (
  name: string,
  hint: string,
  metric: IBenchResult['metric'],
  times: number[]
): IBenchResult => {
  const sorted = times.toSorted((a, b) => a - b)
  return {
    name,
    hint,
    metric,
    samples: times.length,
    p50: percentile(sorted, 0.5),
    p95: percentile(sorted, 0.95),
    max: sorted.at(-1) ?? 0,
    dropped: times.filter((v) => v > DROPPED_FRAME).length,
    // Сколько времени суммарно вышло за бюджет кадра — устойчивый показатель джанка
    over: times.reduce((acc, v) => acc + Math.max(0, v - FRAME_BUDGET), 0),
    total: times.reduce((acc, v) => acc + v, 0)
  }
}

const publish = (result: IBenchResult) => {
  results.value = [...results.value, result]
  console.log(
    `${result.name}: p50=${result.p50.toFixed(2)} p95=${result.p95.toFixed(2)} max=${result.max.toFixed(2)} пропущено=${result.dropped}/${result.samples} сверх бюджета=${result.over.toFixed(0)} мс`
  )
}

/**
 * Прогоняет скролл по кадру за шаг. Время кадра считается между двумя rAF: рендер Vue
 * успевает отработать в тике до отрисовки, поэтому его стоимость попадает в замер.
 */
async function benchScroll(name: string, hint: string, step: number, frames: number) {
  const body = getBody()
  if (!body) return

  body.scrollTop = 0
  await nextFrame()
  await nextFrame()

  const times: number[] = []
  let last = performance.now()
  for (let i = 0; i < frames; i++) {
    body.scrollTop += step
    await nextFrame()
    const now = performance.now()
    times.push(now - last)
    last = now
  }
  publish(summarize(name, hint, 'время кадра', times))
}

/** Клик по видимой строке: сброс isActive обходом всех данных плюс перерисовка подсветки */
async function benchRowClick() {
  const rows = [...document.querySelectorAll<HTMLElement>('.virt-table-root .row')]
  if (rows.length === 0) return

  const times: number[] = []
  for (let i = 0; i < CLICK_ITERATIONS; i++) {
    const row = rows[i % rows.length]
    const start = performance.now()
    row.click()
    await nextTick()
    times.push(performance.now() - start)
  }
  publish(summarize('Клик по строке', 'п.3 — обход data ради сброса флага', 'время работы', times))
}

/** Append страницы в конец: тот же путь, что и догрузка — мутация массива, ИТОГО, инвалидация */
async function benchAppendPage() {
  const table = tableRef.value
  if (!table) return

  const times: number[] = []
  for (let i = 0; i < APPEND_PAGES; i++) {
    const batch = Array.from({ length: sizePage.value }, () => makeRow())
    const start = performance.now()
    table.pushDataItem(batch, { index: Number.MAX_SAFE_INTEGER, isCloneData: false })
    await nextTick()
    times.push(performance.now() - start)
  }
  loadedRows.value = table.data.length
  publish(
    summarize('Догрузка страницы', 'п.2 — пересчёт ИТОГО на весь массив', 'время работы', times)
  )
}

// ==================
// Actions
// ==================

const withRunning = async (label: string, action: () => Promise<void>) => {
  running.value = label
  try {
    await action()
  } finally {
    running.value = ''
    loadedRows.value = tableRef.value?.data.length ?? 0
  }
}

/** Набирает весь объём через настоящий бесконечный скролл */
const loadAll = () =>
  withRunning('Загрузка', async () => {
    const body = getBody()
    const table = tableRef.value
    if (!body || !table) return

    const start = performance.now()
    let stalled = 0
    while (table.data.length < totalRows.value && stalled < 20) {
      const before = table.data.length
      body.scrollTop = body.scrollHeight
      await sleep(30)
      stalled = table.data.length === before ? stalled + 1 : 0
      loadedRows.value = table.data.length
    }
    body.scrollTop = 0
    await nextFrame()

    const wall = performance.now() - start
    console.log(`Загружено ${table.data.length} строк за ${wall.toFixed(0)} мс`)
  })

const runSlowScroll = () =>
  withRunning('Медленный скролл', () =>
    benchScroll(
      'Медленный скролл',
      `п.1, п.5 — ${SLOW_STEP} px/кадр, окно сдвигается редко`,
      SLOW_STEP,
      SLOW_FRAMES
    )
  )

const runFastScroll = () =>
  withRunning('Быстрый скролл', () =>
    benchScroll(
      'Быстрый скролл',
      `п.7 — ${FAST_STEP} px/кадр, окно сдвигается каждый кадр`,
      FAST_STEP,
      FAST_FRAMES
    )
  )

const runRowClick = () => withRunning('Клик по строке', benchRowClick)
const runAppendPage = () => withRunning('Догрузка страницы', benchAppendPage)

const runAll = () =>
  withRunning('Полный прогон', async () => {
    await benchScroll(
      'Медленный скролл',
      `п.1, п.5 — ${SLOW_STEP} px/кадр, окно сдвигается редко`,
      SLOW_STEP,
      SLOW_FRAMES
    )
    await benchScroll(
      'Быстрый скролл',
      `п.7 — ${FAST_STEP} px/кадр, окно сдвигается каждый кадр`,
      FAST_STEP,
      FAST_FRAMES
    )
    await benchRowClick()
    await benchAppendPage()
    console.table(
      results.value.map((result) => ({
        Сценарий: result.name,
        Метрика: result.metric,
        Замеров: result.samples,
        p50: result.p50.toFixed(2),
        p95: result.p95.toFixed(2),
        max: result.max.toFixed(2),
        Пропущено: `${result.dropped} / ${result.samples}`,
        'Сверх бюджета, мс': result.over.toFixed(0),
        'Всего, мс': result.total.toFixed(0)
      }))
    )
  })

const applyParams = () => {
  results.value = []
  loadedRows.value = 0
  regenerate()
  tableKey.value++
}

const clearResults = () => {
  results.value = []
}
</script>

<template>
  <vu-content-wrap>
    <template #header>
      <div class="flex flex-wrap items-center gap-10px">
        <span>Строк</span>
        <el-input-number
          v-model="totalRows"
          :min="1000"
          :max="500000"
          :step="10000"
          controls-position="right"
          class="w-150px"
        />

        <span>sizePage</span>
        <el-input-number
          v-model="sizePage"
          :min="10"
          :max="10000"
          :step="100"
          controls-position="right"
          class="w-130px"
        />

        <span>ИТОГО</span>
        <el-switch v-model="summaryEnabled" />

        <el-button
          type="primary"
          @click="applyParams"
          >Применить</el-button
        >

        <el-button
          type="success"
          :disabled="running !== ''"
          @click="loadAll"
          >Загрузить всё</el-button
        >

        <el-button
          :disabled="running !== ''"
          @click="runSlowScroll"
          >Медленный скролл</el-button
        >
        <el-button
          :disabled="running !== ''"
          @click="runFastScroll"
          >Быстрый скролл</el-button
        >
        <el-button
          :disabled="running !== ''"
          @click="runRowClick"
          >Клик по строке</el-button
        >
        <el-button
          :disabled="running !== ''"
          @click="runAppendPage"
          >Догрузка страницы</el-button
        >

        <el-button
          type="warning"
          :disabled="running !== ''"
          @click="runAll"
          >Прогнать всё</el-button
        >

        <el-button
          text
          @click="clearResults"
          >Очистить</el-button
        >

        <el-tag
          v-if="running"
          type="warning"
          disable-transitions
          >{{ running }}…</el-tag
        >
        <el-tag
          v-else
          disable-transitions
          data-testid="perf-loaded"
          >загружено {{ loadedRows }}</el-tag
        >
      </div>
    </template>

    <div class="flex flex-col h-full gap-10px">
      <div
        v-if="results.length > 0"
        class="shrink-0"
        data-testid="perf-results"
      >
        <table class="w-full text-12px">
          <thead>
            <tr class="text-left color-gray">
              <th class="pr-10px pb-4px font-normal">Сценарий</th>
              <th class="pr-10px pb-4px font-normal">Что меряет</th>
              <th class="pr-10px pb-4px font-normal">Метрика</th>
              <th class="pr-10px pb-4px font-normal">Замеров</th>
              <th class="pr-10px pb-4px font-normal">p50, мс</th>
              <th class="pr-10px pb-4px font-normal">p95, мс</th>
              <th class="pr-10px pb-4px font-normal">max, мс</th>
              <th class="pr-10px pb-4px font-normal">Пропущено</th>
              <th class="pr-10px pb-4px font-normal">Сверх бюджета, мс</th>
              <th class="pr-10px pb-4px font-normal">Всего, мс</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(result, index) in results"
              :key="index"
            >
              <td class="pr-10px py-2px">{{ result.name }}</td>
              <td class="pr-10px py-2px color-gray">{{ result.hint }}</td>
              <td class="pr-10px py-2px color-gray">{{ result.metric }}</td>
              <td class="pr-10px py-2px">{{ result.samples }}</td>
              <td class="pr-10px py-2px">{{ result.p50.toFixed(2) }}</td>
              <td class="pr-10px py-2px">{{ result.p95.toFixed(2) }}</td>
              <td class="pr-10px py-2px">{{ result.max.toFixed(2) }}</td>
              <td class="pr-10px py-2px">{{ result.dropped }} / {{ result.samples }}</td>
              <td class="pr-10px py-2px">{{ result.over.toFixed(0) }}</td>
              <td class="pr-10px py-2px">{{ result.total.toFixed(0) }}</td>
            </tr>
          </tbody>
        </table>

        <p class="mt-6px mb-0 text-11px color-gray lh-16px">
          <b>время кадра</b> — интервал между двумя rAF. При 60 Гц он упирается в 16.7 мс, пока
          работа влезает в бюджет, поэтому p50 у скролла сам по себе ничего не значит: смотрите
          <b>max</b>, <b>пропущено</b> (кадры дольше 25 мс) и <b>сверх бюджета</b>.
          <b>время работы</b> — длительность синхронного обработчика вместе с перерисовкой, там
          значима каждая колонка. Разбивку по функциям кадрами не получить — для неё снимайте
          CPU-профиль: <code>PERF=1 npx playwright test virt-table-perf</code>.
        </p>
      </div>

      <vu-virt-table
        :key="tableKey"
        ref="table"
        height="100%"
        row-unique-key="id"
        :columns="columns"
        :size-page="sizePage"
        :on-load-data="loadData"
        :summary="{ enabled: summaryEnabled }"
        class="grow-1"
      />
    </div>
  </vu-content-wrap>
</template>
