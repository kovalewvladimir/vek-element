import { useLayoutConfigStore } from './layoutConfigStore'
import type { MenuItem } from './types'

const layoutConfigStore = useLayoutConfigStore()

interface ConfigLayout {
  /**
   * Заголовок
   */
  title?: string
  /**
   * Логотип (svg)
   */
  logo?: string
  /**
   * Меню
   */
  menu?: MenuItem[]
}

const createLayoutStore = (config: ConfigLayout) => {
  if (config.title) layoutConfigStore.logo.title = config.title
  if (config.logo) layoutConfigStore.logo.svg = config.logo
  if (config.menu) layoutConfigStore.menu.items = config.menu
}

export { createLayoutStore, useLayoutConfigStore }
