import { type INavigation, VuLayout } from '@vek-element/ui'

const navigation: INavigation = {
  name: 'TheUtils',
  path: '/utils',
  title: 'Utils',
  icon: 'ep--tools',
  component: VuLayout,
  children: [
    {
      name: 'TheUtilsDate',
      path: 'date',
      title: 'date',
      icon: 'ep--calendar',
      component: () => import('@/views/utils/the-utils-date.vue')
    },
    {
      name: 'TheUtilsFormRules',
      path: 'form-rules',
      title: 'form-rules',
      icon: 'ep--document-checked',
      component: () => import('@/views/utils/the-utils-form-rules.vue')
    },
    {
      name: 'TheUtilsSleep',
      path: 'sleep',
      title: 'sleep',
      icon: 'ep--timer',
      component: () => import('@/views/utils/the-utils-sleep.vue')
    },
    {
      name: 'TheUtilsCommon',
      path: 'common',
      title: 'is / random / url',
      icon: 'ep--link',
      component: () => import('@/views/utils/the-utils-common.vue')
    }
  ]
}

export default navigation
