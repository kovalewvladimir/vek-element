export type VuButtonIconType = 'default' | 'success' | 'warning' | 'info' | 'primary' | 'danger'

export interface IVuButtonIconBaseProps {
  /** Имя иконки */
  icon: string

  /**
   *  Размер иконки
   *
   * По умолчанию: `18`
   */
  iconSize?: number

  /**
   * Тип кнопки
   *
   * По умолчанию: `default`
   * */
  type?: VuButtonIconType

  /**
   * Определяет, является ли кнопка текстовой
   * По умолчанию: false
   */
  text?: boolean

  /**
   * Определяет, всегда ли включён фон для текстовой кнопки
   * По умолчанию: false
   */
  bg?: boolean

  /**
   * Определяет, является ли кнопка ссылкой
   * По умолчанию: false
   */
  link?: boolean

  /**
   * Определяет, заблокирована ли кнопка
   *
   * Подсказка `tooltip` продолжает работать в заблокированном состоянии
   *
   * По умолчанию: false
   */
  disabled?: boolean
}

export interface IVuButtonIconProps extends IVuButtonIconBaseProps {
  /**
   * Текст подсказки
   *
   * Если подсказка не задана, компонент рендерит только `el-button`
   * (без обёртки в `el-tooltip`) — единственный корневой элемент,
   * поэтому кнопку можно использовать в `#reference` у `el-popconfirm`
   * и других попперов
   *
   * По умолчанию: `''`
   * */
  tooltip?: string

  /**
   * Время перед показом подсказки ms
   *
   * По умолчанию: `500` ms
   * */
  tooltipShowAfter?: number
}
