import { type INavigation } from '@vek-element/ui'

import dashboardNavigation from './dashboard'
import emptyNavigation from './empty'
import formNavigation from './form'
import loginNavigation from './login'
import longTitleNavigation from './long-title'
import notFoundNavigation from './not-found'
import paramsNavigation from './params'
import playgroundNavigation from './playground'
import rolesNavigation from './roles'
import scrollNavigation from './scroll'
import subMenuNavigation from './sub-menu'
import vuComponentsNavigation from './vu-components'

const navigation: INavigation[] = [
  loginNavigation,
  notFoundNavigation,

  dashboardNavigation,
  vuComponentsNavigation,
  playgroundNavigation,
  formNavigation,
  scrollNavigation,
  rolesNavigation,
  paramsNavigation,
  subMenuNavigation,
  longTitleNavigation,

  emptyNavigation
]

export { navigation }
