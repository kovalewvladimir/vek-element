import type { INavigation } from '@vek-element/ui'

const navigation: INavigation = {
  type: 'notFound',
  name: 'not-found',
  title: 'not-found',
  path: '/404',
  hidden: true,
  component: () => import('@/views/not-found.vue')
}

export default navigation
