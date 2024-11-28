import { NavigationGuardWithThis } from 'vue-router'

import { useNavigationStore, useUserStore } from '../layout'

const permissionBeforeEach = (loginPath: string): NavigationGuardWithThis<undefined> => {
  const whiteList = [loginPath]

  return async (to, _from, next) => {
    console.log('permissionBeforeEach')

    // Белый лист
    if (whiteList.includes(to.path)) {
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
      navigationStore.generateMenu()
      // тк только что сгенерировали меню, то нужно повторно перейти на текущий роут
      next({ ...to, replace: true })
      return
    }

    next()
  }
}

export { permissionBeforeEach }
