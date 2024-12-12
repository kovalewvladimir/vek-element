import { Component, createApp } from 'vue'

import {
  type IInitialLayout,
  type INavigation,
  initializeLayoutConfigStore,
  initializeNavigationStore,
  initializeUserStore,
  type IUserInfo
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

  /** TODO: Подумать */
  auth: {
    /** Получение данных о пользователя */
    getUser: () => Promise<IUserInfo>
  }

  /** Навигация */
  navigation: INavigation[]
}

/**
 * Создание приложения
 */
const createUI = (config: IConfig) => {
  const app = createApp(config.root.component)

  const router = initializeRouter(config.navigation)
  initializeLayoutConfigStore(config.layout)
  initializeUserStore(config.auth.getUser)
  initializeNavigationStore(router, config.navigation)

  app.use(router)
  app.mount(config.root.container)
}

export { createUI }
