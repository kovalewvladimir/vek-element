import { type INavigation } from '@vek-element/ui'

/** Вложенность пунктов меню */
const navigation: INavigation = {
  name: 'SubMenu',
  path: 'sub-menu',
  title: 'Sub Menu',
  icon: 'ep--expand',
  children: [
    {
      name: 'SubMenu1',
      path: '1',
      title: 'Sub Menu 1',
      icon: 'ep--expand',
      children: [
        {
          name: 'SubMenu1-1',
          path: '1',
          title: 'Sub Menu 1-1',
          icon: 'ep--document',
          component: () => import('@/views/layout/sub-menu/sub-menu-1-1.vue')
        },
        {
          name: 'SubMenu1-2',
          path: '2',
          title: 'Sub Menu 1-2',
          icon: 'ep--document',
          component: () => import('@/views/layout/sub-menu/sub-menu-1-2.vue')
        }
      ]
    }
  ]
}

export default navigation
