import { type Ref, ref } from 'vue'

const data: Record<symbol, Ref<Array<unknown>>> = {}

/** Хук для управления данными в виртуальной таблице. Позволяет создавать, получать и удалять хранилище данных по уникальному идентификатору. */
export const useVirtTableData = <T>(id?: symbol) => {
  const _id = id || Symbol(Math.random().toString(36).slice(2, 11))

  const createStore = (): Ref<Array<T>> => {
    if (!data[_id]) {
      data[_id] = ref([]) as Ref<Array<T>>
    }
    return data[_id] as Ref<Array<T>>
  }

  const getStore = (): Ref<Array<T>> | null => {
    if (!data[_id]) return null

    return data[_id] as Ref<Array<T>>
  }

  const destroyStore = () => {
    delete data[_id]
  }

  return { createStore, getStore, destroyStore }
}
