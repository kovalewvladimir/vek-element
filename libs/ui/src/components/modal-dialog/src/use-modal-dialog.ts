import { type Component, type ComponentInternalInstance, createApp } from 'vue'

// Определяем интерфейс для компонентов с методом open
interface DialogComponent {
  open: (...args: any[]) => Promise<any>
}

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
    const dialogApp = createApp(dialog)
    const vm = dialogApp.mount(mountEl) as unknown as DialogComponent

    // Проверяем наличие метода open
    if (typeof vm.open !== 'function') {
      throw new TypeError('Component does not have an open method')
    }

    // Вызываем метод open и получаем результат
    const resultData = await vm.open(...args)

    // Обработка закрытия
    dialogApp.unmount()
    mountEl.remove()

    return resultData
  }

  return { open }
}
