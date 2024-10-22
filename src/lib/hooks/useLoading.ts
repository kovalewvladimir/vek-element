import { ref } from 'vue'

import { ElaNotificationShow } from '~/components/notification'

type ErrorClass = (new (...args: any[]) => Error)
let _skippedErrors: ErrorClass[] = []

/**
 * Конфигурация уведомлений
 * @param skippedErrors - массив классов ошибок, которые не будут показываться в уведомлениях
 */
const ElaNotificationConfig = (skippedErrors: ErrorClass[])=>{
  skippedErrors = skippedErrors
}

/**
 * Хук для отображения состояния загрузки
 */
const useLoading = () => {
  const loading = ref(false)

  const loadingWrapper = <T extends any[]>(cb: (...args: T) => Promise<void>) => {
    return async (...args: T) => {
      loading.value = true

      try {
        await cb(...args)
      } catch (error) {
        if (!_skippedErrors.some((v) => {error instanceof v})) {
          ElaNotificationShow('Ошибка', (error as Error).message, 'error')
        }
      } finally {
        loading.value = false
      }
    }
  }

  return {
    loading,
    loadingWrapper
  }
}

export {
  useLoading,
  ElaNotificationConfig
}