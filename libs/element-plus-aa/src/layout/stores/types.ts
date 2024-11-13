interface IMenuItem {
  name: string
  url?: string
  meta: {
    title: string
    icon?: string
    hidden?: boolean
  }
  children?: IMenuItem[]
}

export type { IMenuItem }
