import {
	type ColumnDef,
	type ColumnFiltersState,
	type ExpandedState,
	type GlobalFilterTableState,
	type Row,
	type SortingState,
	type Table,
	type TableOptions,
	type TableState
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

type RenderSubComponentProps<TData = any, TValue = any> = {
	row: Row<TData>
	table: Table<TData, TValue>
}

export type RenderSubComponent<TData, TValue = any> = (props: {
	row: Row<TData>
	table: Table<TData, TValue>
}) => React.ReactElement

// #region Data table prop types
export type DataTableProps<TData = any, TValue = any> = {
	/**
	 * Unique identifier for the table instance. Automatically generated if not provided.
	 */
	instanceId?: string
	/**
	 * Reference to the table instance. Useful for accessing table methods and properties.
	 */
	ref?: React.RefObject<Table<TData, TValue>>
	/**
	 * Array of data objects to be displayed in the table.
	 */
	data: Array<TData>
	/**
	 * Array of column definitions for the table. Each column can have various properties such as header, accessor, etc.
	 */
	columns: ColumnDef<TData & any, TValue>[]
	/**
	 * Table caption, which can be used to provide a title or description for the table.
	 * This is useful for accessibility and can be used by screen readers to describe the table content.
	 */
	caption?: string
	/**
	 * Loading state of the table. If true, skeleton loading will be shown.
	 */
	loading?: boolean
	/**
	 * Enable column resizing feature. This allows users to adjust the width of columns by dragging the edges.
	 */
	enableColumnResizing?: boolean
	/**
	 * Add some additional props to the table container component, like height, width, ...etc.
	 */
	containerProps?: React.ComponentProps<'div'>
	/**
	 * Optional function to render a custom header for the table.
	 */
	toolbarProps?: ToolbarProps
	/**
	 * Optional function to render a custom footer for the table.
	 */
	footerProps?: TableFooterProps
	/**
	 * Optional external expanded state in case you want to control the sorting state of the table from outside like server-side sorting.
	 */
	sorting?: SortingState
	/**
	 * Optional external expanded state in case you want to control the expanded state of the table from outside.
	 */
	expanded?: ExpandedState
	/**
	 * Intial state of the table. Can be used to set default values for sorting, filtering, etc.
	 */
	initialState?: Partial<TableState>
	/**
	 * Optional function to render a custom caption for the table.
	 */
	virtualizerOptions?: { estimateSize?: number; overscan?: number }
	/**
	 * Optional function to handle state changes in the table. This can be used to perform side effects when the table state changes.
	 * @param {Table<TData, TValue>} instance
	 * @returns
	 */
	onStateChange?: (instance: Table<TData, TValue>) => void
	/**
	 * Optional function to render sub-component for each row. This can be used to display additional information or actions related to the row.
	 * @param {RenderSubComponentProps<TData, TValue>} props
	 * @returns
	 */
	renderSubComponent?: (props: RenderSubComponentProps<TData, TValue>) => React.ReactElement
} & Partial<TableOptions<any>> &
	/**
	 * Additional props in case you want to control pagination state from outside like server-side pagination.
	 */
	PaginationProps<TData> &
	/**
	 * Additional props in case you want to control column filtering state from outside like server-side filter.
	 */
	ColumnFilterProps &
	/**
	 * Additional props in case you want to control column filtering state from outside like server-side sorting.
	 */
	SortingProps &
	/**
	 * Additional props in case you want to control column filtering state from outside like server-side searching by term.
	 */
	GlobalFilterProps

export type RowSelectionType = 'single' | 'multiple' | undefined
