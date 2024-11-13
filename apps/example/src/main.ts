import { createEla, IAppRouteRecordRaw } from 'element-plus-aa'
import { createApp } from 'vue'

import App from '@/App.vue'

if (import.meta.env.PROD) {
  void import('element-plus-aa/style.css')
}

const app = createApp(App)

const routes: IAppRouteRecordRaw[] = [
  {
    name: 'TheMain',
    path: '/',
    meta: { title: 'Главная', icon: 'el-icon-menu' },
    component: () => import('@/views/the-main.vue')
  },
  {
    name: 'TheScroll',
    path: '/scroll',
    meta: { title: 'Scroll', icon: 'el-icon-menu' },
    children: [
      {
        name: 'TheScroll1',
        path: '1',
        meta: { title: 'Scroll 1', icon: 'el-icon-menu' },
        component: () => import('@/views/scrolls/the-scroll-1.vue')
      },
      {
        name: 'TheScroll2',
        path: '2',
        meta: { title: 'Scroll 2', icon: 'el-icon-menu' },
        component: () => import('@/views/scrolls/the-scroll-2.vue')
      }
    ]
  },

  {
    name: 'TheParams',
    path: '/params',
    meta: { title: 'Params', icon: 'el-icon-menu' },
    children: [
      {
        name: 'TheParamsInput',
        path: ':id',
        meta: { title: 'Input', icon: 'el-icon-menu', hidden: true },
        component: () => import('@/views/params/the-params-input.vue')
      },
      {
        name: 'TheParamsComponent',
        path: '',
        meta: { title: 'Component', icon: 'el-icon-menu' },
        component: () => import('@/views/params/the-params.vue')
      }
    ]
  },
  {
    name: 'SubMenu',
    path: '/sub-menu',
    meta: { title: 'Sub Menu', icon: 'el-icon-menu' },
    children: [
      {
        name: 'SubMenu1',
        path: '1',
        meta: { title: 'Sub Menu 1', icon: 'el-icon-menu' },
        children: [
          {
            name: 'SubMenu1-1',
            path: '1',
            meta: { title: 'Sub Menu 1-1', icon: 'el-icon-menu' },
            component: () => import('@/views/the-main.vue')
          },
          {
            name: 'SubMenu1-2',
            path: '2',
            meta: { title: 'Sub Menu 1-2', icon: 'el-icon-menu' },
            component: () => import('@/views/the-main.vue')
          }
        ]
      }
    ]
  },

  ...Array.from({ length: 50 }).map((_, i) => ({
    name: `Empty${i}`,
    path: `/empty${i}`,
    meta: { title: `Empty${i}` }
  }))
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
