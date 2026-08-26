import { type INavigation } from '@vek-element/ui'

import dashboardNavigation from './dashboard'
import hooksNavigation from './hooks'
import layoutNavigation from './layout'
import loginNavigation from './login'
import notFoundNavigation from './not-found'
import playgroundNavigation from './playground'
import utilsNavigation from './utils'
import vuComponentsNavigation from './vu-components'

const navigation: INavigation[] = [
  loginNavigation,
  notFoundNavigation,

  dashboardNavigation,
  vuComponentsNavigation,
  hooksNavigation,
  utilsNavigation,
  layoutNavigation,
  playgroundNavigation
]

export { navigation }
