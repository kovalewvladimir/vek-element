import { readonly, type Ref, ref } from 'vue'
import { type Router } from 'vue-router'

/** Задержка перед показом индикатора, мс */
const SHOW_DELAY = 200

const isNavigating = ref(false)
let showTimeout: ReturnType<typeof setTimeout> | null = null

const clear = () => {
  if (showTimeout) clearTimeout(showTimeout)
  showTimeout = null
}

/**
 * Состояние индикатора загрузки страницы
 *
 * Становится `true`, если навигация идёт дольше {@link SHOW_DELAY} — обычный
 * переход в него укладывается, и индикатор не мигает почём зря. Долгой
 * навигация бывает, когда догружается чанк страницы или гвард ходит в сеть.
 *
 * Рисует индикатор `TheNavigationProgress` внутри layout.
 */
const useNavigationProgress = (): { isNavigating: Readonly<Ref<boolean>> } => ({
  isNavigating: readonly(isNavigating)
})

/** Подписывает индикатор загрузки на навигацию роутера */
const registerNavigationProgress = (router: Router) => {
  router.beforeEach(() => {
    clear()
    showTimeout = setTimeout(() => {
      isNavigating.value = true
    }, SHOW_DELAY)
  })

  // Вызывается и для прерванных навигаций, поэтому индикатор не залипнет
  router.afterEach(() => {
    clear()
    isNavigating.value = false
  })
}

export { registerNavigationProgress, useNavigationProgress }
