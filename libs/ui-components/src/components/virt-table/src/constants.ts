import {
  type FilterBoolType,
  type FilterDateType,
  type FilterNumberType,
  type FilterStringType
} from './types'

export const COLUMN_MIN_WIDTH = 25
export const COLUMN_MAX_WIDTH = 1000
export const COLUMN_AUTO_WIDTH = -1

export const FILTER_TYPE_LABEL: Record<
  FilterStringType | FilterNumberType | FilterDateType | FilterBoolType,
  string
> = {
  contains: 'Содержит',
  notcontains: 'Не содержит',

  eq: 'Равно',
  ne: 'Не равно',
  gt: 'Больше',
  lt: 'Меньше',
  ge: 'Больше или равно',
  le: 'Меньше или равно',

  before: 'До',
  after: 'После',
  between: 'Между',

  null: 'Пусто',
  notnull: 'Не пусто'
}
