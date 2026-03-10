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

  /** Пересчитать диапазон видимых элементов */
  const calculateRange = () => {
    const el = containerRef.value
    if (!el) return
    const items = unref(list)
    const offset = getOffset(el.scrollTop)
    const capacity = getViewCapacity(el.clientHeight)
    const from = Math.max(0, offset - overscan)
    const to = Math.min(items.length, offset + capacity + overscan)
    state.value = { start: from, end: to }
    currentList.value = items.slice(from, to).map((data, i) => ({ data, index: from + i }))
  }

  // Пересчёт при изменении списка или контейнера
  watchEffect(calculateRange)

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

  const scrollTo = (index: number) => {
    if (containerRef.value) {
      containerRef.value.scrollTop = getDistanceTop(index)
      calculateRange()
    }
  }

  return {
    list: currentList as Ref<UseVirtualListItem<T>[]>,
    scrollTo,
    containerProps: {
      ref: containerRef,
      onScroll,
      style: { overflowY: 'auto' as const }
    },
    wrapperProps
  }
}
