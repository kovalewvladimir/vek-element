import { type INavigation } from '@vek-element/ui'

const navigation: INavigation[] = Array.from({ length: 50 }).map((_, i) => ({
  name: `Empty${i}`,
  path: `/empty${i}`,
  title: `Empty${i}`
}))

export default navigation
