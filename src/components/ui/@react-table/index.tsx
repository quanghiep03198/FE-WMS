import {
	ColumnOrderState,
	getCoreRowModel,
	getExpandedRowModel,
	getFacetedMinMaxValues,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	RowSelectionState,
	Table,
	useReactTable,
	type ColumnFiltersState,
	type ExpandedState,
	type GlobalFilterTableState,
	type PaginationState,
	type SortingState
} from '@tanstack/react-table'
import { useLatest, useResetState } from 'ahooks'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import isEqual from 'react-fast-compare'
import { useTranslation } from 'react-i18next'
import { Typography } from '..'
import TableDataGrid from './components/table'
import TablePagination from './components/table-pagination'
import TableToolbar from './components/table-toolbar'
import { TableContext } from './context/table.context'
import { type DataTableProps } from './types'
import { fuzzyFilter } from './utils/fuzzy-filter.util'
import { fuzzySort } from './utils/fuzzy-sort.util'
// needed for table body level scope DnD setup
import { pick } from 'lodash'
import tw from 'tailwind-styled-components'
import { v4 as uuidv4 } from 'uuid'
import { ROW_ACTIONS_COLUMN_ID, ROW_EXPANSION_COLUMN_ID, ROW_SELECTION_COLUMN_ID } from './constants'
import { dateRangeFilter } from './utils/in-date-range-filter.util'

