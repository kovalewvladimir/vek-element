import { Component } from 'vue'
import { RouteRecordRaw } from 'vue-router'

type AsyncLoadComponent = () => Promise<{ default: Component }>

interface IRouteMetaCustom extends Record<string | number | symbol, unknown> {
  /** Исходное имя роута */
  name: string

  /** Имя для меню */
  title: string

  /** Иконка для меню */
  icon?: string

  /** Скрыть в меню */
  hidden: boolean

  /** Показывать в хлебных крошках (breadcrumb) */
  breadcrumb: boolean

  /** Кэшировать компонент */
  cache: boolean

  /** Дополнительные роли */
  roles?: Record<string, { description: string }>
}

interface IAppRouteRecordRaw extends Omit<RouteRecordRaw, 'meta' | 'children'> {
  /** Имя роута
   *
   * Должно быть уникальным
   */
  name: string

  /** Путь */
  path: string

  /** Мета данные */
  meta: IRouteMetaCustom

  /** Компонент для отображения */
  component?: Component

  /** Дочерние элементы */
  children?: IAppRouteRecordRaw[]
}

declare module 'vue-router' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface RouteMeta extends IRouteMetaCustom {}
}

export type { AsyncLoadComponent, IAppRouteRecordRaw, IRouteMetaCustom }
