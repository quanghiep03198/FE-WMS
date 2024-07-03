import {
	type ColumnDef,
	type ColumnFiltersState,
	type ExpandedState,
	type GlobalFilterTableState,
	type PaginationState,
	type Row,
	type SortingState,
	type Table,
	type TableOptions,
	getCoreRowModel,
	getExpandedRowModel,
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
	caption?: string
	loading?: boolean
	enableColumnResizing?: boolean
	containerProps?: React.ComponentProps<'div'>
	toolbarProps?: ToolbarProps
	paginationProps?: PaginationProps<TData>
	renderSubComponent?: (props: { row: Row<TData> }) => React.ReactElement
}

function DataTable<TData, TValue>(
	{
		data,
		caption,
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
		renderSubComponent,
		getRowCanExpand,
		onPaginationChange,
		...props
	}: DataTableProps<TData, TValue>,
	ref: React.ForwardedRef<Table<TData>>
) {
	const [pagination, setPagination] = useState<PaginationState>(() => ({
		pageIndex: 0,
		pageSize: 10
	}))
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
	const [sorting, setSorting] = useState<SortingState>([])
	const [globalFilter, setGlobalFilter] = useState<GlobalFilterTableState['globalFilter']>('')
	const [isScrolling, setIsScrolling] = useState(false)
	const [isFilterOpened, setIsFilterOpened] = useState(false)
	const [expanded, setExpanded] = useState<ExpandedState>({})
	const hasNoFilter = useMemo(
		() => [columnFilters].length === 0 && globalFilter.length === 0,
		[globalFilter, columnFilters]
	)

	const { t } = useTranslation()

	/**
	 * Avoid infinite loop if data is empty
	 * @see {@link https://github.com/TanStack/table/issues/4566 | Github issue}
	 */
	const _data = useMemo(() => (Array.isArray(data) ? data : []), [data])

	console.log(paginationProps.page)

	const table = useReactTable({
		data: _data,
		columns,
		initialState: {
			globalFilter: '',
			columnFilters: [],
			pagination: {
				pageIndex: 0,
				pageSize: 10
			}
		},
		state: {
			sorting,
			columnFilters,
			globalFilter,
			expanded,
			pagination: manualPagination
				? {
						pageIndex: paginationProps.page - 1,
						pageSize: paginationProps.limit
					}
				: pagination
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
		onPaginationChange: manualPagination ? onPaginationChange : setPagination,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onGlobalFilterChange: setGlobalFilter,
		onExpandedChange: setExpanded,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getExpandedRowModel: getExpandedRowModel(),
		getRowCanExpand,
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
		...props
		// getSubRows: (row) => row.subRows,
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
				<TableDataGrid
					table={table}
					columns={columns}
					loading={loading}
					caption={caption}
					containerProps={containerProps}
					renderSubComponent={renderSubComponent}
					getRowCanExpand={getRowCanExpand}
				/>
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
							onPaginationChange={onPaginationChange}
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
