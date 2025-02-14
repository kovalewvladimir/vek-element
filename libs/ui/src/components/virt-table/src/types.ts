export type FormatterType = ((value: any) => string) | null
export type AlignType = 'left' | 'right'
export type ColumnType = 'string' | 'number' | 'date' | 'string[]'
export type SortType = 'ASC' | 'DESC' | null
export type FilterLogicalOperator = 'and' | 'or'
type FilterContains = 'contains' | 'notcontains'
type FilterEquals = 'eq' | 'ne'
type FilterCompare = 'gt' | 'lt'
type FilterCompareEquals = 'ge' | 'le'
type FilterEmpty = 'null' | 'notnull'
export type FilterStringType = FilterContains | FilterEquals | FilterEmpty
export type FilterNumberType = FilterEquals | FilterCompare | FilterCompareEquals | FilterEmpty
export type FilterDateType = 'eq' | 'before' | 'after' | 'between'
export type FilterType = IFilterString | IFilterNumber | IFilterDate

export type OnLoadDataType<T = any> = (params: IOnLoadDataParams) => Promise<T[]>
export interface IOnLoadDataParams {
  page: number
  size: number
  sort?: IColumnSort
  filters?: IFilters[]
}

export interface IColumnSort {
  prop: string
  sort: SortType
}

export interface IFilterString {
  type: FilterStringType
  value: string
}

export interface IFilterNumber {
  type: FilterNumberType
  value: number
}

export interface IFilterDate {
  type: FilterDateType
  value: string | [string, string]
}

export interface IFilters {
  prop: string
  type: ColumnType
  operator: FilterLogicalOperator
  filters: ReadonlyArray<FilterType>
}

export interface IColumn {
  /** Имя свойства в данных */
  prop: string
  /** Тип данных */
  type: ColumnType

  /** Название колонки */
  label: string
  /** Ширина колонки */
  width?: number
  /** Выравнивание текста */
  align?: AlignType
  /** Видимость колонки */
  visible?: boolean
  /** Показывать всплывающую подсказку при переполнении */
  showOverflowTooltip?: boolean

  /** Форматтер */
  formatter?: FormatterType

  /** Показывать меню */
  menu?: boolean
  /** Сортировка */
  sort?: SortType
  /** Логический оператор для фильтров */
  operator?: FilterLogicalOperator
  /** Фильтры */
  filters?: ReadonlyArray<FilterType>
}
