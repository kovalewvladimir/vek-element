import { Reactive, reactive, unref, watch } from 'vue'
import { Router } from 'vue-router'

import { IAppRouteRecordRaw } from '../../routers/types'
import { IMenuItem } from './types'

const convertRouteToMenuItem = (
  routes: IAppRouteRecordRaw[],
  basePath: string = '/'
): IMenuItem[] => {
  const seenNames = new Set<string>()

  return routes.map((route) => {
    // Проверка на дубликаты
    if (seenNames.has(route.name)) {
      throw new Error(`Duplicate route name detected: ${route.name}`)
    }
    seenNames.add(route.name)

    // Полный путь
    const fullPath = `${basePath}/${route.path}`.replace(/\/+/g, '/')
    // Создание элемента меню
    const menuItem: IMenuItem = {
      name: route.name,
      url: route.component ? fullPath : undefined,
      meta: {
        title: route.meta.title,
        icon: route.meta.icon,
        hidden: route.meta.hidden
      },
      children: route.children ? convertRouteToMenuItem(route.children, fullPath) : undefined
    }
    return menuItem
  })
}

interface IMenu {
  active: string
  items: IMenuItem[]
}

interface ITagItem {
  title: string
  path: string
}

class NavigationStore {
  private _router?: Router

  private _menu: Reactive<IMenu>
  private _tags: Reactive<ITagItem[]>

  constructor() {
    this._menu = reactive({
      active: '',
      items: []
    })
    this._tags = reactive([])
  }

  get menuActive() {
    return this._menu.active
  }

  get menuItems(): readonly IMenuItem[] {
    return this._menu.items
  }

  setMenuItems(items: IAppRouteRecordRaw[]) {
    this._menu.items = convertRouteToMenuItem(items)
  }

  get router(): Router {
    if (!this._router) throw new Error('useNavigationStore must be called with router')
    return this._router
  }
  setRouter(router: Router) {
    if (this._router) return

    // Синхронизация меню с текущим роутом
    watch(router.currentRoute, async () => {
      await this.syncMenuWithCurrentRoute()
      await this.registerCurrentRouteTags()
    })

    this._router = router
  }

  get tags(): readonly ITagItem[] {
    return this._tags
  }

  /**
   * Регистрация тегов текущего роута
   * */
  async registerCurrentRouteTags() {
    await this.router.isReady()
    const currentRoute = unref(this.router.currentRoute)
    const paramsId = currentRoute.params.id as string | undefined

    const title = (currentRoute.meta.title as string) + (paramsId ? ` - ${paramsId}` : '')
    const path = currentRoute.fullPath

    if (this._tags.some((item) => item.path === path)) return
    this._tags.push({ title, path })
  }

  /**
   * Синхронизация меню с текущим роутом
   * */
  async syncMenuWithCurrentRoute() {
    await this.router.isReady()
    const initName = this.router.currentRoute.value.name as string
    this._menu.active = initName
  }
}

const navigationStore = new NavigationStore()
const useNavigationStore = () => navigationStore
export { useNavigationStore }
