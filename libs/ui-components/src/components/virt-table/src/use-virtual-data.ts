import { useInfiniteScroll, useLoading, useVirtualList } from '@vek-element/ui-components/hooks'
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

  /** Загрузка данных */
  const getData = loadingWrapper(async () => {
    if (isAllDataLoaded.value) return

    const sort = columns.getSort()
    const filters = columns.getFilters()
    currentPage.value = currentPage.value + 1

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

    data.value.push(...loadedData)

    // Bugfix: не отображаются данные, если они все помещаются в контейнер без scroll`а.
    // Что бы они отобразились нужно принудительно сделать перерендер
    if (currentPage.value === 1) virtualContainerProps.onScroll()
  })
  const reloadData = () => {
    // vueuse v14.1.0 изменили поведение canLoadMore, теперь он стал реактивным.
    // поэтому вызывать gerData с reload: true больше не нужно, достаточно сбросить флаги и данные,
    // и canLoadMore сама вызовет useInfiniteScroll->onLoadMore.
    loading.value = true
    data.value = []
    currentPage.value = 0
    scrollTo(1) // 1 иначе не сработает canLoadMore
    isAllDataLoaded.value = false
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
  useInfiniteScroll(virtualContainerProps.ref, getData, {
    distance: infiniteScrollDistance,
    canLoadMore: () => !isAllDataLoaded.value && !isLoadingError.value
  })

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
