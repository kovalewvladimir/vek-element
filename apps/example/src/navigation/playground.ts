import { type INavigation, VuLayout } from '@vek-element/ui'

const navigation: INavigation = {
  name: 'Playground',
  path: '/playground',
  title: 'Playground',
  icon: 'el-icon-menu',
  component: VuLayout,
  children: [
    {
      name: 'ThePlayground',
      path: '',
      title: 'Playground',
      icon: 'el-icon-menu',
      component: () => import('@/views/playground/the-playground.vue')
    }
  ]
}

export default navigation
