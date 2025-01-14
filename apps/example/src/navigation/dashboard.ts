import { type INavigation, VuLayout } from '@vek-element/ui'

const navigation: INavigation = {
  name: 'dashboard',
  component: VuLayout,
  title: '',
  path: '/dashboard',
  breadcrumb: false,
  hidden: true,
  children: [
    {
      type: 'root',
      name: 'the-dashboard',
      path: '',
      title: 'Главная',
      icon: 'el-icon-menu',
      affix: true,
      cache: false,
      breadcrumb: false,
      component: () => import('@/views/the-dashboard.vue')
    }
  ]
}

export default navigation
