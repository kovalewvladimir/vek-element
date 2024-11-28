import { Component, Reactive, reactive, unref, watch } from 'vue'
import { Router, RouteRecordRaw } from 'vue-router'

import {
  createWrapperComponentRouterParams,
  generateUniqueNameComponent,
  isAsyncLoadComponent
} from '../../routers'
import type { AsyncLoadComponent, IAppRouteRecordRaw, IRouteMetaCustom } from '../../routers/types'
import { randomString } from '../../utils/random'

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

interface INavigation {
  /** Имя
   *
   *  Должно быть уникальным
   */
  name: string

  /** Путь */
  path: string

  /** Редирект */
  redirect?: string

  /** Имя для меню */
  title: string

  /** Иконка для меню */
  icon?: string

  /**
   * Показывать в хлебных крошках (breadcrumb)
   *
   * default - true
   */
  breadcrumb?: boolean

  /**
   * Скрыть в меню
   *
   * Если есть дочерние элементы, то они будут показаны
   *
   * default - false
   */
  hidden?: boolean

  /**
   * Кэшировать компонент
   * Компоненты с параметризованными путями кэшируются всегда
   *
   * default - true
   */
  cache?: boolean

  /**
   * Главная страница
   *
   * с / будет редирект на эту страницу
   *
   * Должен быть только один
   * */
  isRoot?: boolean

  /**
   * Страница логина
   *
   * Должен быть только один
   * */
  isLogin?: boolean

  /**
   * Компонент для отображения
   *
   * Компоненты не должны повторяться
   *
   * Если путь содержит параметры, то компонент будет обернут в компонент в котором реализовано кэширование
   * см createWrapperComponentRouterParams
   */
  component?: AsyncLoadComponent | Component

  /** Дочерние элементы */
  children?: INavigation[]
}

const convertNavigationToRoute = (navigation: INavigation[]): IAppRouteRecordRaw[] => {
  const seenNames = new Set<string>()
  const seenComponent = new Set<string>()

  const convert = (nav: INavigation): IAppRouteRecordRaw => {
    const name = nav.name
    const newName = `${name}-${randomString()}`

    // Проверка на дубликаты имен
    // Нужно для ролевой модели тк имя будет ключом для доступа
    if (seenNames.has(name)) {
      throw new Error(`Duplicate navigation name detected: ${name}`)
    }
    seenNames.add(name)
    // Проверка на дубликаты компонентов
    // Нужно для кэширования компонентов,
    // если компоненты повторяются и у них разные параметры кэширования,
    // то это может привести к непредсказуемому поведению.
    if (nav.component && isAsyncLoadComponent(nav.component)) {
      const _component = nav.component.toString()
      if (seenComponent.has(_component)) {
        throw new Error(`Duplicate navigation component detected: ${_component}`)
      }
      seenComponent.add(_component)
    }
    // Проверка на динамический путь без кэширования
    // Компоненты с динамическими путями должны быть кэшированы
    // тк в createWrapperComponentRouterParams не реализована логика отключения кэширования
    if (nav.path.includes(':') && nav.cache === false) {
      throw new Error(`Component with dynamic path should be cached: ${name}`)
    }

    // Обертка компонента для параметризованных путей и уникальных имен роутов
    let component: Component | undefined = nav.component
    if (nav.component && isAsyncLoadComponent(nav.component)) {
      if (nav.path.includes(':')) {
        component = createWrapperComponentRouterParams(newName, nav.component)
      } else {
        component = generateUniqueNameComponent(newName, nav.component)
      }
    }

    return {
      name: newName,
      path: nav.path,
      redirect: nav.redirect,
      meta: {
        title: nav.title,
        icon: nav.icon,
        breadcrumb: nav.breadcrumb ?? true,
        hidden: nav.hidden ?? false,
        cache: nav.cache ?? true
      },
      component: component,
      children: nav.children ? nav.children.map(convert) : undefined
    }
  }

  return navigation.map(convert)
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

  private _isWatch = false
  private _allNavigation: INavigation[] | null = null

  private _menu: Reactive<IMenu> = reactive({
    active: '',
    items: []
  })
  private _tag: Reactive<ITag> = reactive({
    items: []
  })

  /**
   * Инициализация слежения за роутером
   * */
  _initializeRouteWatcher() {
    // Защита от повторной инициализации
    if (this._isWatch) throw new Error('useNavigationStore: Route watcher already initialized')
    this._isWatch = true

    // Синхронизация меню с текущим роутом
    watch(this.router.currentRoute, async () => {
      await this.router.isReady()

      this.syncMenuWithCurrentRoute()
      this.registerCurrentRouteTags()
    })
  }

  get menuActive() {
    return this._menu.active
  }

  get menuItems(): readonly IMenuItem[] {
    return this._menu.items
  }

  get navigation(): INavigation[] {
    if (!this._allNavigation) throw new Error('useNavigationStore: Navigation is not initialized')
    return this._allNavigation
  }

  setAllNavigation(navigation: INavigation[]) {
    this._allNavigation = navigation
  }

  generateMenu() {
    // this.router.clearRoutes()

    const routes = convertNavigationToRoute(this.navigation)
    routes.forEach((route) => this.router.addRoute(route as RouteRecordRaw))
    this._menu.items = convertRouteToMenuItem(routes)
    this._initializeRouteWatcher()
  }

  get router(): Router {
    if (!this._router) throw new Error('useNavigationStore: Router is not initialized')
    return this._router
  }
  setRouter(router: Router) {
    if (this._router) return
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
export type { IMenuItem, INavigation, ITagItem }
