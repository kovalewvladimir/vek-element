import { type ComputedRef, type InjectionKey, type Ref } from 'vue'

/**
 * Опции контекстного меню (подмножество API, используемое virt-table).
 *
 * Компонент — облегчённая внутренняя замена `@imengyu/vue3-context-menu`,
 * покрывающая только нужный проекту сценарий. Оригинал: MIT, (c) 2021 梦欤
 * https://github.com/imengyu/vue3-context-menu
 */
export interface ContextMenuOptions {
  /** Координата X (clientX), от левого края окна */
  x?: number
  /** Координата Y (clientY), от верхнего края окна */
  y?: number
  /** Смещение по X относительно x */
  xOffset?: number
  /** Смещение по Y относительно y */
  yOffset?: number
  /** z-index корневого меню */
  zIndex?: number
  /** Имя css-темы (добавляется классом к `.mx-context-menu`) */
  theme?: string
  /** Автоматически удерживать меню в пределах окна. По умолчанию true */
  adjustPosition?: boolean
  /** Резервировать фиксированную ширину под иконку у пунктов без неё. По умолчанию true */
  preserveIconWidth?: boolean
}

/** Контекст корня меню — доступен всем вложенным пунктам/группам */
export interface MenuRootContext {
  theme: ComputedRef<string>
  zIndex: ComputedRef<number>
  preserveIconWidth: ComputedRef<boolean>
  adjustPosition: ComputedRef<boolean>
  /** Закрыть всё меню целиком */
  close: () => void
}
export const MENU_ROOT_KEY: InjectionKey<MenuRootContext> = Symbol('vt-context-menu-root')

/**
 * Контекст одного уровня меню (корень или подменю).
 * Хранит id активной (раскрытой) группы этого уровня, чтобы соседние
 * подменю закрывались автоматически.
 */
export interface MenuLevelContext {
  activeGroup: Ref<symbol | null>
  depth: number
}
export const MENU_LEVEL_KEY: InjectionKey<MenuLevelContext> = Symbol('vt-context-menu-level')

/** Отступ от края окна при авто-позиционировании (px) */
export const VIEWPORT_MARGIN = 8

/** SVG-путь галочки (viewBox 0 0 1024 1024) */
export const CHECK_PATH =
  'M129.3,428.6L52,512l345,372.5l575-620.8l-69.5-75L400.4,718.2L129.3,428.6z'

/** SVG-путь стрелки «вправо» у групп (viewBox 0 0 1024 1024) */
export const ARROW_PATH =
  'M307.018 49.445c11.517 0 23.032 4.394 31.819 13.18L756.404 480.18c8.439 8.438 13.181 19.885 13.181 31.82s-4.741 23.38-13.181 31.82L338.838 961.376c-17.574 17.573-46.065 17.573-63.64-0.001-17.573-17.573-17.573-46.065 0.001-63.64L660.944 512 275.198 126.265c-17.574-17.573-17.574-46.066-0.001-63.64C283.985 53.839 295.501 49.445 307.018 49.445z'
