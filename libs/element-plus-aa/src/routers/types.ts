import { Component } from 'vue'
import { RouteRecordRaw } from 'vue-router'

interface IRouteMetaCustom extends Record<string | number | symbol, unknown> {
  /** Имя для меню */
  title: string
  /** Иконка для меню */
  icon: string
  /** Скрыть в меню */
  hidden?: boolean
}

interface IAppRouteRecordRaw extends Omit<RouteRecordRaw, 'meta' | 'children'> {
  /**
   * Имя компонента.
   * Должен совпадать с именем компонента в файле.
   * Иначе не будет работать кэширование компонента.
   * */
  name: string
  /** Путь */
  path: string
  meta: IRouteMetaCustom
  /** Компонент для отображения */
  component?: Component
  /** Кэшировать компонент */
  cache?: boolean
  /** Дочерние элементы */
  children?: IAppRouteRecordRaw[]
}

export type { IAppRouteRecordRaw }