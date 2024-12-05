import 'virtual:uno.css'

import { createEla, IUserInfo } from 'element-plus-aa'
import { asyncSleep } from 'element-plus-aa/utils'

import App from '@/App.vue'

import { navigation } from './navigation'

const getTestUser = async () => {
  console.warn('getUser')

  await asyncSleep(1500)

  const user: IUserInfo = {
    id: 1,
    username: 'test',
    name: 'Test',
    surname: 'Test',
    patronymic: 'Test',
    avatar: 'https://i.pravatar.cc/300',
    roles: {
      RW: 'RW'
    }
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
