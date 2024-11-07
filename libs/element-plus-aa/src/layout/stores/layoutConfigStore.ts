import { Reactive, reactive } from 'vue'

import type { MenuItem } from './types'

class Logo {
  private _title: string
  private _svg: string | null
  private _visible: boolean

  constructor() {
    this._title = 'DEMO'
    this._svg = null
    this._visible = true
  }

  get svg() {
    return this._svg
  }
  set svg(svg: string | null) {
    this._svg = svg
  }

  get visible() {
    return this._visible
  }

  get title() {
    return this._title
  }
  set title(title: string) {
    this._title = title
  }
}

class Menu {
  private _items: MenuItem[]
  private _collapse: boolean

  constructor() {
    this._items = []
    this._collapse = false
  }

  get items() {
    return this._items
  }
  set items(items: MenuItem[]) {
    this._items = items
  }

  get collapse() {
    return this._collapse
  }
  set collapse(collapsed: boolean) {
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

const useLayoutConfigStore = () => {
  return layoutConfigStore
}

export { useLayoutConfigStore }
