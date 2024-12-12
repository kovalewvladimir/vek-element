import 'virtual:uno.css'
import 'virtual:svg-icons-register'

import { createUI, INavigation, IUserInfo, Role } from '@vek-element/ui'
import { asyncSleep } from '@vek-element/ui/utils'

import App from '@/App.vue'

import { navigation } from './navigation'

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

const getTestUser = async () => {
  await asyncSleep(1500)

  const user: IUserInfo = {
    id: 1,
    username: 'test',
    name: 'Test',
    surname: 'Test',
    patronymic: 'Test',
    avatar: 'https://i.pravatar.cc/300',
    roles: getAllPrivileges(navigation)
  }

  return user
}

createUI({
  root: {
    component: App,
    container: '#app'
  },
  layout: {
    title: 'TEST123',
    logo: 'el-logo'
  },
  auth: {
    getUser: getTestUser
  },
  navigation: navigation
})
