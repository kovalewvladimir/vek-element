import { type INavigation } from 'element-plus-aa'

const navigation: INavigation = {
  name: 'SubMenu',
  path: '/sub-menu',
  title: 'Sub Menu',
  icon: 'el-icon-menu',
  children: [
    {
      name: 'SubMenu1',
      path: '1',
      title: 'Sub Menu 1',
      icon: 'el-icon-menu',
      children: [
        {
          name: 'SubMenu1-1',
          path: '1',
          title: 'Sub Menu 1-1',
          icon: 'el-icon-menu',
          component: () => import('@/views/sub-menu/sub-menu-1-1.vue')
        },
        {
          name: 'SubMenu1-2',
          path: '2',
          title: 'Sub Menu 1-2',
          icon: 'el-icon-menu',
          component: () => import('@/views/sub-menu/sub-menu-1-2.vue')
        }
      ]
    }
  ]
}

export default navigation
