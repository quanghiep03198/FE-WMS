import ErrorBoundary from '@/app/_components/_errors/-error-boundary'
import useQueryParams from '@/common/hooks/use-query-params'
import env from '@/common/utils/env'
import {
	ColumnDef,
	ColumnFiltersState,
	OnChangeFn,
	RowSelectionState,
	SortingState,
	TableOptions,
	getCoreRowModel,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable
} from '@tanstack/react-table'
import { useDeepCompareEffect } from 'ahooks'
import _ from 'lodash'
import { memo, useCallback, useState } from 'react'
import { Div } from '../..'
import { TableProvider } from '../context/table.context'
import { fuzzyFilter } from '../utils/fuzzy-filter.util'
import TableDataGrid from './table'
import TablePagination from './table-pagination'
import TableToolbar from './table-toolbar'

type ConditionalPaginationProps<TData, T extends boolean> = T extends true
	? Required<Omit<Pagination<TData>, 'docs'>>
	: Partial<Omit<Pagination<TData>, 'docs'>>

type PaginationProps<TData, T extends boolean = false> = ConditionalPaginationProps<TData, T> & {
	hidden?: boolean
	manualPagination?: boolean
}

export interface DataTableProps<TData, TValue> extends Partial<TableOptions<TData | any>> {
	data: Array<TData>
	columns: ColumnDef<TData | any, TValue>[]
	loading?: boolean
	manualFilter?: boolean
	enableColumnResizing?: boolean
	containerProps?: React.ComponentProps<'div'>
	toolbarProps?: { hidden?: boolean; ltr?: boolean; slot?: React.ReactNode }
	selectedRows?: Array<any>
	paginationProps?: PaginationProps<TData>
	onRowsSelectionChange?: (...args: any[]) => void | OnChangeFn<RowSelectionState>
}

function DataTable<TData, TValue>({
	data,
	columns,
	loading,
	containerProps,
	paginationProps = { hidden: false, manualPagination: false },
	toolbarProps = { hidden: false },
	selectedRows,
	enableColumnResizing = true,
	enableRowSelection = false,
	enableColumnFilters = true,
	enableSorting = true,
	enableExpanding = true,
	enableGlobalFilter = true,
	globalFilterFn = fuzzyFilter,
	onRowsSelectionChange,
	...props
}: DataTableProps<TData, TValue>) {
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
	const [sorting, setSorting] = useState<SortingState>([])
	const [rowSelection, setRowSelection] = useState({})
	const [globalFilter, setGlobalFilter] = useState<string>('')
	const { searchParams } = useQueryParams()
	const pagination = {
		pageIndex: searchParams.page ? Number(searchParams.page) - 1 : 0,
		pageSize: searchParams.limit ? Number(searchParams.limit) : 10
	}

	const table = useReactTable({
		data: data ?? [],
		columns,
		initialState: { globalFilter: '', columnFilters: [], pagination },
		state: {
			sorting,
			columnFilters,
			globalFilter,
			pagination
		},
		manualPagination: paginationProps.manualPagination,
		enableColumnFilters,
		enableSorting,
		enableExpanding,
		enableGlobalFilter,
		enableColumnResizing,
		columnResizeMode: 'onChange',
		debugAll: false,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onGlobalFilterChange: setGlobalFilter,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
		...props
	} as TableOptions<TData>)

	const resetAllFilters = useCallback(() => {
		table.resetGlobalFilter(table.initialState.globalFilter)
		table.resetColumnFilters(true)
	}, [])

	useDeepCompareEffect(() => {
		if (onRowsSelectionChange && typeof onRowsSelectionChange === 'function')
			onRowsSelectionChange(table.getSelectedRowModel().flatRows)
	}, [table.getSelectedRowModel().flatRows])

	useDeepCompareEffect(() => {
		if (Array.isArray(selectedRows) && selectedRows.length === 0) table.resetRowSelection()
	}, [selectedRows])

	return (
		<ErrorBoundary>
			<TableProvider hasNoFilter={columnFilters.length === 0 && globalFilter.length === 0}>
				<Div className='flex h-full flex-col items-stretch gap-y-3'>
					{toolbarProps.hidden ? null : (
						<TableToolbar
							table={table}
							isFilterDirty={globalFilter.length !== 0 || columnFilters.length !== 0}
							globalFilter={globalFilter}
							onGlobalFilterChange={setGlobalFilter}
							onResetFilters={resetAllFilters}
							slot={toolbarProps.slot}
						/>
					)}
					<TableDataGrid containerProps={containerProps} table={table} columns={columns} loading={loading} />
					{paginationProps.hidden ? null : (
						<TablePagination
							table={table}
							enableRowSelection={enableRowSelection as boolean}
							{..._.omit(paginationProps, 'hidden')}
						/>
					)}
				</Div>
			</TableProvider>
		</ErrorBoundary>
	)
}

export default memo(DataTable)
