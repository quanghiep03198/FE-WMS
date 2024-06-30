import useQueryParams from '@/common/hooks/use-query-params'
import {
	ColumnDef,
	ColumnFiltersState,
	RowData,
	SortingState,
	Table,
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
import { forwardRef, memo, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Div, Typography } from '..'
import TableDataGrid from './components/table'
import TablePagination from './components/table-pagination'
import TableToolbar from './components/table-toolbar'
import { TableContext } from './context/table.context'
import { fuzzyFilter } from './utils/fuzzy-filter.util'

export type PaginationProps<TData> = {
	hidden?: boolean
	prefetch?: (params: Record<string, any>) => void
} & Partial<Omit<Pagination<TData>, 'data'>>

export type ToolbarProps = { hidden?: boolean; ltr?: boolean; slot?: React.ReactNode }

export interface DataTableProps<TData = any, TValue = any> extends Partial<TableOptions<any>> {
	data: Array<TData>
	columns: ColumnDef<TData | any, TValue>[]
	loading?: boolean
	enableColumnResizing?: boolean
	containerProps?: React.ComponentProps<'div'>
	toolbarProps?: ToolbarProps
	paginationProps?: PaginationProps<TData>
}

function DataTable<TData, TValue>(
	{
		data,
		columns,
		loading,
		containerProps,
		paginationProps = { hidden: false },
		toolbarProps = { hidden: false },
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
		...props
	}: DataTableProps<TData, TValue>,
	ref: React.ForwardedRef<Table<TData>>
) {
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
	const [sorting, setSorting] = useState<SortingState>([])
	const [globalFilter, setGlobalFilter] = useState<string>('')
	const [isScrolling, setIsScrolling] = useState(false)
	const [isFilterOpened, setIsFilterOpened] = useState(false)
	const hasNoFilter = useMemo(
		() => [columnFilters].length === 0 && globalFilter.length === 0,
		[globalFilter, columnFilters]
	)

	const { t } = useTranslation()
	const { searchParams } = useQueryParams({
		page: 1,
		limit: 10
	})

	/**
	 * Avoid infinite loop if data is empty
	 * @see {@link https://github.com/TanStack/table/issues/4566 | Github}
	 */
	const _data = useMemo(() => (Array.isArray(data) ? data : []), [data])

	const table = useReactTable({
		data: _data,
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
		globalFilterFn,
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
		onPaginationChange: () => undefined,
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

	const rowSelectionCount =
		String(table.getFilteredSelectedRowModel().rows.length) + '/' + String(table.getFilteredRowModel().rows.length)

	if (ref && typeof ref !== 'function') ref.current = table

	return (
		<TableContext.Provider
			value={{
				isScrolling,
				hasNoFilter,
				isFilterOpened,
				sorting,
				columnFilters,
				globalFilter,
				setIsScrolling,
				setIsFilterOpened,
				setColumnFilters,
				setSorting,
				setGlobalFilter
			}}>
			<Div className='flex h-full flex-col items-stretch gap-y-3'>
				{toolbarProps.hidden ? null : <TableToolbar table={table} slot={toolbarProps.slot} />}
				<TableDataGrid containerProps={containerProps} table={table} columns={columns} loading={loading} />
				<Div className='flex items-center justify-between'>
					{enableRowSelection && (
						<Typography className='text-sm font-medium sm:hidden'>
							{t('ns_common:table.selected_rows', {
								selectedRows: rowSelectionCount,
								defaultValue: rowSelectionCount
							})}
						</Typography>
					)}
					{!paginationProps?.hidden && (
						<TablePagination
							table={table}
							manualPagination={manualPagination}
							{..._.omit(paginationProps, ['hidden'])}
						/>
					)}
				</Div>
			</Div>
		</TableContext.Provider>
	)
}

export default memo(forwardRef(DataTable))
