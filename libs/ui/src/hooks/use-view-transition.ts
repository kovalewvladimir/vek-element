import { useLayoutConfigStore } from '@vek-element/ui'
import {
  isViewTransitionSupported,
  startViewTransition,
  type ViewTransitionUpdate
} from '@vek-element/ui/utils'
import { computed, type ComputedRef } from 'vue'

/**
 * Хук анимации перехода — View Transitions API
 *
 * Оборачивает смену DOM в `document.startViewTransition`: браузер снимает
 * страницу «до» и «после» и кросс-фейдит их (см. `styles/view-transition.css`).
 *
 * Навигацию оборачивать не нужно — кит анимирует её сам, гвардом на
 * `beforeResolve`. Хук нужен для остального DOM: раскрытие панели, смена
 * раскладки, перестановка списка.
 *
 * Переходы не накладываются друг на друга: пока играет анимация, вызовы
 * копятся и применяются одним следующим переходом.
 *
 * Анимацию можно выключить глобально:
 * - при инициализации — `createUI({ layout: { viewTransition: false } })`
 * - в рантайме — `useLayoutConfigStore().viewTransition.setEnabled(false)`
 *
 * @example
 *   const { start } = useViewTransition()
 *
 *   await start(() => (isOpen.value = !isOpen.value))
 */
export const useViewTransition = (): {
  /** Анимация включена в конфиге и поддерживается браузером */
  isEnabled: ComputedRef<boolean>

  /** Выполнить изменение DOM с анимацией */
  start: (update: ViewTransitionUpdate) => Promise<void>
} => {
  const config = useLayoutConfigStore()

  const isEnabled = computed(() => config.viewTransition.enabled && isViewTransitionSupported())

  const start = async (update: ViewTransitionUpdate) => {
    if (!config.viewTransition.enabled) {
      await update()
      return
    }
    await startViewTransition(update)
  }

  return { isEnabled, start }
}
