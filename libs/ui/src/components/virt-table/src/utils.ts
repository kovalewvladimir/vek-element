import { type Columns } from './column'

const METADATA_KEY = '__meta'

/** Интерфейс для метаданных */
interface IMetaData {
  /** Обработанные данные. Используются для отображения в таблице */
  format: Record<string, any>
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

/** Получает значение форматированных данных для prop */
export function getFormatData(data: any, prop: string) {
  const meta: IMetaData = data[METADATA_KEY]
  return meta?.format[prop]
}

/**
 * Внедряет метаданные в объект данных
 *
 * @param data - объект данных (изменяется во время выполнения функции)
 * @param columns - массив колонок
 *
 * @returns  Ничего не возвращает, но мутирует объект данных, добавляя в него поле __meta
 */
export function injectMetaData(data: any, columns: Columns) {
  const format: Record<string, any> = {}

  // Формируем объект форматированных данных
  for (const column of columns) {
    if (column.formatter) {
      const value = getValueByPath(data, column.prop)
      format[column.prop] = column.formatter(value)
    }
  }

  const meta: IMetaData = { format }
  data[METADATA_KEY] = meta
}
