import { type INavigation, VuLayout } from '@vek-element/ui'

const navigation: INavigation = {
  isRoot: true,
  name: 'dashboard',
  component: VuLayout,
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
