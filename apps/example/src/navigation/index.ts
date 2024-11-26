import { ElaLayout, type INavigation } from 'element-plus-aa'

import paramsNavigation from './params'
import scrollNavigation from './scroll'
import subMenuNavigation from './sub-menu'

const navigation: INavigation[] = [
  {
    name: 'root',
    path: '/',
    title: 'Root',
    redirect: '/main',
    hidden: true
  },
  {
    name: 'asd123',
    component: ElaLayout,
    title: 'asd123',
    path: '/main',
    breadcrumb: false,
    hidden: true,
    children: [
      {
        name: 'the-main',
        path: '',
        title: 'Главная',
        icon: 'el-icon-menu',
        cache: false,
        breadcrumb: false,
        component: () => import('@/views/the-main.vue')
      }
    ]
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
