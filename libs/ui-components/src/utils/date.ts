const dateFormatterMonth = new Intl.DateTimeFormat('ru-RU', { month: 'long' })

/**
 * Получить название месяца с большой буквы
 *
 * @param {number} month - номер месяца
 */
export const getCapitalizedMonth = (month: number): string => {
  const now = new Date()
  const currentYear = now.getFullYear()

  const date = new Date(currentYear, month - 1, 1)
  const textMonth = dateFormatterMonth.format(date)
  const capitalizedTextMonth = textMonth.charAt(0).toUpperCase() + textMonth.slice(1)

  return capitalizedTextMonth
}

/**
 * Преобразовать дату в формат для отправки на backend
 *
 * Формат: DD-MM-YYYY -> YYYY-MM-DD
 *
 * @param {Date} date - дата
 */
export const dateToBackendFormat = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

/**
 * Преобразовать дату из формата backend в формат frontend
 *
 * Формат: YYYY-MM-DD -> DD-MM-YYYY
 *
 * @param date
 * @returns
 */
export const dateBackendToFrontendFormat = (date: string) => {
  if (typeof date !== 'string') return date

  const split = date.split('-')
  if (split.length !== 3) return date

  const [year, month, day] = split
  return `${day}-${month}-${year}`
}

/**
 * Преобразовать дату из формата ISO в формат frontend
 *
 * Формат: YYYY-MM-DDTHH:MM:SS -> DD-MM-YYYY
 *
 * @param date
 * @returns
 */
export const dateIsoToFrontendFormat = (date: string) => {
  if (typeof date !== 'string') return date

  const split = date.split('T')
  if (split.length !== 2) return date

  const [datePart] = split
  const [year, month, day] = datePart.split('-')
  return `${day}-${month}-${year}`
}

/**
 * Преобразовать время из формата ISO в формат frontend
 *
 * Формат: YYYY-MM-DDTHH:MM:SS -> HH:MM:SS
 *
 * @param date
 * @returns
 */
export const timeIsoToFrontendFormat = (date: string) => {
  if (typeof date !== 'string') return date

  const split = date.split('T')
  if (split.length !== 2) return date

  const [, timePart] = split
  const [time] = timePart.split('.')
  return time
}
