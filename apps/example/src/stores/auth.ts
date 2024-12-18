import { type IAuth, type INavigation, type IUserInfo, type Role } from '@vek-element/ui'
import { asyncSleep } from '@vek-element/ui/utils'

import { navigation } from '@/navigation'

const getAllPrivileges = (navigation: INavigation[]): Record<string, Role> => {
  const navObject: Record<string, Role> = {}

  const extractNames = (navItems: INavigation[]) => {
    navItems.forEach((nav) => {
      navObject[nav.name] = 'RW'
      if (nav.children) {
        extractNames(nav.children)
      }
    })
  }

  extractNames(navigation)
  return navObject
}

class Auth implements IAuth {
  private _isLogin: boolean

  constructor() {
    const isLogin = localStorage.getItem('isLogin')
    this._isLogin = isLogin === 'true'
  }

  getUser = async () => {
    await asyncSleep(1500)

    if (!this._isLogin) {
      throw new Error('User not authorized')
    }

    const user: IUserInfo = {
      id: 1,
      username: 'test',
      name: 'Test',
      surname: 'Test',
      patronymic: 'Test',
      // avatar: 'https://i.pravatar.cc/300',
      roles: getAllPrivileges(navigation)
    }

    return user
  }

  login = () => {
    localStorage.setItem('isLogin', 'true')
    this._isLogin = true
  }

  logout = () => {
    localStorage.setItem('isLogin', 'false')
    this._isLogin = false
  }
}

const auth = new Auth()

const useAuthStore = () => {
  return auth
}

export { useAuthStore }
