import { useLoading, VuNotificationShow } from '@vek-element/ui'
import { validateForm } from '@vek-element/ui/utils'
import { type EventBusKey, useEventBus } from '@vueuse/core'
import { type FormInstance } from 'element-plus'
import { isEqual } from 'lodash-es'
import { computed, onMounted, type Ref, ref, watch } from 'vue'
import { type NavigationFailure, useRoute } from 'vue-router'

/** Функция для получения разницы между двумя объектами */
const getObjectDifference = (obj1: any, obj2: any): any => {
  const diffObj: any = {}

  for (const key in obj1) {
    if (!obj2.hasOwnProperty(key)) {
      diffObj[key] = null
    }
  }

  for (const key in obj2) {
    if (obj1.hasOwnProperty(key)) {
      if (!isEqual(obj1[key], obj2[key])) diffObj[key] = obj2[key]
    } else {
      diffObj[key] = obj2[key]
    }
  }

  return diffObj
}

/** Тип ключа события шины событий */
export type EventBusActionKeyType<T> = EventBusKey<{
  status: 'create' | 'update' | 'delete'
  data: T
}>

/** Базовые параметры формы */
interface FormConfig<T> {
  routeParamName: string
  navigationToBack: () => Promise<NavigationFailure | void | undefined>
  busKey: EventBusActionKeyType<T>
}

/** API функции для работы с данными */
interface ApiActions<T, C, U, ID_T> {
  getData: (id: ID_T | undefined) => Promise<T | C>
  createFunction: (data: C) => Promise<T>
  updateFunction: (id: ID_T, data: U) => Promise<T>
  deleteFunction: (id: ID_T) => Promise<T>
}

/** Инициализация данных для формы */
export const useForm = <T extends { _id: ID_T }, C, U, ID_T = string>(
  { routeParamName, navigationToBack, busKey }: FormConfig<T>,
  { getData, createFunction, updateFunction, deleteFunction }: ApiActions<T, C, U, ID_T>
) => {
  //#region Данные
  const route = useRoute()
  const { loading, loadingWrapper } = useLoading()
  const busEvent = useEventBus(busKey)

  const initialId = route.params[routeParamName] as ID_T

  const formRef = ref<FormInstance>()

  const dataSource: Ref<T | C | null> = ref(null)
  const dataForm: Ref<T | C | null> = ref(null)

  const dataUpdate: Ref<U | null> = ref(null)
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
  const copyFormData = (data: T | C) => {
    dataSource.value = structuredClone(data)
    dataForm.value = structuredClone(data)
  }

  /** Создает новую запись, после успешного создания перенаправляет на предыдущую страницу */
  const create = loadingWrapper(async () => {
    const { isValid } = await validateForm(formRef.value)
    if (!isValid) throw new Error('Ошибка валидации')

    const data = await createFunction(dataForm.value as C)
    VuNotificationShow('Успешно', `Создан ${String(data._id)}`)
    busEvent.emit({ status: 'create', data: data })
    await navigationToBack()
  })

  /** Обновляет существующую запись и обновляет данные формы */
  const update = loadingWrapper(async (isBackNavigation: boolean = false) => {
    const { isValid } = await validateForm(formRef.value)
    if (!isValid) throw new Error('Ошибка валидации')
    if (!dataUpdate.value) throw new Error('Нет данных для обновления')

    const data = await updateFunction((dataForm.value as T)._id, dataUpdate.value)
    VuNotificationShow('Успешно', `Изменен ${String(data._id)}`)
    copyFormData(data)
    busEvent.emit({ status: 'update', data: data })
    if (isBackNavigation) await navigationToBack()
  })

  /** Удаляет запись и перенаправляет на предыдущую страницу */
  const remove = loadingWrapper(async () => {
    const data = await deleteFunction((dataForm.value as T)._id)
    VuNotificationShow('Успешно', `Удален ${String(data._id)}`)
    busEvent.emit({ status: 'delete', data: data })
    await navigationToBack()
  })
  //#endregion

  //#region Жизненный цикл
  onMounted(
    loadingWrapper(async () => {
      const data = await getData(initialId)
      copyFormData(data)

      if (isUpdate.value) {
        watch(
          dataForm,
          () => {
            dataUpdate.value = getObjectDifference(dataSource.value, dataForm.value)
          },
          { deep: true }
        )
      }
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
