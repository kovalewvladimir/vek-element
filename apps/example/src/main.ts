import { createLayoutStore } from 'element-plus-aa'
import { createApp } from 'vue'

import App from '@/App.vue'

if (import.meta.env.PROD) {
  void import('element-plus-aa/style.css')
}

const app = createApp(App)

createLayoutStore({
  title: 'TEST123',
  logo: 'el-logo',
  menu: [
    { name: 'Home', meta: { title: 'Home', icon: 'el-icon-menu' } },
    { name: 'About', meta: { title: 'About', icon: 'el-icon-menu' } },
    {
      name: 'Contact',
      meta: { title: 'Contact', icon: 'el-icon-menu' },
      children: [
        { name: 'Contact1', meta: { title: 'Contact1', icon: 'el-icon-menu' } },
        { name: 'Contact2', meta: { title: 'Contact2', icon: 'el-icon-menu' } }
      ]
    }
  ]
})

app.mount('#app')
