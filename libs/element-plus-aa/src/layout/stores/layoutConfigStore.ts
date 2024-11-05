import { Reactive, reactive } from 'vue'

class Logo {
  private _title: string
  private _img: string | null
  private _visible: boolean

  constructor() {
    this._title = 'DEMO'
    this._img = null
    this._visible = true
  }

  get img() {
    return this._img
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

class LayoutConfigStore {
  private readonly _logo: Reactive<Logo>

  constructor() {
    this._logo = reactive(new Logo())
  }

  get logo() {
    return this._logo
  }
}

export const layoutConfigStore = new LayoutConfigStore()
