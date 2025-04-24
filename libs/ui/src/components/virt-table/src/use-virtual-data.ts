import { useLoading } from '@vek-element/ui'
import { useInfiniteScroll, useVirtualList } from '@vueuse/core'
import { type Ref, ref } from 'vue'

import { type Columns } from './column'
import { type OnLoadDataType } from './types'
import { injectFormatMetaData } from './utils'

export const useVirtualData = <T>(
  onLoadData: OnLoadDataType<T[]>,
  columns: Columns,
  sizePage: number,
  rowHeight: number,
  virtualListOverscan: number,
  infiniteScrollDistance: number
) => {
  const { loading, loadingWrapper } = useLoading()

  const isAllDataLoaded = ref(false)
  const isLoadingError = ref(false)

  const data: Ref<T[]> = ref([])
  const currentPage = ref(0)

  const DEFAULT_OPTIONS = { reload: false } as const
  /** Загрузка/Обновление данных */
  const getData = loadingWrapper(async (options: { reload: boolean } = DEFAULT_OPTIONS) => {
    if (isAllDataLoaded.value) return

    const sort = columns.getSort()
    const filters = columns.getFilters()
    currentPage.value = options.reload ? 1 : currentPage.value + 1

    let loadedData: T[]
    try {
      loadedData = await onLoadData({
        page: currentPage.value,
        size: sizePage,
        sort,
        filters
      })
      isLoadingError.value = false
    } catch (error) {
      isLoadingError.value = true
      throw error
    }

    if (loadedData.length < sizePage) isAllDataLoaded.value = true

    for (const v of loadedData) {
      injectFormatMetaData(v, columns)
    }

    if (options.reload) {
      scrollTo(0)
      data.value = loadedData
    } else {
      data.value.push(...loadedData)
    }

    // Bugfix: не отображаются данные, если они все помещаются в контейнер без scroll`а.
    // Что бы они отобразились нужно принудительно сделать перерендер
    if (currentPage.value === 1) virtualContainerProps.onScroll()
  })
  const reloadData = async () => {
    isAllDataLoaded.value = false
    await getData({ reload: true })
  }

  // Виртуальный список
  const {
    list: virtualData,
    scrollTo,
    containerProps: virtualContainerProps,
    wrapperProps: virtualWrapperProps
  } = useVirtualList(data, {
    itemHeight: rowHeight,
    overscan: virtualListOverscan
  })

  // Загрузка новых данных при scroll`е
  useInfiniteScroll(
    virtualContainerProps.ref,
    async () => {
      await getData()
    },
    {
      distance: infiniteScrollDistance,
      canLoadMore: () => !isAllDataLoaded.value && !isLoadingError.value
    }
  )

  return {
    loading,
    isAllDataLoaded,
    data,
    reloadData,
    currentPage,
    virtualData,
    virtualContainerProps,
    virtualWrapperProps
  }
}
