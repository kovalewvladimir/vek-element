import { ElConfigProvider } from 'element-plus'
import {
  type Component,
  type ComponentInternalInstance,
  createVNode,
  h,
  markRaw,
  render
} from 'vue'

/** Создания и управления динамическими модальными диалогами */
export function useModalDialog<
  T extends Component,
  // Определяем параметры, используя условный тип для извлечения параметров метода open
  Args extends Parameters<
    // @ts-expect-error: InstanceType<T>
    InstanceType<T> extends { open: (...args: any[]) => any } ? InstanceType<T>['open'] : never
  >,
  // Определяем тип возвращаемого значения
  Result extends ReturnType<
    // @ts-expect-error: InstanceType<T>
    InstanceType<T> extends { open: (...args: any[]) => any } ? InstanceType<T>['open'] : never
  >
>(dialog: T, currentInstance: ComponentInternalInstance | null) {
  if (!currentInstance) {
    throw new Error('useModalDialog must be called within a setup function')
  }

  /** Открывает модальный диалог */
  // @ts-expect-error: Иначе в типе не будет двойной Promise
  const open = async (...args: Args): Result => {
    // Проверяем, что текущий экземпляр компонента существует
    const parentEl = currentInstance.vnode.el as HTMLElement
    if (!parentEl) {
      throw new Error('Parent element not found')
    }

    // Создаем DOM-элемент для монтирования
    const mountEl = document.createElement('div')
    parentEl.append(mountEl)
    // Создаем виртуальный узел для диалога
    const vNodeDialog = h(dialog)
    // Создаем виртуальный узел для конфигурации Element Plus
    const vNodeConfig = createVNode(markRaw(h(ElConfigProvider, {}, () => vNodeDialog)), {}, null)
    // Устанавливаем родительский контекст для vNode
    vNodeConfig.appContext = currentInstance.appContext
    // Рендерим виртуальный узел в mountEl
    render(vNodeConfig, mountEl)

    // Открываем диалог и получаем результат
    const vm = vNodeDialog.component?.exposed
    if (!vm || typeof vm.open !== 'function') {
      throw new TypeError('Component does not have an exposed open method')
    }
    const resultData = await vm.open(...args)

    // Обработка закрытия
    render(null, mountEl)
    mountEl.remove()

    return resultData
  }

  return { open }
}
