/**
 * Функция для асинхронной задержки
 *
 * @param ms - количество миллисекунд для задержки
 * @returns Promise, который разрешается после задержки
 */
export const asyncSleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
