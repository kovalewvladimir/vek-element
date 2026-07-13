import { onBeforeUnmount, type Ref,ref } from 'vue'

import { type Column } from './column'
import { COLUMN_MAX_WIDTH, COLUMN_MIN_WIDTH } from './constants'

/**
 * Логика изменения ширины колонки перетаскиванием границы заголовка.
 *
 * Ширина применяется к колонке только по отпусканию мыши (mouseup).
 * Во время перетаскивания отображается вертикальная линия-указатель (indicatorLeft).
 *
 * @param rootRef Ссылка на корневой элемент таблицы (для расчёта позиции указателя)
 */
export function useColumnResize(rootRef: Ref<HTMLElement | null>) {
  /** Идёт ли перетаскивание границы в данный момент */
  const isResizing = ref(false)
  /** Позиция вертикальной линии-указателя относительно корневого элемента таблицы (px) */
  const indicatorLeft = ref(0)

  let column: Column | null = null
  let startX = 0
  let startWidth = 0
  let cellLeft = 0
  let pendingWidth = 0

  const onMouseMove = (e: MouseEvent): void => {
    const delta = e.clientX - startX
    pendingWidth = Math.min(Math.max(startWidth + delta, COLUMN_MIN_WIDTH), COLUMN_MAX_WIDTH)
    indicatorLeft.value = cellLeft + pendingWidth
  }

  const stop = (): void => {
    isResizing.value = false
    column = null
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
  }

  /**
   * Гасит click, который браузер генерирует после mouseup.
   * Без этого перетаскивание границы срабатывает как клик по заголовку (сортировка):
   * если mouseup пришёлся не на ручку, а на тело ячейки, target у click — сама ячейка.
   */
  const suppressClick = (e: MouseEvent): void => {
    e.stopPropagation()
    globalThis.removeEventListener('click', suppressClick, true)
  }

  const onMouseUp = (): void => {
    if (column) column.setWidth(Math.round(pendingWidth))
    stop()
    globalThis.addEventListener('click', suppressClick, true)
  }

  /** Начать перетаскивание границы колонки */
  const startResize = (e: MouseEvent, col: Column): void => {
    const cell = (e.target as HTMLElement).closest('.cell')
    const root = rootRef.value
    if (!cell || !root) return

    const cellRect = cell.getBoundingClientRect()
    const rootRect = root.getBoundingClientRect()

    column = col
    startX = e.clientX
    startWidth = cellRect.width
    cellLeft = cellRect.left - rootRect.left
    pendingWidth = startWidth
    indicatorLeft.value = cellLeft + startWidth

    isResizing.value = true
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }

  onBeforeUnmount(() => {
    stop()
    globalThis.removeEventListener('click', suppressClick, true)
  })

  return { isResizing, indicatorLeft, startResize }
}
