import { type Ref } from 'vue'

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

export interface ICreateDataItemOptions {
  /** Индекс, куда вставить новый элемент */
  index?: number
  /** Нужно ли клонировать данные? */
  isCloneData?: boolean
}
export interface IUpdateDataItemOptions {
  /** Идентификатор элемента */
  index: number
  /** Нужно ли клонировать данные? */
  isCloneData?: boolean
}

export interface IVirtTableExpose {
  /** Функция для перезагрузки данных */ reloadData: () => Promise<void>

  /** Данные таблицы */
  data: Ref<any[]>
  /** Функция для поиска индекса элемента в таблице */
  findDataItemIndex: (value: any) => number
  /** Функция для создания нового элемента в таблице */
  createDataItem: (item: any, options?: ICreateDataItemOptions) => void
  /** Функция для обновления данных в таблице */
  updateDataItem: (item: any, options: IUpdateDataItemOptions) => void
  /** Функция для удаления элемента из таблицы */
  deleteDataItem: (index: number) => any
  /** Функция для удаления нескольких элементов из таблицы */
  deleteDataItems: (index: number, count: number) => any[]
}
