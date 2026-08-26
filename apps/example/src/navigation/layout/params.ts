import { type INavigation } from '@vek-element/ui'

/**
 * Параметризованные пути.
 *
 * Группа скрыта (hidden), поэтому в меню виден только её дочерний пункт —
 * ещё один способ убрать лишний уровень вложенности.
 */
const navigation: INavigation = {
  name: 'TheParams',
  path: 'params',
  title: 'Params',
  icon: 'ep--guide',
  hidden: true,
  children: [
    {
      name: 'the-params-input',
      path: String.raw`original/:id(\d+)`,
      title: 'Input',
      icon: 'ep--edit-pen',
      hidden: true,
      component: () => import('@/views/layout/params/the-params-input.vue')
    },
    {
      name: 'the-params',
      path: 'original',
      title: 'Params',
      icon: 'ep--guide',
      component: () => import('@/views/layout/params/the-params.vue')
    }
  ]
}

export default navigation
