import { Reactive, reactive } from 'vue'

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
  setSvg(svg: string | null) {
    this._svg = svg
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
  private _collapse: boolean

  constructor() {
    this._collapse = false
  }

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
const useLayoutConfigStore = () => layoutConfigStore
export { useLayoutConfigStore }
