import {
  type AsyncLoadComponent,
  createWrapperComponentRouterParameters,
  findNavigation,
  generateUniqueNameComponent,
  getLoginRouter,
  getNotFound,
  getRootRouter,
  type IAppRouteRecordRaw,
  type IRouteMetaCustom
} from '@vek-element/ui'
import {
  isAsyncLoadComponent,
  isNull,
  isUndefined,
  joinPath,
  randomString,
  trimEndPath
} from '@vek-element/ui/utils'
import {
  type Component,
  computed,
  type ComputedRef,
  type Reactive,
  reactive,
  unref,
  watch
} from 'vue'
import { type NavigationFailure, type Router, type RouteRecordRaw } from 'vue-router'

import { type Roles } from './user'

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
  affix: boolean
  route: {
    name: string
    path: string
    meta: IRouteMetaCustom
  }
}

interface INavigation {
  /**
   * Тип страницы
   *
   *
   * Определяет специальное поведение страницы:
   * - root: главная страница, редирект с /
   * - login: страница авторизации
   * - notFound: страница 404
   */
  type?: 'root' | 'login' | 'notFound'

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

  /** Всегда закреплен в тегах (по умолчанию false) */
  affix?: boolean

  /** Показывать в тегах (tag) (по умолчанию true) */
  tag?: boolean

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
    const cache = nav.cache ?? true
    const tag = nav.tag ?? true
    const uniqueName = `${name}-${randomString()}`

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

    // Нужно явно указать при выключенном теге, что кэширование отключено
    // тк если выключен тег, то кэширование не будет работать в любом случае
    if (!tag && cache) {
      throw new Error(`Tag is disabled, but cache is enabled: ${name}`)
    }

    // Проверка на наличие компонента
    // Компонент должен быть указан у всех путей
    // Исключение для вложенных путей, у которых есть дочерние элементы, но тогда
    // должен быть указан children
    if (!nav.component && !nav.children) {
      throw new Error(`Component is not defined: ${name}`)
    }

    // Проверка на доступность пункта меню по ролям
    // Если роль не найдена или у пункта меню указан тип, то пропускаем
    // Пути у которых есть тип должны быть доступны всем (Главная, Авторизация, 404 и тд)
    const isNavType = isNull(findNavigation([nav], (n) => !isUndefined(n.type)))
    if (isNavType && !rolesKeys.includes(name)) return null

    // Обертка компонента для параметризованных путей и уникальных имен роутов
    let component: Component | undefined = nav.component
    if (nav.component && isAsyncLoadComponent(nav.component)) {
      component = nav.path.includes(':')
        ? createWrapperComponentRouterParameters(uniqueName, nav.component)
        : generateUniqueNameComponent(uniqueName, nav.component)
    }

