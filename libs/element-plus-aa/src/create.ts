import { App, Component } from 'vue'
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

import { useLayoutConfigStore, useNavigationStore } from './layout'
import {
  AsyncLoadComponent,
  createWrapperComponentRouterParams,
  generateUniqueNameComponent
} from './routers'
import type { IAppRouteRecordRaw } from './routers/types'
import { randomString } from './utils/random'

interface IConfig {
  layout?: IConfigLayout
  app: App
  navigation: INavigation[]
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
   * */
  hidden?: boolean

  /**
   * Кэшировать компонент
   * Компоненты с параметризованными путями кэшируются всегда
   *
   * default - true
   * */
  cache?: boolean

  /**
   * Компонент для отображения
   *
   * Компоненты не должны повторяться
   *
   * Если путь содержит параметры, то компонент будет обернут в компонент в котором реализовано кэширование
   * см createWrapperComponentRouterParams
   * */
  component?: AsyncLoadComponent | Component

  /** Дочерние элементы */
  children?: INavigation[]
}

/** Проверка на асинхронную загрузку компонента */
const isAsyncLoadComponent = (
  component: AsyncLoadComponent | Component
): component is AsyncLoadComponent => {
  return typeof component === 'function'
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

const createEla = (config: IConfig) => {
  const layoutConfigStore = useLayoutConfigStore()
  const navigationStore = useNavigationStore()

  document.title = config.layout?.title ?? 'DEMO'

  if (config.layout?.title) layoutConfigStore.logo.setTitle(config.layout?.title)
  if (config.layout?.logo) layoutConfigStore.logo.setSvg(config.layout?.logo)

  const routes = convertNavigationToRoute(config.navigation)

  const router = createRouter({
    history: createWebHistory(),
    routes: routes as RouteRecordRaw[]
  })

  navigationStore.setRouter(router)
  navigationStore.setMenuItems(routes)

  config.app.use(router)
}

export { createEla }
export type { INavigation }
