import { type INavigation } from '@vek-element/ui'
import { isAsyncLoadComponent, isNull, joinPath } from '@vek-element/ui/utils'
import { h } from 'vue'
import { createRouter, createWebHistory, type Router, type RouteRecordRaw } from 'vue-router'

import { permissionBeforeEach } from './hooks'

const findNavigation = (
  navigationItems: INavigation[],
  predicate: (route: INavigation) => boolean | undefined,
  basePath: string = '/'
): INavigation | null => {
  let foundNavigation: INavigation | null = null

  const searchNavigation = (navigationSearchItems: INavigation[], basePath: string): void => {
    for (const navigation of navigationSearchItems) {
      const fullPath = joinPath(basePath, navigation.path)

      if (predicate(navigation)) {
        if (foundNavigation) {
          throw new Error('Found multiple navigation')
        }
        foundNavigation = { ...navigation, path: fullPath }
      }

      if (navigation.children) {
        searchNavigation(navigation.children, fullPath)
      }
    }
  }

  searchNavigation(navigationItems, basePath)

  return foundNavigation
}

const getLoginRouter = (navigation: INavigation[], basePath: string = '/'): RouteRecordRaw => {
  const loginRoute = findNavigation(navigation, (n) => n.type === 'login', basePath)

  if (isNull(loginRoute)) {
    throw new Error('Login route not found')
  }
  if (!loginRoute.component) {
    throw new Error('Login path component not found')
  }
  if (!isAsyncLoadComponent(loginRoute.component)) {
    throw new Error('Login component is not async')
  }

  return {
    name: 'login',
    path: loginRoute.path,
    component: loginRoute.component,
    // @ts-expect-error Нужен для изменения заголовка страницы
    meta: {
      title: loginRoute.title
    }
  }
}

const getRootRouter = (navigation: INavigation[], basePath: string = '/'): RouteRecordRaw => {
  const rootRoute = findNavigation(navigation, (n) => n.type === 'root', basePath)

  if (isNull(rootRoute)) {
    throw new Error('Root route not found')
  }

  return {
    name: 'root',
    path: '/',
    redirect: rootRoute.path
  }
}

const getNotFound = (navigation: INavigation[], basePath: string = '/'): RouteRecordRaw => {
  try {
    const notFoundRoute = findNavigation(navigation, (n) => n.type === 'notFound', basePath)

    if (isNull(notFoundRoute)) {
      throw new Error(`'Not found' route not found`)
    }
    if (!notFoundRoute.component) {
      throw new Error('Not found component not found')
    }
    if (!isAsyncLoadComponent(notFoundRoute.component)) {
      throw new Error('Not found component is not async')
    }

    return {
      name: 'NotFound',
      path: '/:pathMatch(.*)*',
      component: notFoundRoute.component,
      // @ts-expect-error Нужен для изменения заголовка страницы
      meta: {
        title: notFoundRoute.title
      }
    }
  } catch (error) {
    console.warn(error)
    return {
      name: 'NotFound',
      path: '/:pathMatch(.*)*',
      component: {
        name: 'NotFound',
        render: () => [h('h1', 'Not found'), h('a', { href: '/' }, 'Home')]
      },
      // @ts-expect-error Нужен для изменения заголовка страницы
      meta: {
        title: 'Not found'
      }
    }
  }
}

const initializeRouter = (navigation: INavigation[]): Router => {
  const rootRouter = getRootRouter(navigation)
  const loginRouter = getLoginRouter(navigation)

  const router = createRouter({
    history: createWebHistory(),
    routes: [rootRouter, loginRouter]
  })
  router.beforeEach(permissionBeforeEach(loginRouter.path))

  return router
}

export { findNavigation, getLoginRouter, getNotFound, getRootRouter, initializeRouter }