    return {
      name: uniqueName,
      path: nav.path,
      redirect: nav.redirect,
      meta: {
        name: name,
        title: nav.title,
        icon: nav.icon,
        affix: nav.affix ?? false,
        tag: tag,
        breadcrumb: nav.breadcrumb ?? true,
        hidden: nav.hidden ?? false,
        cache: cache,
        roles: nav.roles
      },
      component: component,
      children: nav.children
        ? nav.children.map((element) => convert(element)).filter((v) => !isNull(v))
        : undefined
    }
  }

  return navigation.map((element) => convert(element)).filter((v) => !isNull(v))
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
    const fullPath = joinPath(basePath, route.path)
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
  private _routerBase: {
    login: RouteRecordRaw
    root: RouteRecordRaw
    notFound: RouteRecordRaw
  }

  private _isRouteWatchActive = false
  private _navigationItems: INavigation[]
  private _cachedComponentNameList: ComputedRef<string[]>

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

    this._routerBase = {
      login: getLoginRouter(this._navigationItems),
      root: getRootRouter(this._navigationItems),
      notFound: getNotFound(this._navigationItems)
    }

    this._cachedComponentNameList = computed(() => {
      const setComponentNames = new Set<string>()
      for (const item of this.tagItems) {
        if (item.route.meta.cache) {
          setComponentNames.add(item.route.name)
        }
      }
      return [...setComponentNames]
    })
  }

  /** Инициализация слежения за роутером */
  _initializeRouteWatcher() {
    // Защита от повторной инициализации
    if (this._isRouteWatchActive) return
    this._isRouteWatchActive = true

    // Синхронизация меню с текущим роутом
    watch(this._router.currentRoute, async () => {
      await this._router.isReady()

      document.title = this._router.currentRoute.value.meta.title

      this._syncMenuWithCurrentRoute()
      this._registerCurrentRouteTags()
    })
  }

  /** Регистрация вкладки текущего роута */
  _registerCurrentRouteTags() {
    const currentRoute = unref(this._router.currentRoute)

    if (!currentRoute.meta.tag) return

    const id = currentRoute.params.id as string | undefined
    const title = currentRoute.meta.title + (id ? ` - ${id}` : '')
    const path = trimEndPath(currentRoute.fullPath)

    if (this._tag.items.some((item) => trimEndPath(item.path) === path)) return

    this._tag.items.push({
      title,
      path,
      affix: currentRoute.meta.affix,
      route: {
        name: currentRoute.name as string,
        path: this.findByName(currentRoute.meta.name)?.path || '',
        meta: currentRoute.meta
      }
    })
  }

  /** Синхронизация меню с текущим роутом */
  _syncMenuWithCurrentRoute() {
    const initName = this._router.currentRoute.value.name as string
    this._menu.active = initName
  }

  /** Поиск элемента навигации по имени */
  findByName(name: string): INavigation | null {
    return findNavigation(this._navigationItems, (n) => n.name === name)
  }

  /** Получение полного пути по имени */
  getFullPathByName(name: string): string | null {
    const routers = this._router.getRoutes()
    const route = routers.find((r) => r.meta.name === name)
    return route ? route.path : null
  }

  /** Переход к элементу. Если элемент не найден, то переход на дефолтный путь */
  async navigateToItem(
    name: string,
    defaultTo: string = '/'
  ): Promise<NavigationFailure | void | undefined> {
    const fullPath = this.getFullPathByName(name)
    if (!fullPath) return await this._router.push(defaultTo)
    return await this._router.push(fullPath)
  }

  /** Базовый роутер */
  get routerBase() {
    return this._routerBase
  }

  /** Активный пункт меню */
  get menuActive() {
    return this._menu.active
  }

  /** Элементы меню */
  get menuItems(): readonly IMenuItem[] {
    return this._menu.items
  }

  /** Вкладки */
  get tagItems(): readonly ITagItem[] {
    return this._tag.items
  }

  /** Список кэшируемых компонентов */
  get cachedComponentNameList(): ComputedRef<string[]> {
    return this._cachedComponentNameList
  }

  /** Инициализация меню */
  generateMenu(roles: Roles) {
    this._router.clearRoutes()

    const routes = convertNavigationToRoute(this._navigationItems, roles)
    if (routes.length === 0) {
      throw new Error('useNavigationStore: Navigation items is empty')
    }
    this._router.addRoute(this._routerBase.root)
    for (const route of routes) this._router.addRoute(route as RouteRecordRaw)
    this._router.addRoute(this._routerBase.notFound)
    this._menu.items = convertRouteToMenuItem(routes)
    this._initializeRouteWatcher()
  }

  /** Закрытие вкладки */
  async closeTag(tag: ITagItem) {
    // Закрытие текущей вкладки
    const index = this._tag.items.findIndex((item) => item.path === tag.path)
    this._tag.items.splice(index, 1)

    // Переход на следующую вкладку, если закрыта текущая
    if (tag.path === this._router.currentRoute.value.fullPath) {
      const nextPath = this._tag.items.at(-1)?.path || '/'
      await this._router.push(nextPath)
    }
  }

  /** Очистка вкладок */
  clearTags = () => {
    this._tag.items = []
  }

  /** Очистка меню */
  clearMenu = () => {
    this._menu.active = ''
    this._menu.items = []
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
