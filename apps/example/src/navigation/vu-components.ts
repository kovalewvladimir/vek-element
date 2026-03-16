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
          name: 'TableSimple',
          path: 'simple',
          title: 'Table Simple',
          icon: 'el-icon-menu',
          component: () =>
            import('@/views/vu-components/vu-virt-table/table-simple/table-simple.vue')
        },
        {
          name: 'TableSimpleCreate',
          path: 'simple/create',
          title: 'Table Simple Create',
          icon: 'el-icon-menu',
          component: () =>
            import('@/views/vu-components/vu-virt-table/table-simple/table-simple-create.vue'),
          tag: false,
          cache: false,
          hidden: true
        },
        {
          name: 'TableSimpleUpdate',
          path: String.raw`simple/update/:id(\d+)`,
          title: 'Table Simple Update',
          icon: 'el-icon-menu',
          component: () =>
            import('@/views/vu-components/vu-virt-table/table-simple/table-simple-update.vue'),
          tag: false,
          cache: false,
          hidden: true
        },
        {
          name: 'TableTree',
          path: 'tree',
          title: 'Table Tree',
          icon: 'el-icon-menu',
          component: () => import('@/views/vu-components/vu-virt-table/table-tree.vue')
        }
      ]
    }
  ]
}

export default navigation
