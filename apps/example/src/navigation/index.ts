import { type INavigation } from 'element-plus-aa'

import dashboardNavigation from './dashboard'
import emptyNavigation from './empty'
import loginNavigation from './login'
import paramsNavigation from './params'
import rolesNavigation from './roles'
import scrollNavigation from './scroll'
import subMenuNavigation from './sub-menu'

const navigation: INavigation[] = [
  loginNavigation,

  dashboardNavigation,
  scrollNavigation,
  rolesNavigation,
  paramsNavigation,
  subMenuNavigation,

  ...emptyNavigation
]

export { navigation }
