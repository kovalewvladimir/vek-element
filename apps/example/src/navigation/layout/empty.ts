import { type INavigation } from '@vek-element/ui'
import { h } from 'vue'

const COUNT = 50

/** Много пунктов подряд — проверка прокрутки меню */
const navigation: INavigation = {
  name: 'Empty',
  path: 'empty',
  title: `Много пунктов (${COUNT})`,
  icon: 'ep--files',
  children: Array.from({ length: COUNT }).map((_, i) => ({
    name: `Empty${i}`,
    path: `${i}`,
    title: `Empty${i}`,
    icon: 'ep--document',
    component: {
      name: `Empty${i}`,
      render: () => h('h1', `Empty${i}`)
    }
  }))
}

export default navigation
