/* eslint-disable no-mixed-spaces-and-tabs */
import {
	type ColumnFiltersState,
	type GlobalFilterTableState,
	type ColumnDef,
	type Row,
	type SortingState,
	type Table,
	type TableOptions
} from '@tanstack/react-table'
import React from 'react'

export type ToolbarProps = {
	hidden?: boolean
	ltr?: boolean
	slot?: React.FC<{ table: Table<any> }>
}

// #region Pagination prop types
type PaginationBaseProps<TData> = {
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

// #region Datatable prop types
export type DataTableProps<TData = any, TValue = any> = {
	data: Array<TData>
	columns: ColumnDef<TData & any, TValue>[]
	caption?: string
	loading?: boolean
	enableColumnResizing?: boolean
	containerProps?: React.ComponentProps<'div'>
	toolbarProps?: ToolbarProps
	sorting?: SortingState
	onGetInstance?: React.Dispatch<React.SetStateAction<Table<TData>>>
	renderSubComponent?: RenderSubComponent
} & Partial<TableOptions<any>> &
	PaginationProps<TData> &
	ColumnFilterProps &
	SortingProps &
	GlobalFilterProps
