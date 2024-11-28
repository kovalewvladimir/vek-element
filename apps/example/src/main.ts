import 'virtual:uno.css'

import { createEla, IUserInfo } from 'element-plus-aa'
import { asyncSleep } from 'element-plus-aa/utils'
import { createApp } from 'vue'

import App from '@/App.vue'

import { navigation } from './navigation'

const app = createApp(App)

createEla({
  layout: {
    title: 'TEST123',
    logo: 'el-logo'
  },
  vueApp: app,
  rootRedirect: '/dashboard',
  auth: {
    getUser: async () => {
      console.warn('getUser')

      await asyncSleep(1000)
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
    },

    login: {
      path: '/login',
      loader: () => import('@/views/login/the-login.vue')
    }
  },
  navigation: navigation
})

app.mount('#app')
