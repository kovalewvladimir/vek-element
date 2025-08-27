import { type Reactive, reactive } from 'vue'

interface IInitialLayout {
  /** Заголовок */
  title: string

  /** Логотип
   *
   * Возможные значения:
   * - Путь к файлу в папке public
   * - SVG @vek-element/vite-svg
   */
  logo?: string

  /**
   * Аватар по умолчанию
   *
   * Файл должен находиться в папке public
   *
   * Любой формат изображения
   * */
  defaultAvatar: string
}

class Logo {
  private _title: string = 'DEMO'
  private _logo: string | null = null
  private _visible: boolean = true

  setLogo(logo: string | null) {
    this._logo = logo
  }

  get svg() {
    if (!this._logo) return null
    const length = this._logo.toLowerCase().split('.').length
    return length === 1 ? this._logo : null
  }
  get image() {
    if (!this._logo) return null
    const ext = this._logo.toLowerCase().split('.').pop()
    return ['jpg', 'jpeg', 'png', 'gif'].includes(ext || '') ? this._logo : null
  }

  get visible() {
    return this._visible
  }

  get title() {
    return this._title
  }
  setTitle(title: string) {
    this._title = title
  }
}

class Menu {
  private _collapse: boolean = false

  get collapse() {
    return this._collapse
  }
  setCollapse(collapsed: boolean) {
    this._collapse = collapsed
  }
}

class LayoutConfigStore {
  private readonly _logo: Reactive<Logo>
  private readonly _menu: Reactive<Menu>

  constructor() {
    this._logo = reactive(new Logo())
    this._menu = reactive(new Menu())
  }

  get logo() {
    return this._logo
  }
  get menu() {
    return this._menu
  }
}

const layoutConfigStore = new LayoutConfigStore()

const initializeLayoutConfigStore = (layout: IInitialLayout) => {
  if (layout?.title) layoutConfigStore.logo.setTitle(layout?.title)
  if (layout?.logo) layoutConfigStore.logo.setLogo(layout?.logo)
  document.title = layoutConfigStore.logo.title
}

const useLayoutConfigStore = () => layoutConfigStore

export { initializeLayoutConfigStore, useLayoutConfigStore }
export type { IInitialLayout }
