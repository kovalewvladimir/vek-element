import { useUserStore } from '@vek-element/ui'
import { useRoute } from 'vue-router'

/** Хук для проверки прав доступа */
export const useCan = (): {
  /** Разрешено ли редактирование */
  isRW: boolean

  /** Разрешено ли только чтение */
  isRO: boolean

  /** Проверка на роль */
  is: (role: string) => boolean

  /** Роли доступные на странице */
  roles?: Record<string, { description: string }>
} => {
  const route = useRoute()
  const userStore = useUserStore()

  const routeName = route.meta.name
  const roles = userStore?.user?.roles
  if (!roles) {
    throw new Error('useCan: roles is undefined')
  }

  const currentRole: string = roles[routeName]

  const rolesRoute = route.meta.roles

  const is = (role: string): boolean => {
    if (!['RW', 'RO'].includes(role)) {
      if (!rolesRoute) throw new Error('useCan: rolesRoute is undefined')
      if (!rolesRoute[role]) throw new Error(`useCan: role ${role} not found in rolesRoute`)
    }
    return currentRole === role
  }

  const isRW = is('RW')

  const isRO = is('RO')

  return { isRW, isRO, is, roles: rolesRoute }
}

//
//
// TODO: Вариант с директивой.
//       Работает, но после обновления страницы, директива не срабатывает #ноэтонеточно
//
// import { ComponentInternalInstance, DirectiveBinding, VNode } from 'vue'
// import { Directive } from 'vue'
// interface VNoneWithCtx extends VNode {
//   ctx?: ComponentInternalInstance
// }
// /**
//  * НЕ ИСПОЛЬЗУЙ В TEMPLATE SLOT VirtTable!!!
//  */
//   let countUpdate = 0
// const disabledElement = (vnode: VNoneWithCtx) => {
//   if (vnode.ctx) {
//     const nameComponent = vnode.ctx.type.name

//     if (nameComponent === 'ElForm') vnode.ctx.props.disabled = !isCan
//     if (nameComponent === 'ElButton') vnode.ctx.props.disabled = !isCan
//     if (nameComponent === 'ElInput') vnode.ctx.props.disabled = !isCan
//   }
// }

// const vCan: Directive<HTMLElement, string> = {
//   created: (_el: HTMLElement, _binding: DirectiveBinding<string>, vnode: VNoneWithCtx) => {
//     disabledElement(vnode)
//   },
//   updated: (_el: HTMLElement, _binding: DirectiveBinding<string>, vnode: VNoneWithCtx) => {
//     countUpdate++
//     if (countUpdate > 100) console.warn('vCan - Слишком много раз обновилось!!', vnode)

//     disabledElement(vnode)
//   }
// }
