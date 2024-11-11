import { App } from 'vue'
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

import type { IAppRouteRecordRaw } from '../../routers/types'
import { useLayoutConfigStore } from './layoutConfigStore'
import { useNavigationStore } from './navigateStore'

const layoutConfigStore = useLayoutConfigStore()

interface IConfigStore {
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

const createEla = (config: IConfigStore) => {
  if (config.layout?.title) layoutConfigStore.logo.setTitle(config.layout?.title)
  if (config.layout?.logo) layoutConfigStore.logo.setSvg(config.layout?.logo)

  const router = createRouter({
    history: createWebHistory(),
    routes: config.routes as RouteRecordRaw[]
  })

  const navigationStore = useNavigationStore()
  navigationStore.setRouter(router)
  navigationStore.setMenuItems(config.routes)

  config.app.use(router)
}

export { createEla, useLayoutConfigStore, useNavigationStore }
