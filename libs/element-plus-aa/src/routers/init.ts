import { createRouter, createWebHistory, Router, RouteRecordRaw } from 'vue-router'

import { INavigation } from '../layout'
import { isAsyncLoadComponent } from '../utils'
import { permissionBeforeEach } from './hooks'
import { ILoginRoute } from './types'

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

/**
 * Поиск путей root и login
 */
const findPaths = (
  navigation: INavigation[],
  basePath: string = '/'
): { rootPath: string; login: ILoginRoute } => {
  let rootPath: string | undefined
  let login: ILoginRoute | undefined

  const searchPaths = (navigation: INavigation[], basePath: string) => {
    for (const route of navigation) {
      const fullPath = `${basePath}/${route.path}`.replace(/\/+/g, '/')

      if (route.isRoot) {
        if (rootPath) throw new Error('Multiple root paths found')
        rootPath = fullPath
      }

      if (route.isLogin) {
        if (login) throw new Error('Multiple login paths found')
        if (!route.component) throw new Error('Login path component not found')
        if (!isAsyncLoadComponent(route.component)) throw new Error('Login component is not async')
        login = {
          loader: route.component,
          path: fullPath
        }
      }

      if (route.children) searchPaths(route.children, fullPath)
    }
  }

  searchPaths(navigation, basePath)

  if (!rootPath) throw new Error('Root path not found')
  if (!login) throw new Error('Login path not found')

  return { rootPath, login }
}

const initializeRouter = (navigation: INavigation[]): Router => {
  const paths = findPaths(navigation)
  const router = createRouter({
    history: createWebHistory(),
    routes: getInitialRouter(paths.rootPath, paths.login)
  })
  router.beforeEach(permissionBeforeEach(paths.login.path))

  return router
}

export { getInitialRouter, initializeRouter }
