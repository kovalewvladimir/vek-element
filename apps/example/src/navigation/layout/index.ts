import { type INavigation, VuLayout } from '@vek-element/ui'

import emptyNavigation from './empty'
import longTitleNavigation from './long-title'
import paramsNavigation from './params'
import scrollNavigation from './scroll'
import subMenuNavigation from './sub-menu'

/**
 * Демонстрация layout и роутера: параметризованные пути, прокрутка,
 * вложенное меню, длинные заголовки, много пунктов.
 */
const navigation: INavigation = {
  name: 'TheLayout',
  path: '/layout',
  title: 'Layout',
  icon: 'ep--platform',
  component: VuLayout,
  children: [
    paramsNavigation,
    scrollNavigation,
    subMenuNavigation,
    longTitleNavigation,
    emptyNavigation
  ]
}

export default navigation
