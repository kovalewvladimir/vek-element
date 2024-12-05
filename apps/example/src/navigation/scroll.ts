import { ElaLayout, type INavigation } from 'element-plus-aa'

const navigation: INavigation = {
  name: 'TheScroll',
  path: '/scroll',
  title: 'Scroll',
  icon: 'el-icon-menu',
  component: ElaLayout,
  children: [
    {
      name: 'the-scroll-1',
      path: '1',
      title: 'Scroll 1',
      icon: 'el-icon-menu',
      component: () => import('@/views/scrolls/the-scroll-1.vue')
    },
    {
      name: 'the-scroll-2',
      path: '2',
      title: 'Scroll 2',
      icon: 'el-icon-menu',
      component: () => import('@/views/scrolls/the-scroll-2.vue')
    }
  ]
}

export default navigation