import { useLayoutConfigStore } from '@vek-element/ui'
import { startViewTransition } from '@vek-element/ui/utils'
import { nextTick } from 'vue'
import { type NavigationGuardWithThis, type Router, START_LOCATION } from 'vue-router'

/**
 * Promise, который резолвится, когда роут применён и vue перерисовал DOM
 *
 * `afterEach` вызывается сразу после применения роута — перерисовка к этому
 * моменту уже стоит в очереди, поэтому `nextTick` дождётся именно её.
 */
const whenRouteRendered = (router: Router) =>
  new Promise<void>((resolve) => {
    const stop = router.afterEach(async () => {
      stop()
      await nextTick()
      resolve()
    })
  })

/**
 * Гвард, который переключает страницу внутри View Transitions API
 *
 * Стоит на `beforeResolve` — то есть после того, как отработали остальные
 * гварды и догрузились компоненты страницы. Это принципиально: пока браузер
 * ждёт обновление DOM внутри перехода, он вообще ничего не рисует. Всё
 * медленное (сеть, чанк страницы, запросы в гвардах) к этому моменту уже
 * позади и происходит при живом интерфейсе, а внутри перехода остаётся
 * только применить роут и перерисоваться.
 *
 * Анимируется любая навигация — `router.push`, `<router-link>`, кнопки
 * «назад»/«вперёд» в браузере, — оборачивать вызовы не нужно.
 */
const viewTransitionBeforeResolve = (router: Router): NavigationGuardWithThis<undefined> => {
  return async (_to, from) => {
    // Первая навигация: приложение только что открылось, анимировать нечего
    if (from === START_LOCATION) return

    if (!useLayoutConfigStore().viewTransition.enabled) return

    await new Promise<void>((releaseNavigation) => {
      void startViewTransition(async () => {
        const rendered = whenRouteRendered(router)

        // Отпускаем навигацию: роут применится и перерисуется уже внутри
        // перехода, и попадёт в снимок «после»
        releaseNavigation()

        await rendered
      })
    })
  }
}

export { viewTransitionBeforeResolve }
