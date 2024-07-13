/* eslint-disable react-hooks/rules-of-hooks */
import {
	type ColumnFiltersState,
	type ExpandedState,
	type GlobalFilterTableState,
	type PaginationState,
	type SortingState,
	Table,
	getCoreRowModel,
	getExpandedRowModel,
	getFacetedMinMaxValues,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable
} from '@tanstack/react-table'
import { useDeepCompareEffect } from 'ahooks'
import { omit } from 'lodash'
import { forwardRef, memo, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Div, Typography } from '..'
import TableDataGrid from './components/table'
import TablePagination from './components/table-pagination'
import TableToolbar from './components/table-toolbar'
import { TableContext } from './context/table.context'
import { useSkipper } from './hooks/use-skipper'
import { type DataTableProps } from './types'
import { fuzzyFilter } from './utils/fuzzy-filter.util'
import { fuzzySort } from './utils/fuzzy-sort.util'

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
		sorting,
		columnFilters,
		globalFilter,
		onGlobalFilterChange,
		onColumnFiltersChange,
		renderSubComponent,
		getRowCanExpand,
		onPaginationChange,
		onGetInstance,
		onSortingChange,
		...props
	}: DataTableProps<TData, TValue>,
	ref: React.MutableRefObject<Table<any>>
) {
	const [_data, setData] = useState(() => data ?? [])
	const [_columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
	const [_sorting, setSorting] = useState<SortingState>([])
	const [_globalFilter, setGlobalFilter] = useState<GlobalFilterTableState['globalFilter']>('')
	const [isScrolling, setIsScrolling] = useState(false)
	const [isFilterOpened, setIsFilterOpened] = useState(false)
	const [expanded, setExpanded] = useState<ExpandedState>({})
	const [originalData, setOriginalData] = useState(() => data ?? [])
	const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper()
	const [editedRows, setEditedRows] = useState({})
	const [pagination, setPagination] = useState<PaginationState>(() => ({
		pageIndex: 0,
		pageSize: 10
	}))

	const hasNoFilter = useMemo(() => {
		if (manualFiltering) return columnFilters?.length === 0
		return _columnFilters.length === 0 && _globalFilter.length === 0
	}, [_globalFilter, _columnFilters, columnFilters])

	const { t } = useTranslation()

	/**
	 * Avoid infinite loop if data is empty
	 * @see {@link https://github.com/TanStack/table/issues/4566 | Github issue}
	 */
	useDeepCompareEffect(() => {
		setOriginalData(data)
		setData(data)
	}, [data])

	const table = useReactTable({
		data: _data,
		columns,
		defaultColumn: {
			minSize: 60,
			maxSize: 800
		},
		initialState: {
			globalFilter: '',
			columnFilters: [],
			pagination: {
				pageIndex: 0,
				pageSize: 10
			}
		},
		state: {
			sorting: manualSorting ? sorting : _sorting,
			columnFilters: manualFiltering ? columnFilters : _columnFilters,
			globalFilter: manualFiltering ? globalFilter : _globalFilter,
			expanded,
			pagination: manualPagination
				? {
						pageIndex: paginationProps.page - 1,
						pageSize: paginationProps.limit
					}
				: pagination
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
		sortingFns: {
			fuzzy: fuzzySort
		},
		filterFns: {
			fuzzy: fuzzyFilter
		},
		globalFilterFn: 'fuzzy',
		onPaginationChange: manualPagination ? onPaginationChange : setPagination,
		onSortingChange: manualSorting ? onSortingChange : setSorting,
		onColumnFiltersChange: manualFiltering ? onColumnFiltersChange : setColumnFilters,
		onGlobalFilterChange: manualFiltering ? onGlobalFilterChange : setGlobalFilter,
		onExpandedChange: setExpanded,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getExpandedRowModel: getExpandedRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
		getFacetedMinMaxValues: getFacetedMinMaxValues(),
		getRowCanExpand,
		autoResetPageIndex,
		meta: {
			editedRows,
			setEditedRows,
			updateData: (rowIndex, columnId, value) => {
				// Skip page index reset until after next rerender
				console.log(value)
				skipAutoResetPageIndex()
				setData((old) =>
					old.map((row, index) => {
						if (index === rowIndex) {
							return {
								...old[rowIndex],
								[columnId]: value
							}
						}
						return row
					})
				)
			},
			revertUpdatedData: (rowIndex: number, condition: boolean) => {
				if (condition) {
					setData((old) => old.map((row, index) => (index === rowIndex ? originalData[rowIndex] : row)))
				} else {
					setOriginalData((old) => old.map((row, index) => (index === rowIndex ? data[rowIndex] : row)))
				}
			}
		},
		...props
		// getSubRows: (row) => row.subRows,
	})

	const rowSelectionCount =
		String(table.getFilteredSelectedRowModel().rows.length) + '/' + String(table.getFilteredRowModel().rows.length)

	useDeepCompareEffect(() => {
		if (ref) ref.current = table
	}, [ref, table.getState()])

	return (
		<TableContext.Provider
			value={{
				isScrolling,
				hasNoFilter,
				isFilterOpened,
				sorting,
				columnFilters: _columnFilters,
				globalFilter: _globalFilter,
				enableGlobalFilter,
				manualSorting,
				setIsScrolling,
				setIsFilterOpened,
				setColumnFilters,
				setSorting,
				setGlobalFilter
			}}>
			<Div className='space-y-3'>
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
							loading={loading}
							onPaginationChange={onPaginationChange}
							manualPagination={manualPagination}
							{...omit(paginationProps, ['hidden'])}
						/>
					)}
				</Div>
			</Div>
		</TableContext.Provider>
	)
}

export default memo(forwardRef(DataTable))
