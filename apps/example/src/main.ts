import 'virtual:uno.css'

import { createEla } from 'element-plus-aa'
import { createApp } from 'vue'

import App from '@/App.vue'

import { navigation } from './navigation'

const app = createApp(App)

createEla({
  layout: {
    title: 'TEST123',
    logo: 'el-logo'
  },
  app: app,
  navigation: navigation
})

app.mount('#app')
