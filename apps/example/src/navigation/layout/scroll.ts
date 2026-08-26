import { type INavigation } from '@vek-element/ui'

/** Поведение прокрутки внутри layout */
const navigation: INavigation = {
  name: 'TheScroll',
  path: 'scroll',
  title: 'Scroll',
  icon: 'ep--sort',
  children: [
    {
      name: 'the-scroll-1',
      path: '1',
      title: 'Scroll 1',
      icon: 'ep--sort',
      component: () => import('@/views/layout/scrolls/the-scroll-1.vue')
    },
    {
      name: 'the-scroll-2',
      path: '2',
      title: 'Scroll 2',
      icon: 'ep--sort',
      component: () => import('@/views/layout/scrolls/the-scroll-2.vue')
    }
  ]
}

export default navigation
