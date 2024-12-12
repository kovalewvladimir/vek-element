import { Component, Reactive, reactive, unref, watch } from 'vue'
import { Router, RouteRecordRaw } from 'vue-router'

import {
  createWrapperComponentRouterParams,
  generateUniqueNameComponent,
  getNotFound,
  getRootRouter
} from '../../routers'
import type { AsyncLoadComponent, IAppRouteRecordRaw, IRouteMetaCustom } from '../../routers/types'
import { isAsyncLoadComponent, isNull, randomString } from '../../utils'
import type { Roles } from './user'

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
   * Страница 404
   *
   * Должен быть только один
   * */
  isNotFound?: boolean

  /**
   * Компонент для отображения
   *
   * Компоненты не должны повторяться
   *
   * Если путь содержит параметры, то компонент будет обернут в компонент в котором реализовано кэширование
   * см createWrapperComponentRouterParams
   */
  component?: AsyncLoadComponent | Component

  /**
   * Дополнительные роли доступа
   *
   * Ключ - имя роли
   * Значение - описание роли
   *
   * Роли по умолчанию:
   *  - RW - чтение и запись
   *  - RO - только чтение
   */
  roles?: Record<string, { description: string }>

  /** Дочерние элементы */
  children?: INavigation[]
}

/** Преобразование навигации в роуты */
const convertNavigationToRoute = (
  navigation: INavigation[],
  roles: Roles
): IAppRouteRecordRaw[] => {
  const seenNames = new Set<string>()
  const seenComponent = new Set<string>()

  const rolesKeys = Object.keys(roles)

  const convert = (nav: INavigation): IAppRouteRecordRaw | null => {
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

    // Проверка на доступность пункта меню по ролям
    if (!rolesKeys.includes(name)) return null

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
        name: name,
        title: nav.title,
        icon: nav.icon,
        breadcrumb: nav.breadcrumb ?? true,
        hidden: nav.hidden ?? false,
        cache: nav.cache ?? true,
        roles: nav.roles
      },
      component: component,
      children: nav.children ? nav.children.map(convert).filter((v) => !isNull(v)) : undefined
    }
  }

  return navigation.map(convert).filter((v) => !isNull(v))
}

/** Преобразование роутов в элементы меню */
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
  private _router: Router

  private _isRouteWatchActive = false
  private _navigationItems: INavigation[]

  private _menu: Reactive<IMenu> = reactive({
    active: '',
    items: []
  })
  private _tag: Reactive<ITag> = reactive({
    items: []
  })

  constructor(router: Router, navigation: INavigation[]) {
    this._router = router
    this._navigationItems = navigation
  }

  /**
   * Инициализация слежения за роутером
   * */
  _initializeRouteWatcher() {
    // Защита от повторной инициализации
    if (this._isRouteWatchActive)
      throw new Error('useNavigationStore: Route watcher already initialized')
    this._isRouteWatchActive = true

    // Синхронизация меню с текущим роутом
    watch(this._router.currentRoute, async () => {
      await this._router.isReady()

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

  generateMenu(roles: Roles) {
    this._router.clearRoutes()

    const routes = convertNavigationToRoute(this._navigationItems, roles)
    if (routes.length === 0) {
      throw new Error('useNavigationStore: Navigation items is empty')
    }
    this._router.addRoute(getRootRouter(this._navigationItems))
    routes.forEach((route) => this._router.addRoute(route as RouteRecordRaw))
    this._router.addRoute(getNotFound(this._navigationItems))
    this._menu.items = convertRouteToMenuItem(routes)
    this._initializeRouteWatcher()
  }

  get tagItems(): readonly ITagItem[] {
    return this._tag.items
  }

  /**
   * Регистрация вкладки текущего роута
   * */
  registerCurrentRouteTags() {
    const currentRoute = unref(this._router.currentRoute)
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
    const initName = this._router.currentRoute.value.name as string
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
    if (tag.path === this._router.currentRoute.value.fullPath) {
      const nextPath = this._tag.items[this._tag.items.length - 1]?.path || '/'
      await this._router.push(nextPath)
    }
  }
}

let navigationStore: NavigationStore | null = null

const initializeNavigationStore = (router: Router, navigation: INavigation[]) => {
  if (!isNull(navigationStore)) {
    throw new Error('NavigationStore is already initialized')
  }
  navigationStore = new NavigationStore(router, navigation)
}

const useNavigationStore = (): NavigationStore => {
  if (!navigationStore) {
    throw new Error('NavigationStore is not initialized')
  }
  return navigationStore
}

export { initializeNavigationStore, useNavigationStore }
export type { IMenuItem, INavigation, ITagItem }
