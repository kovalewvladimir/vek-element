import { Component } from 'vue'

import { AsyncLoadComponent } from './types'

/** Проверка на асинхронную загрузку компонента */
const isAsyncLoadComponent = (
  component: AsyncLoadComponent | Component
): component is AsyncLoadComponent => {
  return typeof component === 'function'
}

export { isAsyncLoadComponent }
