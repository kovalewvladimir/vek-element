import { type EventBusKey } from '@vek-element/ui'

/** Событие шины: что произошло */
export interface DemoEvent {
  text: string
}

/** Полезная нагрузка второго аргумента emit */
export type DemoPayload = number

/**
 * Ключ шины.
 *
 * Symbol с типом EventBusKey<T> даёт типизацию event/payload
 * во всех местах, где вызывается useEventBus.
 */
export const DEMO_BUS_KEY: EventBusKey<DemoEvent> = Symbol('demo-event-bus')
