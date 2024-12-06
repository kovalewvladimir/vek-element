import 'virtual:uno.css'

import { createEla, INavigation, IUserInfo, Role } from 'element-plus-aa'
import { asyncSleep } from 'element-plus-aa/utils'

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

createEla({
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
