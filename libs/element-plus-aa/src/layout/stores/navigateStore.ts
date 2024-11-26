import { Reactive, reactive, unref, watch } from 'vue'
import { Router } from 'vue-router'

import type { IAppRouteRecordRaw, IRouteMetaCustom } from '../../routers/types'

interface IMenuItem {
  name: string
  fullPath?: string
  title: string
  icon?: string
  hidden?: boolean
  children?: IMenuItem[]
}

interface IMenu {
  active: string
  items: IMenuItem[]
}

interface ITag {
  items: ITagItem[]
}

interface ITagItem {
  title: string
  path: string
  route: {
    name: string
    meta: IRouteMetaCustom
  }
}

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
      fullPath: route.component ? fullPath : undefined,
      title: route.meta.title,
      icon: route.meta.icon,
      hidden: route.meta.hidden,
      children: route.children ? convertRouteToMenuItem(route.children, fullPath) : undefined
    }
    return menuItem
  })
}

class NavigationStore {
  private _router?: Router

  private _menu: Reactive<IMenu>
  private _tag: Reactive<ITag>

  constructor() {
    this._menu = reactive({
      active: '',
      items: []
    })
    this._tag = reactive({
      items: []
    })
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
      await this.router.isReady()

      this.syncMenuWithCurrentRoute()
      this.registerCurrentRouteTags()
    })

    this._router = router
  }

  get tagItems(): readonly ITagItem[] {
    return this._tag.items
  }

  /**
   * Регистрация вкладки текущего роута
   * */
  registerCurrentRouteTags() {
    const currentRoute = unref(this.router.currentRoute)
    const paramsId = currentRoute.params.id as string | undefined

    const title = currentRoute.meta.title + (paramsId ? ` - ${paramsId}` : '')
    const path = currentRoute.fullPath

    if (this._tag.items.some((item) => item.path === path)) return
    this._tag.items.push({
      title,
      path,
      route: { name: currentRoute.name as string, meta: currentRoute.meta }
    })
  }

  /**
   * Синхронизация меню с текущим роутом
   * */
  syncMenuWithCurrentRoute() {
    const initName = this.router.currentRoute.value.name as string
    this._menu.active = initName
  }

  /**
   * Закрытие вкладки
   * */
  async closeTag(tag: ITagItem) {
    // Закрытие текущей вкладки
    const index = this._tag.items.findIndex((item) => item.path === tag.path)
    this._tag.items.splice(index, 1)

    // Переход на следующую вкладку, если закрыта текущая
    if (tag.path === this.router.currentRoute.value.fullPath) {
      const nextPath = this._tag.items[this._tag.items.length - 1]?.path || '/'
      await this.router.push(nextPath)
    }
  }
}

const navigationStore = new NavigationStore()
const useNavigationStore = () => navigationStore
export { useNavigationStore }
export type { IMenuItem, ITagItem }
