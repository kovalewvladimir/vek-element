import { type INavigation, VuLayout } from '@vek-element/ui'
import { h } from 'vue'

const navigation: INavigation = {
  name: 'Empty',
  path: '/empty',
  title: 'Empty',
  icon: 'el-icon-menu',
  hidden: true,
  component: VuLayout,
  children: Array.from({ length: 50 }).map((_, i) => ({
    name: `Empty${i}`,
    path: `${i}`,
    title: `Empty${i}`,
    component: {
      name: `Empty${i}`,
      render: () => h('h1', `Empty${i}`)
    }
  }))
}

export default navigation
