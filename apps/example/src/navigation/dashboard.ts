import { ElaLayout, type INavigation } from 'element-plus-aa'

const navigation: INavigation = {
  name: 'dashboard',
  component: ElaLayout,
  title: '',
  path: '/dashboard',
  breadcrumb: false,
  hidden: true,
  children: [
    {
      name: 'the-dashboard',
      path: '',
      title: 'Главная',
      icon: 'el-icon-menu',
      cache: false,
      breadcrumb: false,
      component: () => import('@/views/the-dashboard.vue')
    }
  ]
}

export default navigation
