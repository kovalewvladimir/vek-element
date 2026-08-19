import { computed, type MaybeRef, type Ref, shallowRef, unref, watchEffect } from 'vue'

export type UseVirtualListItem<T> = { data: T; index: number }

interface UseVirtualListOptions {
  itemHeight: number | ((index: number) => number)
  overscan?: number
}

/**
 * Виртуальный список — внутренняя реализация, повторяющая поведение @vueuse/core useVirtualList.
 */
export function useVirtualList<T>(list: MaybeRef<T[]>, options: UseVirtualListOptions) {
  const { itemHeight, overscan = 5 } = options

  const containerRef = shallowRef<HTMLElement | null>(null)
  const state = shallowRef<{ start: number; end: number }>({ start: 0, end: 10 })
  const currentList = shallowRef<UseVirtualListItem<T>[]>([])

  /** Высота элемента по индексу */
  const getItemHeight = (index: number): number =>
    typeof itemHeight === 'number' ? itemHeight : itemHeight(index)

  /** Индекс первого видимого элемента для заданного scrollTop */
  const getOffset = (scrollTop: number): number => {
    if (typeof itemHeight === 'number') return Math.floor(scrollTop / itemHeight)
    let sum = 0
    let offset = 0
    const items = unref(list)
    for (let i = 0; i < items.length; i++) {
      sum += itemHeight(i)
      if (sum >= scrollTop) break
      offset++
    }
    return offset
  }

  /** Количество элементов, помещающихся в видимую область */
  const getViewCapacity = (containerHeight: number): number => {
    if (typeof itemHeight === 'number') return Math.ceil(containerHeight / itemHeight)
    let sum = 0
    let capacity = 0
    const { start = 0 } = state.value
    const items = unref(list)
    for (let i = start; i < items.length; i++) {
      sum += getItemHeight(i)
      capacity++
      if (sum > containerHeight) break
    }
    return capacity
  }

  /** Расстояние от верха контейнера до элемента с заданным индексом */
  const getDistanceTop = (index: number): number => {
    if (typeof itemHeight === 'number') return index * itemHeight
    return unref(list)
      .slice(0, index)
      .reduce((sum, _, i) => sum + (itemHeight as (i: number) => number)(i), 0)
  }

  let elScrollTopCache = 0
  let elClientHeightCache = 0
  /**
   * Кэш параметров контейнера.
   * Сохраняет последние валидные `scrollTop` и `clientHeight`, чтобы при временном `clientHeight = 0`
   * (например, когда элемент вне viewport) не занижать вычисляемый диапазон видимых элементов.
   */
  const getElData = () => {
    const el = containerRef.value
    if (!el) return { scrollTop: 0, clientHeight: 0 }

    const r = el.getBoundingClientRect()
    const isInViewport =
      r.bottom > 0 && r.right > 0 && r.top < window.innerHeight && r.left < window.innerWidth

    if (isInViewport) {
      elScrollTopCache = el.scrollTop
      elClientHeightCache = el.clientHeight
    }
    return { scrollTop: elScrollTopCache, clientHeight: elClientHeightCache }
  }

  let prevStart = -1
  let prevEnd = -1

  /**
   * Пересчитать диапазон видимых элементов.
   *
   * @param force Пересобрать безусловно, даже если диапазон не изменился.
   *   Обязателен для реактивного пересчёта и мутаций данных: без него ранний выход прервёт
   *   сбор зависимостей watchEffect, и список перестанет обновляться при изменении массива
   *   в пределах прежнего диапазона.
   */
  const calculateRange = (force = false) => {
    // Читаем всё до раннего выхода, иначе watchEffect потеряет зависимости
    const { scrollTop, clientHeight } = getElData()
    const items = unref(list)
    const offset = getOffset(scrollTop)
    const capacity = getViewCapacity(clientHeight)
    const from = Math.max(0, offset - overscan)
    const to = Math.min(items.length, offset + capacity + overscan)

    // Скролл в пределах высоты строки не сдвигает окно — пересобирать нечего.
    // state и currentList это shallowRef: новый объект/массив триггерит рендер всего тела таблицы
    if (!force && from === prevStart && to === prevEnd && currentList.value.length === to - from)
      return

    prevStart = from
    prevEnd = to

    state.value = { start: from, end: to }

    currentList.value = Array.from({ length: to - from }, (_, i) => ({
      data: items[from + i],
      index: from + i
    }))
  }

  // Пересчёт при изменении списка или контейнера
  watchEffect(() => calculateRange(true))

  const totalHeight = computed<number>(() => {
    const items = unref(list)
    if (typeof itemHeight === 'number') return items.length * itemHeight
    return items.reduce((sum, _, i) => sum + (itemHeight as (i: number) => number)(i), 0)
  })

  const offsetTop = computed<number>(() => getDistanceTop(state.value.start))

  const wrapperProps = computed(() => ({
    style: {
      width: '100%',
      height: `${totalHeight.value - offsetTop.value}px`,
      marginTop: `${offsetTop.value}px`
    }
  }))

  const onScroll = () => calculateRange()

  /**
   * Принудительно пересобрать видимый диапазон после мутации данных.
   *
   * Не класть в containerProps: они разворачиваются через v-bind, и лишний ключ
   * улетит в DOM как атрибут.
   */
  const invalidate = () => calculateRange(true)

  const scrollTo = (index: number) => {
    if (containerRef.value) {
      containerRef.value.scrollTop = getDistanceTop(index)
      calculateRange(true)
    }
  }

  return {
    list: currentList as Ref<UseVirtualListItem<T>[]>,
    scrollTo,
    invalidate,
    containerProps: {
      ref: containerRef,
      onScroll,
      style: { overflowY: 'auto' as const }
    },
    wrapperProps
  }
}
