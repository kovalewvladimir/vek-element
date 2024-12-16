import { Component, createApp } from 'vue'

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

  app.use(router)
  app.mount(config.root.container)
}

export { createUI }
