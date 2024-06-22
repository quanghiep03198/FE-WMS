import ErrorBoundary from '@/app/_components/_errors/-error-boundary'
import useQueryParams from '@/common/hooks/use-query-params'
import {
	ColumnDef,
	ColumnFiltersState,
	Row,
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
import _ from 'lodash'
import { memo, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Div, Typography } from '../..'
import { TableProvider } from '../context/table.context'
import { fuzzyFilter } from '../utils/fuzzy-filter.util'
import TableDataGrid from './table'
import TablePagination from './table-pagination'
import TableToolbar from './table-toolbar'
import { useDeepCompareEffect } from 'ahooks'

type ConditionalPaginationProps<TData, T extends boolean> = T extends true
	? Required<Omit<Pagination<TData>, 'data'>>
	: Partial<Omit<Pagination<TData>, 'data'>>

export type PaginationProps<TData, T extends boolean = false> = ConditionalPaginationProps<TData, T> & {
	hidden?: boolean
	prefetch?: (...args: any[]) => void
}

type ToolbarProps = { hidden?: boolean; ltr?: boolean; slot?: React.ReactNode }

export interface DataTableProps<TData = any, TValue = any> extends Partial<TableOptions<any>> {
	data: Array<TData>
	columns: ColumnDef<TData | any, TValue>[]
	loading?: boolean
	enableColumnResizing?: boolean
	containerProps?: React.ComponentProps<'div'>
	toolbarProps?: ToolbarProps
	paginationProps?: PaginationProps<TData>
	rowSelectionState?: Row<TData>[]
	onRowSelectionStateChange?: React.Dispatch<React.SetStateAction<Row<TData>[]>>
}

function DataTable<TData, TValue>({
	data,
	columns,
	loading,
	containerProps,
	paginationProps = { hidden: false, prefetch: undefined },
	toolbarProps = { hidden: false },
	rowSelectionState,
	manualPagination = false,
	manualSorting = false,
	manualFiltering = false,
	enableColumnResizing = true,
	enableRowSelection = false,
	enableColumnFilters = true,
	enableSorting = true,
	enableExpanding = true,
	enableGlobalFilter = true,
	globalFilterFn = fuzzyFilter,
	onRowSelectionStateChange,
	...props
}: DataTableProps<TData, TValue>) {
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
	const [sorting, setSorting] = useState<SortingState>([])
	const [globalFilter, setGlobalFilter] = useState<string>('')
	const { t } = useTranslation()
	const { searchParams } = useQueryParams({
		page: 1,
		limit: 10
	})

	const table = useReactTable({
		data: data ?? [],
		columns,
		initialState: {
			globalFilter: '',
			columnFilters: [],
			pagination: {
				pageIndex: Number(searchParams.page) - 1,
				pageSize: Number(searchParams.limit)
			}
		},
		state: {
			sorting,
			columnFilters,
			globalFilter,
			pagination: {
				pageIndex: Number(searchParams.page) - 1,
				pageSize: Number(searchParams.limit)
			}
		},
		manualPagination,
		manualSorting,
		manualFiltering,
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
		if (typeof onRowSelectionStateChange === 'function') {
			onRowSelectionStateChange(table.getSelectedRowModel().flatRows)
		}
	}, [table.getSelectedRowModel().flatRows])

	useDeepCompareEffect(() => {
		if (Array.isArray(rowSelectionState) && rowSelectionState.length === 0) {
			table.resetRowSelection()
		}
	}, [rowSelectionState])

	const rowSelectionCount =
		String(table.getFilteredSelectedRowModel().rows.length) + '/' + String(table.getFilteredRowModel().rows.length)

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
					<TableDataGrid
						containerProps={containerProps}
						data={data}
						table={table}
						columns={columns}
						loading={loading}
					/>
					<Div className='flex items-center'>
						{enableRowSelection && (
							<Typography className='text-sm font-medium sm:hidden'>
								{t('ns_common:table.selected_rows', {
									selectedRows: rowSelectionCount,
									defaultValue: rowSelectionCount
								})}
							</Typography>
						)}
						{!paginationProps.hidden && (
							<TablePagination
								table={table}
								manualPagination={manualPagination}
								{..._.omit(paginationProps, ['hidden'])}
							/>
						)}
					</Div>
				</Div>
			</TableProvider>
		</ErrorBoundary>
	)
}

export default memo(DataTable)
