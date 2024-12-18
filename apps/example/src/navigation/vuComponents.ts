import { type INavigation, VuLayout } from '@vek-element/ui'

const navigation: INavigation = {
  name: 'TheComponents',
  path: '/vu-components',
  title: 'Components',
  icon: 'el-icon-menu',
  component: VuLayout,
  children: [
    {
      name: 'TheVuButtonIcon',
      path: 'vu-button-icon',
      title: 'VuButtonIcon',
      icon: 'el-icon-menu',
      component: () => import('@/views/vu-components/the-vu-button-icon.vue')
    }
  ]
}

export default navigation