function DataTable<TData, TValue>({
	instanceId = uuidv4(),
	data,
	caption,
	columns,
	loading,
	initialState = { rowSelection: {} },
	containerProps,
	expanded = {},
	paginationProps = { hidden: false },
	toolbarProps = { hidden: false, slotRight: null },
	footerProps = { hidden: true, slot: null },
	manualExpanding = false,
	manualPagination = false,
	manualSorting = false,
	manualFiltering = false,
	enableColumnResizing = true,
	enableRowSelection = false,
	enableColumnFilters = true,
	enableSorting = true,
	enableExpanding = true,
	enableColumnPinning = true,
	enableGlobalFilter = true,
	globalFilterFn = fuzzyFilter,
	sorting,
	columnFilters,
	globalFilter,
	virtualizerOptions,
	onGlobalFilterChange,
	onColumnFiltersChange,
	renderSubComponent,
	getRowCanExpand,
	onPaginationChange,
	onSortingChange,
	onExpandedChange,
	onRowSelectionChange,
	ref,
	...props
}: DataTableProps<TData, TValue>) {
	const { t } = useTranslation()
	const originalData = useMemo(() => data ?? [], [data])

	// * Table states declaration

	const [_data, setData, resetData] = useResetState(originalData)
	const [_columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
	const [_sorting, setSorting] = useState<SortingState>([])
	const [_globalFilter, setGlobalFilter] = useState<GlobalFilterTableState['globalFilter']>('')
	const [_expanded, setExpanded] = useState<ExpandedState>({})
	const [autoResetPageIndex, setAutoResetPageIndex] = useState<boolean>(false)
	const [rowSelection, setRowSelection] = useState<RowSelectionState>(initialState?.rowSelection ?? {})
	const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([])
	const [editedRows, setEditedRows, resetEditedRows] = useResetState({})
	const [pagination, setPagination] = useState<PaginationState>(() => ({
		pageIndex: 0,
		pageSize: 10
	}))

	const hasNoFilter = useMemo(() => {
		if (manualFiltering) return columnFilters?.length === 0
		return _columnFilters?.length === 0 && _globalFilter?.length === 0
	}, [_globalFilter, _columnFilters, columnFilters])

	// * Table declaration
	const table = useReactTable({
		data: _data,
		columns,
		defaultColumn: {
			minSize: 60,
			maxSize: 800
		},
		initialState: {
			columnPinning: {
				left: [ROW_EXPANSION_COLUMN_ID, ROW_SELECTION_COLUMN_ID],
				right: [ROW_ACTIONS_COLUMN_ID]
			},
			expanded,
			columnOrder,
			globalFilter: '',
			columnFilters: [],
			pagination: {
				pageIndex: 0,
				pageSize: 10
			},
			...initialState
		},
		state: {
			sorting: manualSorting ? sorting : _sorting,
			columnFilters: manualFiltering ? columnFilters : _columnFilters,
			globalFilter: manualFiltering ? globalFilter : _globalFilter,
			expanded: manualExpanding ? expanded : _expanded,
			rowSelection,
			columnOrder,
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
		manualExpanding,
		enableColumnFilters,
		enableSorting,
		enableExpanding,
		enableGlobalFilter,
		enableColumnPinning,
		enableColumnResizing,
		filterFromLeafRows: false,
		columnResizeMode: 'onChange',
		debugAll: false,
		sortingFns: { fuzzy: fuzzySort },
		filterFns: {
			fuzzy: fuzzyFilter,
			inDateRange: dateRangeFilter
		},
		globalFilterFn: globalFilterFn,
		onPaginationChange: manualPagination ? onPaginationChange : setPagination,
		onSortingChange: manualSorting ? onSortingChange : setSorting,
		onColumnFiltersChange: manualFiltering ? onColumnFiltersChange : setColumnFilters,
		onGlobalFilterChange: manualFiltering ? onGlobalFilterChange : setGlobalFilter,
		onExpandedChange: manualExpanding ? onExpandedChange : setExpanded,
		onColumnOrderChange: setColumnOrder,
		onRowSelectionChange: (updateFn) => {
			setRowSelection(updateFn)
			if (typeof onRowSelectionChange === 'function') onRowSelectionChange(updateFn)
		},
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
		autoResetExpanded: false,
		meta: {
			editedRows,
			setEditedRows,
			updateRow: (rowIndex, columnId, value) => {
				// Skip page index reset until after next rerender
				setAutoResetPageIndex(false)
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
			discardChanges: (rowIndex) => {
				if (!rowIndex) {
					resetEditedRows()
					resetData()
					return
				}
				setData((old) => old.map((row, index) => (index === rowIndex ? originalData[rowIndex] : row)))
			},
			getUnsavedChanges: (): TData[] => {
				return table
					.getRowModel()
					.flatRows.filter((row) => Object.keys(editedRows).some((id) => id === row.id))
					.map((row) => row.original)
			}
		},
		...props
		// getSubRows: (row) => row.subRows,
	})

	// * Forwarding refs
	const tableWrapperRef = useRef<HTMLDivElement>(null)
	const tableRef = useLatest<Table<TData>>(table)

	/**
	 * * Avoid infinite loop if data is empty
	 * @see {@link https://github.com/TanStack/table/issues/4566 | Github issue}
	 */
	useEffect(() => {
		if (!isEqual(data, _data) && Array.isArray(data)) {
			setData(data)
		}
	}, [data])

	/**
	 * * Forwarding ref from parent component
	 */
	useEffect(() => {
		if (ref) ref.current = tableRef.current
	}, [tableRef.current])

	const resetAllFilters = useCallback(() => {
		table.resetGlobalFilter(table.initialState.globalFilter)
		table.resetColumnFilters(true)
	}, [])

	// * Get row selection count
	const selectedRows = table.getFilteredSelectedRowModel().rows?.length ?? 0
	const totalRows = manualPagination ? paginationProps.totalDocs : (table.getFilteredRowModel().rows?.length ?? 0)
	const rowSelectionCount = String(selectedRows) + '/' + String(totalRows)

	return (
		<TableContext.Provider
			value={{
				instanceId,
				hasNoFilter
			}}>
			<DataTableWrapper ref={tableWrapperRef}>
				{!toolbarProps.hidden && (
					<TableToolbar
						table={table}
						enableGlobalFilter={enableGlobalFilter}
						onResetAllFilters={resetAllFilters}
						slotLeft={toolbarProps.slotLeft}
						slotRight={toolbarProps.slotRight}
					/>
				)}
				<TableDataGrid
					table={table}
					columns={columns}
					loading={loading}
					caption={caption}
					virtualizerOptions={virtualizerOptions}
					containerProps={containerProps}
					footerProps={footerProps}
					renderSubComponent={renderSubComponent}
					getRowCanExpand={getRowCanExpand}
				/>
				<FooterGroup>
					{enableRowSelection ? (
						<Typography className='text-sm font-medium sm:hidden'>
							{t('ns_common:table.selected_rows', {
								selectedRows: rowSelectionCount,
								defaultValue: rowSelectionCount
							})}
						</Typography>
					) : (
						<Typography className='text-sm font-medium sm:hidden'>
							{t('ns_common:table.total_rows', {
								count: totalRows,
								defaultValue: `${totalRows} rows`
							})}
						</Typography>
					)}
					{!paginationProps?.hidden && (
						<TablePagination
							table={table}
							loading={loading}
							manualPagination={manualPagination}
							canNextPage={manualPagination ? paginationProps?.hasNextPage : table.getCanNextPage()}
							canPreviousPage={manualPagination ? paginationProps?.hasPrevPage : table.getCanPreviousPage()}
							pageCount={manualPagination ? paginationProps?.totalPages : table.getPageCount()}
							pageSize={manualPagination ? paginationProps?.limit : table.getState().pagination.pageSize}
							pageIndex={manualPagination ? paginationProps?.page : table.getState().pagination.pageIndex + 1}
							rowCount={manualPagination ? paginationProps.totalDocs : table.getRowCount()}
							onPaginationChange={onPaginationChange}
							onFirstPage={table.firstPage}
							onLastPage={table.lastPage}
							onNextPage={table.nextPage}
							onPreviousPage={table.previousPage}
							onPageSizeChange={table.setPageSize}
							{...pick(paginationProps, ['hidden'])}
						/>
					)}
				</FooterGroup>
			</DataTableWrapper>
		</TableContext.Provider>
	)
}

const DataTableWrapper = tw.div`space-y-2 max-w-full w-full overflow-x-hidden transition-width duration-200`
const FooterGroup = tw.div`flex items-center justify-between`

export default DataTable
