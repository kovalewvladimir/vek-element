import type { INavigation } from '@vek-element/ui'

const navigation: INavigation = {
  type: 'login',
  name: 'login',
  title: 'login',
  path: '/login',
  hidden: true,
  component: () => import('@/views/login/the-login.vue')
}

export default navigation
