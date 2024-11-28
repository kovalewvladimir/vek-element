import { App } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

import {
  INavigation,
  initializeUserStore,
  IUserInfo,
  useLayoutConfigStore,
  useNavigationStore
} from './layout'
import { getInitialRouter, isAsyncLoadComponent } from './routers'
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

  /** TODO: Подумать */
  auth: {
    /** Получение данных о пользователя */
    getUser: () => Promise<IUserInfo>
  }

  /** Навигация */
  navigation: INavigation[]
}

/**
 * Поиск путей root и login
 */
const findPaths = (
  navigation: INavigation[],
  basePath: string = '/'
): { rootPath: string; login: ILoginRoute } => {
  let rootPath: string | undefined
  let login: ILoginRoute | undefined

  const searchPaths = (navigation: INavigation[], basePath: string) => {
    for (const route of navigation) {
      const fullPath = `${basePath}/${route.path}`.replace(/\/+/g, '/')

      if (route.isRoot) {
        if (rootPath) throw new Error('Multiple root paths found')
        rootPath = fullPath
      }

      if (route.isLogin) {
        if (login) throw new Error('Multiple login paths found')
        if (!route.component) throw new Error('Login path component not found')
        if (!isAsyncLoadComponent(route.component)) throw new Error('Login component is not async')
        login = {
          loader: route.component,
          path: fullPath
        }
      }

      if (route.children) searchPaths(route.children, fullPath)
    }
  }

  searchPaths(navigation, basePath)

  if (!rootPath) throw new Error('Root path not found')
  if (!login) throw new Error('Login path not found')

  return { rootPath, login }
}

/**
 * Создание приложения ELA
 */
const createEla = (config: IConfig) => {
  const layoutConfigStore = useLayoutConfigStore()
  const navigationStore = useNavigationStore()

  // Установка заголовка и логотипа
  if (config.layout?.title) layoutConfigStore.logo.setTitle(config.layout?.title)
  if (config.layout?.logo) layoutConfigStore.logo.setSvg(config.layout?.logo)
  document.title = layoutConfigStore.logo.title

  // Установка роутера
  const paths = findPaths(config.navigation)
  const router = createRouter({
    history: createWebHistory(),
    routes: getInitialRouter(paths.rootPath, paths.login)
  })
  router.beforeEach(permissionBeforeEach(paths.login.path))
  config.vueApp.use(router)

  // Инициализация UserStore
  initializeUserStore(config.auth.getUser)

  // Установка меню
  // TODO: сделать метод для установки меню
  navigationStore.setRouter(router)
  navigationStore.setAllNavigation(config.navigation)
}

export { createEla }
