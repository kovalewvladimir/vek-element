import { useLoading } from '@vek-element/ui-components/hooks'
import { computed, type ComputedRef, type Ref, ref } from 'vue'

import { type Column, type Columns } from './column'
import { type ISummaryResolved } from './types'
import { getTreeLevel, getValueByPath } from './utils'

/**
 * Расчёт значений для строки ИТОГО.
 *
 * Источник значений гибридный:
 *  - колонка со своей функцией `summary` считает значение сама (в неё передаются и загруженные
 *    строки, и данные с сервера — колонка сама решает, что показать);
 *  - колонка без функции показывает значение из данных сервера (`onLoad`/`setSummary`) по своему prop.
 */
export const useSummary = <T>(
  columns: Columns,
  data: Ref<T[]>,
  isAllDataLoaded: Ref<boolean>,
  options: ComputedRef<ISummaryResolved>
) => {
  const { loadingWrapper } = useLoading()

  // Объект настроек пересоздаётся при каждом рендере родителя (`:summary="{ ... }"`),
  // поэтому раскладываем его на примитивные computed: они будят зависимости
  // только когда значение действительно изменилось
  const enabled = computed(() => options.value.enabled)
  const includeTreeChildren = computed(() => options.value.includeTreeChildren)

  /** Итоги, полученные с сервера или установленные вручную */
  const serverSummary = ref<Record<string, any> | null>(null)

  /** Счётчик запросов. Защита от гонки ответов при быстрой смене сортировки/фильтров */
  let requestId = 0

  /** Установка итогов вручную (null — сброс) */
  const setSummary = (summaryData: Record<string, any> | null) => {
    // Ответ незавершённого запроса не должен затирать установленное вручную значение
    requestId++
    serverSummary.value = summaryData
  }

  /** Загрузка итогов с сервера */
  const loadSummary = loadingWrapper(async () => {
    const { enabled, onLoad } = options.value
    if (!enabled || !onLoad) return

    const id = ++requestId
    const result = await onLoad({ sort: columns.getSort(), filters: columns.getFilters() })

    // Пришёл ответ на устаревший запрос — игнорируем
    if (id !== requestId) return

    serverSummary.value = result
  })

  /** Строки, участвующие в расчёте итогов */
  const summaryRows = computed<T[]>(() => {
    if (!enabled.value) return []
    if (includeTreeChildren.value) return data.value

    // Данные дерева хранятся плоским списком: без фильтрации по уровню
    // дочерние строки посчитались бы вместе с родительскими
    const result: T[] = []
    for (const row of data.value) if (getTreeLevel(row) === 0) result.push(row)
    return result
  })

  /**
   * Значение колонки в отдельном computed: колонка пересчитывается только когда изменились
   * данные, которые она реально читает. Поля параметров — геттеры, поэтому колонка,
   * которая берёт только `rows`, не пересчитывается от прихода серверных итогов.
   */
  const columnValues = new WeakMap<Column, ComputedRef<any>>()
  const getColumnValue = (column: Column) => {
    let value = columnValues.get(column)

    if (!value) {
      value = computed(() =>
        column.summary?.({
          column,
          get rows() {
            return summaryRows.value
          },
          get serverData() {
            return serverSummary.value
          },
          get isAllDataLoaded() {
            return isAllDataLoaded.value
          }
        })
      )
      columnValues.set(column, value)
    }

    return value.value
  }

  /** Значения строки ИТОГО по prop колонки */
  const summaryValues = computed<Record<string, any>>(() => {
    const values: Record<string, any> = {}
    if (!enabled.value) return values

    for (const column of columns) {
      if (column.summary) {
        values[column.prop] = getColumnValue(column)
        continue
      }

      // Без своей функции колонка показывает то, что пришло с сервера
      const serverData = serverSummary.value
      if (serverData) {
        const value = getValueByPath(serverData, column.prop)
        if (value !== undefined) values[column.prop] = value
      }
    }

    return values
  })

  return {
    summaryValues,
    setSummary,
    loadSummary
  }
}
