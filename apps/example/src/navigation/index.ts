import { type INavigation } from '@vek-element/ui'

import dashboardNavigation from './dashboard'
import emptyNavigation from './empty'
import loginNavigation from './login'
import notFoundNavigation from './notFound'
import paramsNavigation from './params'
import rolesNavigation from './roles'
import scrollNavigation from './scroll'
import subMenuNavigation from './sub-menu'

const navigation: INavigation[] = [
  loginNavigation,
  notFoundNavigation,

  dashboardNavigation,
  scrollNavigation,
  rolesNavigation,
  paramsNavigation,
  subMenuNavigation,

  ...emptyNavigation
]

export { navigation }
