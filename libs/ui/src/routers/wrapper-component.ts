import { useNavigationStore } from '@vek-element/ui'
import { isNull } from '@vek-element/ui/utils'
import {
  type Component,
  computed,
  defineComponent,
  h,
  KeepAlive,
  markRaw,
  onMounted,
  ref,
  watch
} from 'vue'
import { useRouter } from 'vue-router'

import { type AsyncLoadComponent } from './types'

/**
 * Создание обертки для компонента с возможностью кеширования
 * Нужен для того чтобы не пересоздавать компонент при переходе
 * по параметризованным роутам
 *
 * @param name - имя компонента, должно совпадать с именем роута
 * @param loader - функция загрузки компонента
 * @returns обертка для компонента
 */
const createWrapperComponentRouterParameters = (name: string, loader: AsyncLoadComponent) => {
  const createComponent = async () => {
    const component = await loader()
    return component.default ? markRaw(component.default) : markRaw(component)
  }

  return defineComponent({
    name: name,
    setup() {
      onMounted(async () => {
        if (isNull(activeRoutePath.value)) return
        await initializeComponent(activeRoutePath.value)
      })

      const router = useRouter()
      const navigationStore = useNavigationStore()

      const components = ref<Record<string, { visible: boolean; component: Component }>>({})
      const isCache = router.currentRoute.value.meta.cache

      const initializeComponent = async (path: string) => {
        components.value[path] = {
          visible: true,
          component: await createComponent()
        }
      }
      const visibleComponent = (path: string) => {
        if (components.value.hasOwnProperty(path)) {
          components.value[path].visible = true
        }
      }
      const hideComponent = (path: string) => {
        if (components.value.hasOwnProperty(path)) {
          components.value[path].visible = false
        }
      }
      const deleteComponent = (path: string) => {
        delete components.value[path]
      }

      // Проверка на то что текущий роут это сам компонент
      const activeRoutePath = computed<string | null>(() => {
        return router.currentRoute.value.name === name ? router.currentRoute.value.fullPath : null
      })

      // Подписка на изменения в навигации
      // Если удалили тег, то удаляем компонент
      watch(navigationStore.tagItems, () => {
        const deleteComponentPaths = Object.keys(components.value).filter(
          (path) => !navigationStore.tagItems.some((item) => item.path === path)
        )
        for (const path of deleteComponentPaths) {
          deleteComponent(path)
        }
      })

      // Подписка на изменения в текущем роуте
      // Если текущий роут это сам компонент, то показываем его
      // И если выключено кеширование, то удаляем его из списка
      watch(activeRoutePath, async () => {
        // Если выключено кеширование, то удаляем все компоненты
        if (!isCache) {
          for (const path in components.value) {
            deleteComponent(path)
          }
        }

        for (const path in components.value) {
          hideComponent(path)
        }

        if (activeRoutePath.value) {
          if (components.value.hasOwnProperty(activeRoutePath.value)) {
            visibleComponent(activeRoutePath.value)
          } else {
            await initializeComponent(activeRoutePath.value)
          }
        }
      })

      return { components }
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

/**
 * Генерация уникального имени компонента
 * @param name - имя компонента, должно совпадать с именем роута
 * @param loader - функция загрузки компонента
 * @returns функция создания компонента
 */
const generateUniqueNameComponent = (name: string, loader: AsyncLoadComponent) => {
  const createComponent = async () => {
    const component = await loader()

    // TODO: Меняю приватное свойство __name компонента на уникальное
    //       Наверное это не очень хорошо, но пока не нашел другого способа
    // @ts-expect-error: Меняем имя компонента на уникальное
    component.default.__name = name

    return markRaw(component.default)
  }

  return createComponent
}

export { createWrapperComponentRouterParameters, generateUniqueNameComponent }
