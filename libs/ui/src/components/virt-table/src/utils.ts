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

/**
 * Устанавливает значение в объекте по пути
 *
 * @param obj - объект
 * @param path - путь
 * @param value - значение
 *
 */
export const setValueByPath = (obj: any, path: string, value: any) => {
  const parts = path.split('.')
  const last = parts.pop()
  if (!last) return
  // eslint-disable-next-line unicorn/no-array-reduce
  const target = parts.reduce((acc, part) => {
    if (!acc[part]) acc[part] = {}
    return acc[part]
  }, obj)
  target[last] = value
}
