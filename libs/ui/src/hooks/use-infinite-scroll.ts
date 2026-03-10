import { type Ref, watchEffect } from 'vue'

interface UseInfiniteScrollOptions {
  /** Расстояние в пикселях до края, при котором запускается загрузка (по умолчанию 0) */
  distance?: number
  /**
   * Реактивная функция-предикат: разрешена ли следующая загрузка.
   * Если функция читает реактивные данные, то при их изменении
   * автоматически запускается повторная проверка — поведение как в @vueuse/core v14.1.0+.
   */
  canLoadMore?: (el: HTMLElement) => boolean
}

/**
 * Бесконечная прокрутка — внутренняя реализация, повторяющая поведение @vueuse/core useInfiniteScroll.
 *
 * Ключевые особенности:
 * - загружает данные при прокрутке к краю контейнера (distance)
 * - после успешной загрузки повторно проверяет, нужно ли грузить ещё
 *   (на случай когда содержимое умещается без скроллбара)
 * - canLoadMore реактивна: при изменении её зависимостей автоматически
 *   запускается проверка (аналог поведения VueUse v14.1.0+)
 */
export function useInfiniteScroll(
  el: Ref<HTMLElement | null>,
  onLoadMore: () => void | Promise<void>,
  options: UseInfiniteScrollOptions = {}
) {
  const { distance = 0, canLoadMore } = options

  let isLoading = false

  /** Проверить условие прокрутки и при необходимости загрузить данные */
  const checkAndLoad = async () => {
    const element = el.value
    if (!element || isLoading) return
    if (canLoadMore && !canLoadMore(element)) return

    const { scrollHeight, clientHeight, scrollTop } = element
    const scrollBottom = scrollHeight - clientHeight - scrollTop
    if (scrollBottom > distance) return

    isLoading = true
    try {
      await onLoadMore()
    } catch {
      // Ошибка обрабатывается внутри onLoadMore; canLoadMore после ошибки
      // вернёт false и загрузка не продолжится.
      return
    } finally {
      isLoading = false
    }

    // После успешной загрузки проверяем снова: возможно, данные поместились
    // в контейнер без появления скроллбара.
    void checkAndLoad()
  }

  const onScroll = () => void checkAndLoad()

  // Следим за элементом: подключаем/отключаем обработчик scroll и делаем
  // начальную проверку при монтировании.
  watchEffect((onCleanup) => {
    const element = el.value
    if (!element) return

    element.addEventListener('scroll', onScroll, { passive: true })
    void checkAndLoad()

    onCleanup(() => element.removeEventListener('scroll', onScroll))
  })

  // Следим за реактивными зависимостями canLoadMore.
  // Если canLoadMore читает реактивное состояние (например, isAllDataLoaded),
  // этот эффект перезапустится при его изменении и автоматически запустит загрузку.
  watchEffect(() => {
    const element = el.value
    if (!element) return
    if (canLoadMore && !canLoadMore(element)) return
    void checkAndLoad()
  })
}
