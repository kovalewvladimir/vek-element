import { COLUMN_AUTO_WIDTH } from './constants'

type onLoadDataType = (params: IOnLoadDataParams) => Promise<any[]>
type formatterType = ((value: any) => string) | null

type AlignType = 'left' | 'right'
type ColumnType = 'string' | 'number' | 'date' | 'string[]'
type SortType = 'ASC' | 'DESC' | null
type FilterLogicalOperator = 'and' | 'or'
type FilterContains = 'contains' | 'notcontains'
type FilterEquals = 'eq' | 'ne'
type FilterCompare = 'gt' | 'lt'
type FilterCompareEquals = 'ge' | 'le'
type FilterEmpty = 'null' | 'notnull'
type FilterStringType = FilterContains | FilterEquals | FilterEmpty
type FilterNumberType = FilterEquals | FilterCompare | FilterCompareEquals | FilterEmpty
type FilterDateType = 'eq' | 'before' | 'after' | 'between'
type FilterType = IFilterString | IFilterNumber | IFilterDate

interface IOnLoadDataParams {
  page: number
  size: number
  sort?: IColumnSort
  filters?: IFilters[]
}

interface IColumnSort {
  prop: string
  sort: SortType
}

interface IFilterString {
  type: FilterStringType
  value: string
}

interface IFilterNumber {
  type: FilterNumberType
  value: number
}

interface IFilterDate {
  type: FilterStringType
  value: string | [string, string]
}

interface IFilters {
  prop: string
  type: ColumnType
  operator: FilterLogicalOperator
  filters: ReadonlyArray<FilterType>
}

interface IColumn {
  prop: string
  type: ColumnType

  label: string
  width?: number
  align?: AlignType
  visible?: boolean
  showOverflowTooltip?: boolean

  formatter?: formatterType

  menu?: boolean
  sort?: SortType
  operator?: FilterLogicalOperator
  filters?: ReadonlyArray<FilterType>
}

// readonly нужен за контролем мутации Column
class Column implements IColumn {
  readonly prop: string
  readonly type: ColumnType

  readonly label: string
  readonly width: number
  readonly align: AlignType
  readonly visible: boolean
  readonly showOverflowTooltip: boolean

  readonly formatter: formatterType

  readonly menu: boolean
  readonly sort: SortType
  readonly operator: FilterLogicalOperator
  readonly filters: ReadonlyArray<FilterType>

  constructor(column: IColumn) {
    this.prop = column.prop
    this.type = column.type

    this.label = column.label
    this.width = column.width ?? COLUMN_AUTO_WIDTH
    this.align = column.align ?? 'left'
    this.visible = column.visible ?? true
    this.showOverflowTooltip = column.showOverflowTooltip ?? true

    this.formatter = column.formatter ?? null

    this.menu = column.menu ?? true
    this.sort = column.sort ?? null
    this.operator = 'or'
    this.filters = column.filters ?? []
  }

  setWidth(width: number): void {
    // @ts-expect-error: Редактирую значение readonly только из спец методов класса
    this.width = width
  }
  setVisibility(visible: boolean): void {
    // @ts-expect-error: Редактирую значение readonly только из спец методов класса
    this.visible = visible
  }
  setOperator(operator: FilterLogicalOperator): void {
    // @ts-expect-error: Редактирую значение readonly только из спец методов класса
    this.operator = operator
  }

  addFilter(filter: FilterType): void {
    // @ts-expect-error: Редактирую значение readonly только из спец методов класса
    this.filters.push(filter)
  }
  deleteFilter(filter: FilterType): void {
    const index = this.filters.indexOf(filter)
    // @ts-expect-error: Редактирую значение readonly только из спец методов класса
    if (index !== -1) this.filters.splice(index, 1)
  }
  resetFilter(): void {
    // @ts-expect-error: Редактирую значение readonly только из спец методов класса
    this.filters = []
  }
  resetSort(): void {
    // @ts-expect-error: Редактирую значение readonly только из спец методов класса
    this.sort = null
  }
}

class Columns extends Array<Column> {
  constructor(...columns: IColumn[]) {
    super(...columns.map((v) => new Column(v)))
  }

  getByProp(prop: string): Column | undefined {
    return this.find((v) => v.prop === prop)
  }

  visibleAll(): void {
    for (const v of this) v.setVisibility(true)
  }

  resetSort(): void {
    for (const v of this) v.resetSort()
  }
  getSort(): IColumnSort | undefined {
    const column = this.find((v) => v.sort !== null)
    if (column) return { prop: column.prop, sort: column.sort }
  }

  setSort(column: Column, sort: SortType): void {
    // Реализую изменения сортировки только через Columns
    // тк нужно сбрасывать сортировку

    const columnIndex = this.indexOf(column)
    if (columnIndex !== -1) {
      this.resetSort()
      // @ts-expect-error: Реализую изменения сортировки только через Columns тк нужно сбрасывать сортировку
      this[columnIndex].sort = sort
    }
  }

  getFilters(): IFilters[] | undefined {
    const filters: IFilters[] = []

    for (const column of this)
      if (column.filters.length > 0)
        filters.push({
          prop: column.prop,
          type: column.type,
          operator: column.operator,
          filters: column.filters
        })

    return filters.length > 0 ? filters : undefined
  }
  resetFilters(): void {
    for (const v of this) v.resetFilter()
  }
}

export type {
  ColumnType,
  FilterDateType,
  FilterLogicalOperator,
  FilterNumberType,
  FilterStringType,
  FilterType,
  IColumn,
  IColumnSort,
  IFilterDate,
  IFilterNumber,
  IFilters,
  IFilterString,
  IOnLoadDataParams,
  onLoadDataType,
  SortType
}

export { Column, Columns }
