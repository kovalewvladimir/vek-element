import { createEla, IAppRouteRecordRaw } from 'element-plus-aa'
import { createApp } from 'vue'

import App from '@/App.vue'

if (import.meta.env.PROD) {
  void import('element-plus-aa/style.css')
}

const app = createApp(App)

const routes: IAppRouteRecordRaw[] = [
  {
    name: 'main',
    path: '/',
    meta: { title: 'main', icon: 'el-icon-menu' },
    component: () => import('@/components/the-test01.vue')
  },
  {
    name: 'test-path',
    path: '/test',
    meta: { title: 'test-path', icon: 'el-icon-menu' },
    component: () => import('@/components/the-test03.vue')
  },
  {
    name: 'test-path-input',
    path: '/test/:id',
    meta: { title: 'test-path-input', icon: 'el-icon-menu', hidden: true },
    component: () => import('@/components/the-test03-input.vue')
  },
  {
    name: 'test1',
    path: '/test1',
    meta: { title: 'test1', icon: 'el-icon-menu' },
    children: [
      {
        name: 'test1-1',
        path: '1',
        meta: { title: 'test1-1', icon: 'el-icon-menu' },
        children: [
          {
            name: 'test1-1-1',
            path: '1',
            meta: { title: 'test1-1-1', icon: 'el-icon-menu' },
            component: () => import('@/components/the-test02.vue')
          }
        ]
      }
    ]
  }
]

createEla({
  layout: {
    title: 'TEST123',
    logo: 'el-logo'
  },
  app: app,
  routes: routes
})

app.mount('#app')
