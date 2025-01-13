import 'dayjs/locale/ru'

import { type Component, createApp, type Plugin } from 'vue'

import {
  type IAuth,
  type IInitialLayout,
  type INavigation,
  initializeLayoutConfigStore,
  initializeNavigationStore,
  initializeUserStore
} from './layout'
import { initializeRouter } from './routers'

interface IConfig {
  /** Конфигурация корневого компонента */
  root: {
    /** Компонент */
    component: Component

    /** Селектор контейнера */
    container: string
  }

  /** Плагины vue */
  plugins?: Plugin[]

  /** Конфигурация layout */
  layout: IInitialLayout

  /**
   * Конфигурация авторизации
   *
   * Нужно реализовать интерфейс IAuth
   *
   *
   * @example
   *   class Auth implements IAuth {
   *     private _isLogin = true
   *
   *     getUser = async () => {
   *       if (!this._isLogin)
   *         throw new Error('User not authorized')
   *       return userInfo
   *     }
   *
   *     login = () => {
   *       this._isLogin = true
   *     }
   *
   *     logout = () => {
   *      this._isLogin = false
   *     }
   *  }
   * */
  auth: IAuth

  /** Навигация */
  navigation: INavigation[]
}

/** Создание приложения */
const createUI = (config: IConfig) => {
  const app = createApp(config.root.component)

  const router = initializeRouter(config.navigation)
  initializeLayoutConfigStore(config.layout)
  initializeUserStore(config.auth, config.layout.defaultAvatar)
  initializeNavigationStore(router, config.navigation)

  if (config.plugins) {
    for (const plugin of config.plugins) {
      app.use(plugin)
    }
  }

  app.use(router)
  app.mount(config.root.container)
}

export { createUI }
