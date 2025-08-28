import { type INavigation, VuLayout } from '@vek-element/ui'

const navigation: INavigation = {
  name: 'Form',
  path: '/form',
  title: 'Form',
  icon: 'el-icon-menu',
  component: VuLayout,
  hidden: true,
  breadcrumb: false,
  children: [
    {
      name: 'TheForm',
      path: '',
      title: 'Form',
      icon: 'el-icon-menu',
      component: () => import('@/views/form/the-form.vue')
    }
  ]
}

export default navigation
