import { type INavigation, VuLayout } from '@vek-element/ui'

const navigation: INavigation = {
  name: 'TheComponents',
  path: '/vu-components',
  title: 'Components',
  icon: 'ep--menu',
  component: VuLayout,
  children: [
    {
      name: 'TheVuAutocompleteRemote',
      path: 'vu-autocomplete-remote',
      title: 'VuAutocompleteRemote',
      icon: 'ep--search',
      component: () => import('@/views/vu-components/the-vu-autocomplete-remote.vue')
    },
    {
      name: 'TheVuButtonIcon',
      path: 'vu-button-icon',
      title: 'VuButtonIcon',
      icon: 'ep--pointer',
      component: () => import('@/views/vu-components/the-vu-button-icon.vue')
    },
    {
      name: 'TheVuContentWrap',
      path: 'vu-content-wrap',
      title: 'VuContentWrap',
      icon: 'ep--box',
      component: () => import('@/views/vu-components/the-vu-content-wrap.vue')
    },
    {
      name: 'TheVuContextMenu',
      path: 'vu-context-menu',
      title: 'VuContextMenu',
      icon: 'ep--more',
      component: () => import('@/views/vu-components/the-vu-context-menu.vue')
    },
    {
      name: 'TheVuIconSvgDynamic',
      path: 'vu-icon-svg-dynamic',
      title: 'VuIconSvgDynamic',
      icon: 'ep--picture',
      component: () => import('@/views/vu-components/the-vu-icon-svg-dynamic.vue')
    },
    {
      name: 'TheVuIconSvgSlot',
      path: 'vu-icon-svg-slot',
      title: 'VuIconSvgSlot',
      icon: 'ep--picture-rounded',
      component: () => import('@/views/vu-components/the-vu-icon-svg-slot.vue')
    },
    {
      name: 'TheVuModalDialog',
      path: 'vu-modal-dialog',
      title: 'VuModalDialog',
      icon: 'ep--copy-document',
      component: () => import('@/views/vu-components/dialog/the-vu-modal-dialog.vue')
    },
    {
      name: 'TheVuNotification',
      path: 'vu-notification',
      title: 'VuNotificationShow',
      icon: 'ep--bell',
      component: () => import('@/views/vu-components/the-vu-notification.vue')
    },
    {
      name: 'VuVirtTable',
      path: 'vu-virt-table',
      title: 'VuVirtTable',
      icon: 'ep--grid',
      children: [
        {
          name: 'TableSimple',
          path: 'simple',
          title: 'Table Simple',
          icon: 'ep--list',
          component: () =>
            import('@/views/vu-components/vu-virt-table/table-simple/table-simple.vue')
        },
        {
          name: 'TableSimpleCreate',
          path: 'simple/create',
          title: 'Table Simple Create',
          icon: 'ep--plus',
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
          icon: 'ep--edit-pen',
          component: () =>
            import('@/views/vu-components/vu-virt-table/table-simple/table-simple-update.vue'),
          tag: false,
          cache: false,
          hidden: true
        },
        {
          name: 'TableSlots',
          path: 'slots',
          title: 'Table Slots',
          icon: 'ep--brush',
          component: () => import('@/views/vu-components/vu-virt-table/table-slots.vue')
        },
        {
          name: 'TableTree',
          path: 'tree',
          title: 'Table Tree',
          icon: 'ep--share',
          component: () => import('@/views/vu-components/vu-virt-table/table-tree.vue')
        },
        {
          name: 'TablePerf',
          path: 'perf',
          title: 'Table Perf',
          icon: 'ep--odometer',
          component: () => import('@/views/vu-components/vu-virt-table/table-perf.vue')
        }
      ]
    }
  ]
}

export default navigation
