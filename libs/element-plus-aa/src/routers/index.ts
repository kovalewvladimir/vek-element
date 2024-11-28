import { RouteRecordRaw } from 'vue-router'

import { ILoginRoute } from './types'

export type * from './types'
export * from './wrapperComponent'

const getInitialRouter = (rootRedirect: string, login: ILoginRoute): RouteRecordRaw[] => [
  {
    name: 'root',
    path: '/',
    redirect: rootRedirect
  },
  {
    name: 'login',
    path: login.path,
    component: login.loader
  }
]

export { getInitialRouter }
