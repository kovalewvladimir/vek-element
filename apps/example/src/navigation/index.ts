import { type INavigation } from 'element-plus-aa'

import paramsNavigation from './params'
import scrollNavigation from './scroll'
import subMenuNavigation from './sub-menu'

const navigation: INavigation[] = [
  {
    name: 'the-main',
    path: '/',
    title: 'Главная',
    cache: false,
    icon: 'el-icon-menu',
    component: () => import('@/views/the-main.vue')
  },

  scrollNavigation,
  paramsNavigation,
  subMenuNavigation,

  ...Array.from({ length: 50 }).map((_, i) => ({
    name: `Empty${i}`,
    path: `/empty${i}`,
    title: `Empty${i}`
  }))
]

export { navigation }
