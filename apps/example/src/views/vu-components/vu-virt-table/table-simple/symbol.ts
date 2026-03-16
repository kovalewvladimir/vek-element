import { type EventBusActionKeyType } from '@vek-element/ui'

import { type TableSimpleItem } from './data'

export const TABLE_SIMPLE_BUS_KEY: EventBusActionKeyType<TableSimpleItem> =
  Symbol('table-simple-bus-key')
