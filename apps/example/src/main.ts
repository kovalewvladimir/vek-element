import 'virtual:uno.css'
import 'virtual:svg-icons-register'

import { createUI } from '@vek-element/ui'
import { ElLoading } from 'element-plus'

import App from '@/app.vue'
import { navigation } from '@/navigation'

import { useAuthStore } from './stores/auth'

const auth = useAuthStore()

createUI({
  root: {
    component: App,
    container: '#app'
  },
  plugins: [ElLoading],
  layout: {
    title: 'TEST123',
    logo: '/imgs/logo.png',
    defaultAvatar: '/imgs/default_rabbit.gif'
  },
  auth: auth,
  navigation: navigation
})
