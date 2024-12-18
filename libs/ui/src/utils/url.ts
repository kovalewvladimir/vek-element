/**
 * Функция для склеивания путей
 *
 * @param rootPath корневой путь
 * @param subPath подпуть
 * @returns склеенный путь без слэшей в конце
 */
export const joinPath = (rootPath: string, subPath: string) => {
  const root = trimEndPath(rootPath)
  const sub = trimStartPath(subPath)

  return trimEndPath(`${root}/${sub}`)
}

/** Функция для обрезания слэшей в конце пути */
export const trimEndPath = (path: string) => path.replace(/\/+$/, '')

/** Функция для обрезания слэшей в начале пути */
export const trimStartPath = (path: string) => path.replace(/^\/+/, '')
