import { type EventBusKey, useEventBus } from '@vek-element/ui'
import { validateForm } from '@vek-element/ui/utils'
import { VuNotificationShow } from '@vek-element/ui-components'
import { useLoading } from '@vek-element/ui-components/hooks'
import { type FormInstance } from 'element-plus'
import { isEqual } from 'lodash-es'
import { computed, onMounted, type Ref, ref, watch } from 'vue'
import { type NavigationFailure, useRoute } from 'vue-router'

/** Функция для получения разницы между двумя объектами */
function getObjectDifference<T>(source: T, updated: T): Partial<T> {
  const diff: Partial<T> = {}

  for (const key in source) {
    if (!Object.prototype.hasOwnProperty.call(updated, key)) {
      diff[key] = null as T[typeof key]
    }
  }

  for (const key in updated) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      if (!isEqual(source[key], updated[key])) diff[key] = updated[key]
    } else {
      diff[key] = updated[key]
    }
  }

  return diff
}

/** Тип ключа события шины событий */
export type EventBusActionKeyType<T> = EventBusKey<{
  status: 'create' | 'update' | 'delete'
  data: T
}>

/** Инициализация данных для формы */
export const useForm = <
  T extends Record<ID_KEY, ID_T>,
  ID_T = string,
  ID_KEY extends string = 'id'
>(options: {
  config: {
    /** Имя параметра маршрута. Нужен для получения идентификатора по которому нужно получить данные */
    routeParamName: string

    /** Функция для перехода на предыдущую страницу */
    navigationToBack: () => Promise<NavigationFailure | void | undefined>

    /** Ключ шины событий. Нужен для отправки событий в другие компоненты */
    busKey: EventBusActionKeyType<T>
  }
  api: {
    /** Поле идентификатора */
    idField?: ID_KEY

    /** Функция для получения данных */
    get: (id: ID_T | undefined) => Promise<T>

    /** Функция для создания данных */
    create: (data: Omit<T, ID_KEY>) => Promise<T>

    /** Функция для обновления данных */
    update: (id: ID_T, data: Partial<T>) => Promise<T>

    /** Функция для удаления данных */
    delete: (id: ID_T) => Promise<T>
  }
}) => {
  //#region Данные
  const route = useRoute()
  const { loading, loadingWrapper } = useLoading()
  const busEvent = useEventBus(options.config.busKey)

  const initialId = route.params[options.config.routeParamName] as ID_T

  const formRef = ref<FormInstance>()

  const dataSource: Ref<T | null> = ref(null)
  const dataForm: Ref<T | Omit<T, ID_KEY> | null> = ref(null)
  const dataUpdate: Ref<Partial<T> | null> = ref(null)

  const idField = options.api.idField || ('id' as ID_KEY)
  //#endregion

  //#region Computed
  const isCreate = computed(() => initialId === undefined)
  const isUpdate = computed(() => !isCreate.value)
  const isUpdateEmpty = computed(
    () => !dataUpdate.value || Object.keys(dataUpdate.value).length === 0
  )
  //#endregion

  //#region Методы
  /** Копирует данные в источник и форму */
  const copyFormData = (data: T) => {
    dataSource.value = structuredClone(data)
    dataForm.value = structuredClone(data)
  }

  /** Создает новую запись, после успешного создания перенаправляет на предыдущую страницу */
  const create = loadingWrapper(async () => {
    if (!dataForm.value) throw new Error('Нет данных для создания')

    const { isValid } = await validateForm(formRef)
    if (!isValid) throw new Error('Ошибка валидации')

    const data = await options.api.create(dataForm.value)
    VuNotificationShow('Успешно', `Создан ${String(data[idField])}`)
    busEvent.emit({ status: 'create', data: data })
    await options.config.navigationToBack()
  })

  /** Обновляет существующую запись и обновляет данные формы */
  const update = loadingWrapper(async (isBackNavigation: boolean = false) => {
    const { isValid } = await validateForm(formRef)
    if (!isValid) throw new Error('Ошибка валидации')
    if (!dataUpdate.value) throw new Error('Нет данных для обновления')

    const data = await options.api.update((dataForm.value as T)[idField], dataUpdate.value)
    VuNotificationShow('Успешно', `Изменен ${String(data[idField])}`)
    copyFormData(data)
    busEvent.emit({ status: 'update', data: data })
    if (isBackNavigation) await options.config.navigationToBack()
  })

  /** Удаляет запись и перенаправляет на предыдущую страницу */
  const remove = loadingWrapper(async () => {
    const data = await options.api.delete((dataForm.value as T)[idField])
    VuNotificationShow('Успешно', `Удален ${String(data[idField])}`)
    busEvent.emit({ status: 'delete', data: data })
    await options.config.navigationToBack()
  })
  //#endregion

  //#region watch
  // watch регистрируется синхронно в setup-контексте — Vue корректно остановит его при unmount
  if (isUpdate.value) {
    watch(
      dataForm,
      () => {
        if (dataSource.value != null && dataForm.value != null) {
          dataUpdate.value = getObjectDifference(dataSource.value, dataForm.value as T)
        }
      },
      { deep: true }
    )
  }
  //#endregion

  //#region Жизненный цикл
  onMounted(
    loadingWrapper(async () => {
      const data = await options.api.get(initialId)
      copyFormData(data)
    })
  )
  //#endregion

  return {
    form: {
      data: dataForm,
      ref: formRef
    },
    state: {
      is: {
        create: isCreate,
        update: isUpdate,
        updateEmpty: isUpdateEmpty
      },
      loading
    },
    actions: {
      create,
      update,
      remove
    }
  }
}
