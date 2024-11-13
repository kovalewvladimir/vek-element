/**
 * Проверяет, является ли значение null.
 *
 * @param value - Значение для проверки.
 * @returns Возвращает true, если значение является null, иначе false.
 */
export function isNull(value: unknown): value is null {
  return value === null
}

/**
 * Проверяет, является ли значение undefined.
 *
 * @param value - Значение для проверки.
 * @returns Возвращает true, если значение является undefined, иначе false.
 */
export function isUndefined(value: unknown): value is undefined {
  return value === undefined
}
