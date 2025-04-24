import { type Columns } from './column'

type MetaKeyType = string

const METADATA_KEY = '__meta' as MetaKeyType

/** Интерфейс для метаданных */
interface IMetaData<T> {
  /** Обработанные данные. Используются для отображения в таблице */
  format?: Record<string, any>

  /** Метаданные для древовидного отображения таблицы */
  tree?: {
    /** Состояние загрузки вложенных данных */
    isLoading: boolean
    /** Состояние открытия/закрытия вложенных данных */
    isOpen: boolean
    /** Уровень вложенности */
    level: number
    /** Кэшированные данные */
    cache: T[]
  }

  /** Состояние активности */
  isActive: boolean
}

/**
 * Возвращает значение из объекта по пути
 *
 * @param obj - объект
 * @param path - путь
 * @returns  значение
 */
export const getValueByPath = (obj: any, path: string) => {
  // eslint-disable-next-line unicorn/no-array-reduce
  return path.split('.').reduce((acc, part) => acc && acc[part], obj)
}

/** Получает метаданные из объекта данных */
export function getMetaData<T extends Record<MetaKeyType, IMetaData<T>>>(data: T): IMetaData<T> {
  if (data[METADATA_KEY] === undefined) {
    const initMeta: IMetaData<T> = {
      isActive: false
    }
    ;(data as any)[METADATA_KEY] = initMeta
  }
  return data[METADATA_KEY]
}

/** Получает значение форматированных данных для prop */
export function getFormatData(data: any, prop: string) {
  const meta = getMetaData(data)
  return meta.format?.[prop]
}

/**
 * Внедряет метаданные в объект данных
 *
 * @param data - объект данных (изменяется во время выполнения функции)
 * @param columns - массив колонок
 *
 * @returns  Ничего не возвращает, но мутирует объект данных, добавляя в него поле __meta
 */
export function injectFormatMetaData(data: any, columns: Columns) {
  const format: Record<string, any> = {}

  // Формируем объект форматированных данных
  for (const column of columns) {
    if (column.formatter) {
      const value = getValueByPath(data, column.prop)
      format[column.prop] = column.formatter(value)
    }
  }

  const meta = getMetaData(data)
  meta.format = format
}
