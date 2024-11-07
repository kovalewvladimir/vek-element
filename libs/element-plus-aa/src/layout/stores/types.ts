interface MenuItem {
  name: string
  meta: {
    title: string
    icon: string
  }
  children?: MenuItem[]
}

export type { MenuItem }
