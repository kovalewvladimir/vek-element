import { useNavigationStore, useUserStore } from '@vek-element/ui'
import { type NavigationGuardWithThis } from 'vue-router'

const permissionBeforeEach = (loginPath: string): NavigationGuardWithThis<undefined> => {
  const whiteList = new Set([loginPath])

  return async (to) => {
    // Белый лист
    if (whiteList.has(to.path)) {
      return
    }

    // Запрос информации о пользователе
    const userStore = useUserStore()
    if (userStore.user == null) {
      try {
        await userStore.loadUser()
      } catch {
        return `/login?redirect=${to.path}`
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
      return { ...to, replace: true }
    }
  }
}

export { permissionBeforeEach }
