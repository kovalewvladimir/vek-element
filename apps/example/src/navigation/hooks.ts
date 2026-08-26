import { type INavigation, VuLayout } from '@vek-element/ui'

const navigation: INavigation = {
  name: 'TheHooks',
  path: '/hooks',
  title: 'Hooks',
  icon: 'ep--connection',
  component: VuLayout,
  children: [
    {
      name: 'TheUseCan',
      path: 'use-can',
      title: 'useCan',
      icon: 'ep--lock',
      component: () => import('@/views/hooks/the-use-can.vue'),

      // Дополнительные роли страницы — их читает useCan().roles
      roles: {
        TestRole: {
          description: 'Тестовая роль'
        }
      }
    },
    {
      name: 'TheUseEventBus',
      path: 'use-event-bus',
      title: 'useEventBus',
      icon: 'ep--promotion',
      component: () => import('@/views/hooks/event-bus/the-use-event-bus.vue')
    },
    {
      name: 'TheUseInfiniteScroll',
      path: 'use-infinite-scroll',
      title: 'useInfiniteScroll',
      icon: 'ep--bottom',
      component: () => import('@/views/hooks/the-use-infinite-scroll.vue')
    },
    {
      name: 'TheUseLoading',
      path: 'use-loading',
      title: 'useLoading',
      icon: 'ep--loading',
      component: () => import('@/views/hooks/the-use-loading.vue')
    },
    {
      name: 'TheUseScrollPosition',
      path: 'use-scroll-position',
      title: 'useScrollPosition',
      icon: 'ep--location',
      component: () => import('@/views/hooks/the-use-scroll-position.vue')
    },
    {
      name: 'TheUseVirtTableData',
      path: 'use-virt-table-data',
      title: 'useVirtTableData',
      icon: 'ep--collection',
      component: () => import('@/views/hooks/the-use-virt-table-data.vue')
    },
    {
      name: 'TheUseVirtualList',
      path: 'use-virtual-list',
      title: 'useVirtualList',
      icon: 'ep--memo',
      component: () => import('@/views/hooks/the-use-virtual-list.vue')
    }
  ]
}

export default navigation
