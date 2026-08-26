import { type INavigation } from '@vek-element/ui'

/** Анимация перехода между страницами — View Transitions API */
const navigation: INavigation = {
  name: 'TheViewTransition',
  path: 'view-transition',
  title: 'View Transition',
  icon: 'ep--brush',
  hidden: true,
  breadcrumb: false,
  children: [
    {
      name: 'the-view-transition',
      path: '',
      title: 'View Transition',
      icon: 'ep--brush',
      component: () => import('@/views/layout/view-transition/the-view-transition.vue')
    }
  ]
}

export default navigation
