/**
 * Функция для асинхронной задержки
 *
 * @param ms - количество миллисекунд для задержки
 * @returns Promise, который разрешается после задержки
 */
export const asyncSleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Функция для синхронной задержки
 *
 * @param ms - количество миллисекунд для задержки
 */
export const syncSleep = (ms: number): void => {
  const date = Date.now()
  let currentDate: number
  do {
    currentDate = Date.now()
  } while (currentDate - date < ms)
}
