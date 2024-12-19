import { type NavigationGuardWithThis } from 'vue-router'

import { useNavigationStore, useUserStore } from '../layout'

const permissionBeforeEach = (loginPath: string): NavigationGuardWithThis<undefined> => {
  const whiteList = new Set([loginPath])

  return async (to, _from, next) => {
    // Белый лист
    if (whiteList.has(to.path)) {
      next()
      return
    }

    // Запрос информации о пользователе
    const userStore = useUserStore()
    if (userStore.user == null) {
      try {
        await userStore.loadUser()
      } catch {
        next(`/login?redirect=${to.path}`)
        return
      }
    }

    // Генерация меню
    const navigationStore = useNavigationStore()
    if (navigationStore.menuItems.length === 0) {
      if (userStore.user == null) {
        throw new Error('User is not loaded')
      }
      navigationStore.generateMenu(userStore.user.roles)
      // тк только что сгенерировали меню, то нужно повторно перейти на текущий роут
      next({ ...to, replace: true })
      return
    }

    next()
  }
}

export { permissionBeforeEach }
