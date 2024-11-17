import { Component } from 'vue'
import { RouteRecordRaw } from 'vue-router'

interface IRouteMetaCustom extends Record<string | number | symbol, unknown> {
  /** Имя для меню */
  title: string
  /** Иконка для меню */
  icon?: string
  /** Скрыть в меню */
  hidden?: boolean
}

interface IAppRouteRecordRaw extends Omit<RouteRecordRaw, 'meta' | 'children'> {
  /**
   * Имя компонента.
   * Должен совпадать с именем компонента.
   * Иначе не будет работать кэширование компонента.
   * */
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

export type { IAppRouteRecordRaw, IRouteMetaCustom }
