import { type INavigation, VuLayout } from '@vek-element/ui'

const navigation: INavigation = {
  name: 'TheComponents',
  path: '/vu-components',
  title: 'Components',
  icon: 'el-icon-menu',
  component: VuLayout,
  children: [
    {
      name: 'TheVuButtonIcon',
      path: 'vu-button-icon',
      title: 'VuButtonIcon',
      icon: 'el-icon-menu',
      component: () => import('@/views/vu-components/the-vu-button-icon.vue')
    },
    {
      name: 'TheVuModalDialog',
      path: 'vu-modal-dialog',
      title: 'VuModalDialog',
      icon: 'el-icon-menu',
      component: () => import('@/views/vu-components/dialog/the-vu-modal-dialog.vue')
    },
    {
      name: 'VuVirtTable',
      path: 'vu-virt-table',
      title: 'VuVirtTable',
      icon: 'el-icon-menu',
      children: [
        {
          name: 'TheVuVirtTable',
          path: 'simple',
          title: 'VuVirtTable',
          icon: 'el-icon-menu',
          component: () => import('@/views/vu-components/vu-virt-table/the-vu-virt-table.vue')
        },
        {
          name: 'TheVuVirtTableTree',
          path: 'tree',
          title: 'VuVirtTableTree',
          icon: 'el-icon-menu',
          component: () => import('@/views/vu-components/vu-virt-table/the-vu-virt-table-tree.vue')
        }
      ]
    }
  ]
}

export default navigation
