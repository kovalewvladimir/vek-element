import { Component, computed, defineComponent, h, KeepAlive, markRaw, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import { useNavigationStore } from '../layout'

/**
 * Создание обертки для компонента с возможностью кеширования
 * Нужен для того чтобы не пересоздавать компонент при переходе
 * по параметризованным роутам
 *
 * @param name - имя компонента, должно совпадать с именем роута
 * @param loader - функция загрузки компонента
 * @returns обертка для компонента
 */
const createWrapperComponentRouterParams = (
  name: string,
  loader: () => Promise<{ default: Component }>
) => {
  const createComponent = async () => {
    const component = await loader()
    return component.default ? markRaw(component.default) : markRaw(component)
  }

  return defineComponent({
    name: name,
    setup() {
      const router = useRouter()
      const navigationStore = useNavigationStore()

      const components = ref<Record<string, { visible: boolean; component: Component }>>({})

      // Проверка на то что текущий роут это сам компонент
      const isSelf = computed(() => {
        return router.currentRoute.value.name === name ? router.currentRoute.value.fullPath : null
      })

      // Подписка на изменения в навигации
      // Если в навигации появился новый пункт с текущим именем
      // то создаем компонент и добавляем его в список
      watch(navigationStore.tagItems, async () => {
        const tagItems = navigationStore.tagItems.filter((item) => item.route.name === name)
        for (const item of tagItems) {
          if (!components.value[item.path]) {
            components.value[item.path] = {
              visible: true,
              component: await createComponent()
            }
          }
        }

        Object.keys(components.value)
          .filter((path) => !navigationStore.tagItems.some((item) => item.path === path))
          .forEach((path) => {
            delete components.value[path]
          })
      })

      // Подписка на изменения в текущем роуте
      // Если текущий роут это сам компонент, то показываем его
      watch(isSelf, () => {
        for (const key in components.value) {
          components.value[key].visible = false
        }

        if (isSelf.value) {
          if (components.value.hasOwnProperty(isSelf.value))
            components.value[isSelf.value].visible = true
        }
      })

      return { isSelf, components }
    },
    render() {
      const renderComponent = []

      // Рендерим только видимые компоненты
      for (const key in this.components) {
        if (this.components.hasOwnProperty(key))
          renderComponent.push(
            h(KeepAlive, { key }, [
              this.components[key].visible ? h(this.components[key].component) : null
            ])
          )
      }

      return renderComponent
    }
  })
}

export { createWrapperComponentRouterParams }
