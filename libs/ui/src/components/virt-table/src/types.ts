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

export type OnLoadDataType<T> = (params: IOnLoadDataParams) => Promise<T>
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

export interface IFindDataItemIndexOptions {
  /** Выбросить исключение, если элемент не найден (по умолчанию false) */
  throwIfNotFound?: boolean
}
export interface IPushDataItemOptions {
  /** Индекс, куда вставить новый элемент */
  index?: number
  /** Нужно ли клонировать данные? */
  isCloneData?: boolean
}
export interface IPushDataTreeItemOptions {
  /** Нужно ли клонировать данные? */
  isCloneData?: boolean
}
export interface IUpdateDataItemOptions {
  /** Идентификатор элемента */
  index: number
  /** Нужно ли клонировать данные? */
  isCloneData?: boolean
}

export interface IVirtTableExpose<T> {
  /** Функция для перезагрузки данных */
  reloadData: () => Promise<void>
  /** Данные таблицы */
  data: Ref<T[]>
  /** Функция для поиска индекса элемента в таблице */
  findDataItemIndex: (value: any, options?: IFindDataItemIndexOptions) => number
  /** Функция для добавления нового элемента в таблице */
  pushDataItem: (item: T | T[], options?: IPushDataItemOptions) => void
  /** Функция для добавления элемента в дерево данных */
  pushDataTreeItem: (row: T, item: T | T[], options?: IPushDataTreeItemOptions) => void
  /** Функция для обновления данных в таблице */
  updateDataItem: (item: T, options: IUpdateDataItemOptions) => void
  /** Функция для удаления элемента из таблицы */
  deleteDataItem: (index: number) => T | null
  /** Функция для удаления нескольких элементов из таблицы */
  deleteDataItems: (index: number, count: number) => T[]

  /** Переключение состояния раскрытия строки */
  toggleRowExpansion(index: number, expanded?: boolean): Promise<void>
}
