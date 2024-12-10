import { ElaLayout, type INavigation } from 'element-plus-aa'

const navigation: INavigation = {
  name: 'Roles',
  path: '/roles',
  title: 'Roles',
  icon: 'el-icon-menu',
  component: ElaLayout,
  hidden: true,
  breadcrumb: false,
  children: [
    {
      name: 'TheRoles',
      path: '',
      title: 'Roles',
      icon: 'el-icon-menu',
      component: () => import('@/views/roles/the-roles.vue'),

      roles: {
        TestRole: {
          description: 'Тестовая роль'
        }
      }
    }
  ]
}

export default navigation
