import { type INavigation, VuLayout } from '@vek-element/ui'

/** Родитель скрыт, поэтому в меню это один пункт верхнего уровня без вложенности */
const navigation: INavigation = {
  name: 'Playground',
  path: '/playground',
  title: 'Playground',
  icon: 'ep--opportunity',
  component: VuLayout,
  hidden: true,
  breadcrumb: false,
  children: [
    {
      name: 'ThePlayground',
      path: '',
      title: 'Playground',
      icon: 'ep--opportunity',
      component: () => import('@/views/playground/the-playground.vue')
    }
  ]
}

export default navigation
