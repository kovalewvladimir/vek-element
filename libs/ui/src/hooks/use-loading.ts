import { VuNotificationShow } from '@vek-element/ui'
import { ref } from 'vue'

type ErrorClass = new (...args: any[]) => Error
let _skippedErrors: ErrorClass[] = []

/**
 * Конфигурация уведомлений
 * @param skippedErrors - массив классов ошибок, которые не будут показываться в уведомлениях
 */
const VuNotificationConfig = (skippedErrors: ErrorClass[]) => {
  _skippedErrors = skippedErrors
}

/**
 * Хук для отображения состояния загрузки
 */
const useLoading = (delay: number = 200, enableTimingLog: boolean = false) => {
  const loading = ref(false)
  let loadingTimeout: NodeJS.Timeout | null = null

  const loadingWrapper = <T extends any[]>(cb: (...args: T) => Promise<void>) => {
    return async (...args: T) => {
      loadingTimeout = setTimeout(() => {
        loading.value = true
      }, delay)

      try {
        if (enableTimingLog) console.time('loadingWrapper')
        await cb(...args)
        if (enableTimingLog) console.timeEnd('loadingWrapper')
      } catch (error) {
        if (!_skippedErrors.some((v) => error instanceof v)) {
          VuNotificationShow('Ошибка', (error as Error).message, 'error')
        }
      } finally {
        if (loadingTimeout) {
          clearTimeout(loadingTimeout)
        }
        loading.value = false
      }
    }
  }

  return {
    loading,
    loadingWrapper
  }
}

export { useLoading, VuNotificationConfig }
