import { type Ref } from 'vue'

export type FormatterType = ((value: any) => string) | null
export type AlignType = 'left' | 'right'
export type ColumnType = 'string' | 'number' | 'date' | 'string[]' | 'bool'
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
export type FilterBoolType = FilterEquals | FilterEmpty
export type FilterType = IFilterString | IFilterNumber | IFilterDate | IFilterBool

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

/** Параметры функции расчёта итога по колонке */
export interface ISummaryParams<T = any> {
  /** Строки, участвующие в расчёте (по умолчанию только верхний уровень дерева) */
  rows: T[]
  /** Колонка, для которой считается итог */
  column: IColumn
  /** Итоги, полученные через `summary.onLoad` или `setSummary`. `null` — если их нет */
  serverData: Record<string, any> | null
  /** Загружены ли все страницы данных */
  isAllDataLoaded: boolean
}

export type SummaryType = ((params: ISummaryParams) => any) | null

/** Параметры загрузки итогов с сервера */
export interface ISummaryLoadParams {
  sort?: IColumnSort
  filters?: IFilters[]
}

export type OnLoadSummaryType = (params: ISummaryLoadParams) => Promise<Record<string, any>>

/** Настройки строки ИТОГО */
export interface ISummary {
  /** Включить строку ИТОГО */
  enabled: boolean
  /** Показывать подпись в первой видимой колонке (по умолчанию true) */
  showLabel?: boolean
  /** Подпись в первой видимой колонке (по умолчанию 'ИТОГО') */
  label?: string
  /** Функция загрузки итогов с сервера */
  onLoad?: OnLoadSummaryType
  /** Учитывать дочерние строки дерева при расчёте (по умолчанию false) */
  includeTreeChildren?: boolean
}

/** Настройки строки ИТОГО с заполненными значениями по умолчанию */
export interface ISummaryResolved extends Required<Omit<ISummary, 'onLoad'>> {
  onLoad: OnLoadSummaryType | null
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

export interface IFilterBool {
  type: FilterBoolType
  value: boolean
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
  /** Разрешить изменение ширины колонки перетаскиванием границы (по умолчанию true) */
  resizable?: boolean
  /** Выравнивание текста */
  align?: AlignType
  /** Видимость колонки */
  visible?: boolean
  /** Показывать всплывающую подсказку при переполнении */
  showOverflowTooltip?: boolean

  /** Форматтер */
  formatter?: FormatterType

  /** Функция расчёта итога по колонке для строки ИТОГО */
  summary?: SummaryType
  /** Форматтер значения в строке ИТОГО (по умолчанию — `formatter` колонки) */
  summaryFormatter?: FormatterType

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
  /** Нужно ли открывать элемент? */
  isShouldOpen?: boolean
}
export interface IUpdateDataItemOptions {
  /** Идентификатор элемента */
  index: number
  /** Нужно ли клонировать данные? */
  isCloneData?: boolean
}

export interface IVirtTableExpose<T> {
  /** Функция для перезагрузки данных */
  reloadData: () => void
  /** Данные таблицы */
  data: Ref<T[]>
  /** Функция для поиска индекса элемента в таблице */
  findDataItemIndex: (value: any, options?: IFindDataItemIndexOptions) => number
  /** Функция для добавления нового элемента в таблице */
  pushDataItem: (item: T | T[], options?: IPushDataItemOptions) => void
  /** Функция для добавления элемента в дерево данных */
  pushDataTreeItem: (row: T, item: T | T[], options?: IPushDataTreeItemOptions) => Promise<void>
  /** Функция для обновления данных в таблице */
  updateDataItem: (item: T, options: IUpdateDataItemOptions) => void
  /** Функция для удаления элемента из таблицы */
  deleteDataItem: (index: number) => T | null
  /** Функция для удаления нескольких элементов из таблицы */
  deleteDataItems: (index: number, count: number) => T[]

  /** Переключение состояния раскрытия строки */
  toggleRowExpansion(index: number, expanded?: boolean): Promise<void>

  /** Установка итогов строки ИТОГО вручную (`null` — сброс) */
  setSummary: (data: Record<string, any> | null) => void
  /** Перезагрузка итогов строки ИТОГО через `summary.onLoad` */
  reloadSummary: () => Promise<void>
}
