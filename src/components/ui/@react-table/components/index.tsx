import useQueryParams from '@/common/hooks/use-query-params'
import {
	ColumnDef,
	ColumnFiltersState,
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
import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { Div } from '../..'
import { TableProvider } from '../context/table.context'
import { fuzzyFilter } from '../utils/fuzzy-filter.util'
import TableDataGrid from './table'
import TablePagination from './table-pagination'
import TableToolbar from './table-toolbar'
import env from '@/common/utils/env'
import _ from 'lodash'
import ErrorBoundary from '@/app/_components/_errors/-error-boundary'

type ConditionalPaginationProps<TData, T extends boolean> = T extends true
	? Required<Omit<Pagination<TData>, 'docs'>>
	: Partial<Omit<Pagination<TData>, 'docs'>>

type PaginationProps<TData, T extends boolean = false> = ConditionalPaginationProps<TData, T> & {
	hidden?: boolean
	manualPagination?: T
}

export interface DataTableProps<TData, TValue> extends Partial<TableOptions<TData | any>> {
	data: Array<TData>
	columns: ColumnDef<TData | any, TValue>[]
	loading?: boolean
	manualFilter?: boolean
	enableColumnResizing?: boolean
	toolbarProps?: { hidden?: boolean; ltr?: boolean; slot?: React.ReactNode }
	selectedRows?: Array<any>
	paginationProps?: PaginationProps<TData>
	onRowsSelectionChange?: (...args: any) => void
}

function DataTable<TData, TValue>({
	data,
	columns,
	loading,
	selectedRows,
	paginationProps = { hidden: false, manualPagination: false },
	toolbarProps = { hidden: false },
	enableColumnResizing = false,
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
	const [globalFilter, setGlobalFilter] = useState<string>('')
	const { searchParams } = useQueryParams()
	const pagination = {
		pageIndex: searchParams.page ? Number(searchParams.page) - 1 : 0,
		pageSize: searchParams.limit ? Number(searchParams.limit) : 10
	}

	const table = useReactTable({
		data: data ?? [],
		columns,
		initialState: { pagination },
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
		debugTable: env('VITE_NODE_ENV') === 'development',
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

	const clearAllFilter = useCallback(() => {
		setGlobalFilter('')
		setColumnFilters([])
	}, [])

	useEffect(() => {
		if (onRowsSelectionChange && typeof onRowsSelectionChange === 'function')
			onRowsSelectionChange(table.getSelectedRowModel().flatRows)
	}, [table.getSelectedRowModel().flatRows])

	useEffect(() => {
		if (Array.isArray(selectedRows) && selectedRows.length === 0) table.resetRowSelection()
	}, [selectedRows])

	return (
		<ErrorBoundary>
			<TableProvider hasNoFilter={columnFilters.length === 0 && globalFilter.length === 0}>
				<Div className='flex h-full flex-col items-stretch gap-y-4'>
					{toolbarProps.hidden ? null : (
						<TableToolbar
							table={table}
							isFilterDirty={globalFilter.length !== 0 || columnFilters.length !== 0}
							globalFilter={globalFilter}
							onGlobalFilterChange={setGlobalFilter}
							onResetFilters={clearAllFilter}
							slot={toolbarProps.slot}
						/>
					)}
					<TableDataGrid table={table} columns={columns} loading={loading} />
					{paginationProps.hidden ? null : (
						<TablePagination table={table} {..._.omit(paginationProps, 'hidden')} />
					)}
				</Div>
			</TableProvider>
		</ErrorBoundary>
	)
}

export default memo(DataTable)
