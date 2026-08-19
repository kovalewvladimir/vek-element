import { type INavigation, VuLayout } from '@vek-element/ui'
import { h } from 'vue'

const LONG_TITLE =
  'Очень длинный заголовок пункта меню для проверки обрезки многоточием'

const navigation: INavigation = {
  name: 'LongTitle',
  path: '/long-title',
  title: LONG_TITLE,
  icon: 'el-icon-menu',
  component: VuLayout,
  children: [
    {
      name: 'LongTitleItem',
      path: 'item',
      title: LONG_TITLE,
      icon: 'el-icon-menu',
      component: {
        name: 'LongTitleItem',
        render: () => h('h1', LONG_TITLE)
      }
    },
    {
      name: 'LongTitleSub',
      path: 'sub',
      title: `Подменю — ${LONG_TITLE}`,
      icon: 'el-icon-menu',
      children: [
        {
          name: 'LongTitleSubItem',
          path: '1',
          title: `Вложенный — ${LONG_TITLE}`,
          icon: 'el-icon-menu',
          component: {
            name: 'LongTitleSubItem',
            render: () => h('h1', `Вложенный — ${LONG_TITLE}`)
          }
        }
      ]
    }
  ]
}

export default navigation
