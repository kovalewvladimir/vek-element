import { type INavigation } from 'element-plus-aa'

const navigation: INavigation = {
  name: 'TheParams',
  path: '/params',
  title: 'Params',
  icon: 'el-icon-menu',
  children: [
    {
      name: 'the-params-input',
      path: 'original/:id',
      title: 'Input',
      icon: 'el-icon-menu',
      hidden: true,
      component: () => import('@/views/params/the-params-input.vue')
    },
    {
      name: 'the-params',
      path: 'original',
      title: 'Params',
      icon: 'el-icon-menu',
      component: () => import('@/views/params/the-params.vue')
    }
  ]
}

export default navigation
