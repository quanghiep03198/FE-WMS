import {
	TableState,
	type ColumnDef,
	type ColumnFiltersState,
	type GlobalFilterTableState,
	type Row,
	type SortingState,
	type Table,
	type TableOptions
} from '@tanstack/react-table'
import React from 'react'

export type ToolbarProps<TData = any> = {
	hidden?: boolean
	rtl?: boolean
	slotLeft?: React.FC<{ table: Table<TData> }>
	slotRight?: React.FC<{ table: Table<TData> }>
}

export type TableFooterProps<TData = any> = {
	hidden?: boolean
	rtl?: boolean
	slot?: React.FC<{ table: Table<TData> }>
}

// #region Pagination prop types
type PaginationBaseProps<TData = any> = {
	hidden?: boolean
	prefetch?: (params: Record<string, any>) => void
} & Partial<Omit<Pagination<TData>, 'data'>>

type PaginationProps<TData> =
	| {
			manualPagination: true
			paginationProps: PaginationBaseProps<TData>
	  }
	| {
			manualPagination?: false
			paginationProps?: PaginationBaseProps<TData>
	  }

// #region Column filters prop types
type ColumnFilterProps =
	| {
			manualFiltering: true
			columnFilters: ColumnFiltersState
			onColumnFiltersChange: React.Dispatch<React.SetStateAction<ColumnFiltersState>>
	  }
	| {
			manualFiltering?: false
			columnFilters?: ColumnFiltersState
			onColumnFiltersChange?: React.Dispatch<React.SetStateAction<ColumnFiltersState>>
	  }

// #region Global filter prop types
type GlobalFilterProps =
	| {
			manualFiltering: true
			enableGlobalFilter: true
			globalFilter: GlobalFilterTableState['globalFilter']
			onGlobalFilterChange: React.Dispatch<React.SetStateAction<GlobalFilterTableState['globalFilter']>>
	  }
	| {
			manualFiltering?: true | false
			enableGlobalFilter?: false
			globalFilter?: GlobalFilterTableState['globalFilter']
			onGlobalFilterChange?: React.Dispatch<React.SetStateAction<GlobalFilterTableState['globalFilter']>>
	  }

// #region Sorting prop types
type SortingProps =
	| {
			manualSorting: true
			sorting: SortingState
			onSortingChange: React.Dispatch<React.SetStateAction<SortingState>>
	  }
	| {
			manualSorting?: false
			sorting?: SortingState
			onSortingChange?: React.Dispatch<React.SetStateAction<SortingState>>
	  }

export type RenderSubComponent = (props: { row: Row<TData & any>; table: Table<TData, TValue> }) => React.ReactElement

// #region Data table prop types
export type DataTableProps<TData = any, TValue = any> = {
	data: Array<TData>
	columns: ColumnDef<TData & any, TValue>[]
	caption?: string
	loading?: boolean
	enableColumnResizing?: boolean
	containerProps?: React.ComponentProps<'div'>
	toolbarProps?: ToolbarProps
	footerProps?: TableFooterProps
	sorting?: SortingState
	initialState?: Partial<TableState>
	onStateChange?: (instance: Table<TData, TValue>) => void
	renderSubComponent?: RenderSubComponent
} & Partial<TableOptions<any>> &
	PaginationProps<TData> &
	ColumnFilterProps &
	SortingProps &
	GlobalFilterProps

export type RowSelectionType = 'single' | 'multiple' | undefined
