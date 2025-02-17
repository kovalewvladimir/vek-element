import { COLUMN_AUTO_WIDTH } from './constants'
import {
  type AlignType,
  type ColumnType,
  type FilterLogicalOperator,
  type FilterType,
  type FormatterType,
  type IColumn,
  type IColumnSort,
  type IFilters,
  type SortType
} from './types'

export class Column {
  // ------------------------------------------
  // readonly нужен за контролем мутации Column
  // ------------------------------------------

  readonly prop: string
  readonly type: ColumnType

  readonly slot: string

  readonly label: string
  readonly width: number
  readonly align: AlignType
  readonly visible: boolean
  readonly showOverflowTooltip: boolean

  readonly formatter: FormatterType

  readonly menu: boolean
  readonly sort: SortType
  readonly operator: FilterLogicalOperator
  readonly filters: ReadonlyArray<FilterType>

  constructor(column: IColumn) {
    this.prop = column.prop
    this.type = column.type

    this.slot = column.prop.includes('.') ? column.prop.replaceAll('\.', '_') : column.prop

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

export class Columns extends Array<Column> {
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
