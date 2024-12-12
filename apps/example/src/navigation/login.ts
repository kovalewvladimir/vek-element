import type { INavigation } from '@vek-element/ui'

const navigation: INavigation = {
  isLogin: true,
  name: 'login',
  title: 'login',
  path: '/login',
  hidden: true,
  component: () => import('@/views/login/the-login.vue')
}

export default navigation
