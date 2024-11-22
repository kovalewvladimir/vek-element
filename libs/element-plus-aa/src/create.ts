import { App } from 'vue'
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

import { useLayoutConfigStore, useNavigationStore } from './layout'
import type { IAppRouteRecordRaw } from './routers/types'

interface IConfig {
  layout?: IConfigLayout
  app: App
  routes: IAppRouteRecordRaw[]
}

interface IConfigLayout {
  /**
   * Заголовок
   */
  title?: string
  /**
   * Логотип (svg)
   */
  logo?: string
}

const createEla = (config: IConfig) => {
  const layoutConfigStore = useLayoutConfigStore()
  const navigationStore = useNavigationStore()

  if (config.layout?.title) layoutConfigStore.logo.setTitle(config.layout?.title)
  if (config.layout?.logo) layoutConfigStore.logo.setSvg(config.layout?.logo)

  const router = createRouter({
    history: createWebHistory(),
    routes: config.routes as RouteRecordRaw[]
  })

  navigationStore.setRouter(router)
  navigationStore.setMenuItems(config.routes)

  config.app.use(router)
}

export { createEla }
