import { App } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

import {
  INavigation,
  initializeUserStore,
  IUserInfo,
  useLayoutConfigStore,
  useNavigationStore
} from './layout'
import { getInitialRouter } from './routers'
import { permissionBeforeEach } from './routers/hooks'
import type { ILoginRoute } from './routers/types'

interface IConfig {
  /** Конфигурация layout */
  layout?: {
    /** Заголовок */
    title?: string

    /** Логотип (svg) */
    logo?: string
  }

  /** Vue приложение */
  vueApp: App

  /** Рутовый редирект на страницу */
  rootRedirect: string

  /** TODO: Подумать */
  auth: {
    /** Получение данных о пользователя */
    getUser: () => Promise<IUserInfo>

    /** Страница логина */
    login: ILoginRoute
  }

  /** Навигация */
  navigation: INavigation[]
}

const createEla = (config: IConfig) => {
  const layoutConfigStore = useLayoutConfigStore()
  const navigationStore = useNavigationStore()

  // Установка заголовка и логотипа
  if (config.layout?.title) layoutConfigStore.logo.setTitle(config.layout?.title)
  if (config.layout?.logo) layoutConfigStore.logo.setSvg(config.layout?.logo)
  document.title = layoutConfigStore.logo.title

  // Установка роутера
  const router = createRouter({
    history: createWebHistory(),
    routes: getInitialRouter(config.rootRedirect, config.auth.login)
  })
  router.beforeEach(permissionBeforeEach(config.auth.login.path))
  config.vueApp.use(router)

  // Инициализация UserStore
  initializeUserStore(config.auth.getUser)

  // Установка меню
  // TODO: сделать метод для установки меню
  navigationStore.setRouter(router)
  navigationStore.setAllNavigation(config.navigation)
}

export { createEla }
