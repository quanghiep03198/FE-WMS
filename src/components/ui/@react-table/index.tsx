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
	useReactTable,
	type ColumnFiltersState,
	type ExpandedState,
	type GlobalFilterTableState,
	type PaginationState,
	type SortingState
} from '@tanstack/react-table'
import { useDeepCompareEffect, useEventEmitter, useResetState } from 'ahooks'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import isEqual from 'react-fast-compare'
import tw from 'tailwind-styled-components'
import { create, StoreApi } from 'zustand'
import { MemoizedTableRowCount, TableRowCount } from './components/row-count'
import DataTable from './components/table'
import { MemoizedTablePagination, TablePagination } from './components/table-pagination'
import { MemoizedTableToolbar, TableToolbar } from './components/table-toolbar'
import { ROW_ACTIONS_COLUMN_ID, ROW_EXPANSION_COLUMN_ID, ROW_SELECTION_COLUMN_ID } from './constants'
import { TableContext, TableContextStore } from './context/table.context'
import { type DataTableProps } from './types'
import { fuzzyFilter } from './utils/fuzzy-filter.util'
import { fuzzySort } from './utils/fuzzy-sort.util'
import { dateRangeFilter } from './utils/in-date-range-filter.util'

function DataGrid<TData, TValue>({
	data,
	caption,
	columns,
	loading,
	initialState = { rowSelection: {} },
	containerProps,
	defaultFilterOpen = false,
	expanded = {},
	paginationProps,
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

	const event$ = useEventEmitter<Record<string, unknown>>()

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
				// ? Skip page index reset until after next rerender
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
	useEffect(() => {
		if (ref && typeof ref === 'object' && 'current' in ref) {
			ref.current = table
		}
	}, [table, ref])

	/**
	 * * Avoid infinite loop if data is empty
	 * @see {@link https://github.com/TanStack/table/issues/4566 | Github issue}
	 */
	useDeepCompareEffect(() => {
		if (!isEqual(data, _data) && Array.isArray(data)) setData(data)
	}, [data])

	const resetAllFilters = useCallback(() => {
		table.resetGlobalFilter(table.initialState.globalFilter)
		table.resetColumnFilters(true)
	}, [])

	useEffect(() => {
		const isAllFiltersCleared = manualFiltering
			? columnFilters?.length === 0
			: _columnFilters?.length === 0 && _globalFilter?.length === 0

		event$.emit({ isAllFiltersCleared })
	}, [_globalFilter, _columnFilters, columnFilters])

	const store = useRef<StoreApi<TableContextStore>>(null)
	if (!store.current)
		store.current = create<TableContextStore>((set) => ({
			table,
			event$,
			filterOpen: !!defaultFilterOpen,
			setFilterOpen(value) {
				set((state) => {
					return { ...state, filterOpen: value }
				})
			}
		}))

	const { isResizingColumn } = table.getState().columnSizingInfo

	return (
		<TableContext.Provider value={store.current}>
			<DataTableWrapper>
				{!toolbarProps.hidden &&
					(isResizingColumn ? (
						<MemoizedTableToolbar
							enableGlobalFilter={enableGlobalFilter}
							onResetAllFilters={resetAllFilters}
							slotLeft={toolbarProps.slotLeft}
							slotRight={toolbarProps.slotRight}
						/>
					) : (
						<TableToolbar
							enableGlobalFilter={enableGlobalFilter}
							onResetAllFilters={resetAllFilters}
							slotLeft={toolbarProps.slotLeft}
							slotRight={toolbarProps.slotRight}
						/>
					))}
				<DataTable
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
					{isResizingColumn ? (
						<MemoizedTableRowCount
							enableRowSelection={enableRowSelection}
							manualPagination={manualPagination}
							manualTotalDocs={paginationProps?.totalDocs ?? 0}
						/>
					) : (
						<TableRowCount
							enableRowSelection={enableRowSelection}
							manualPagination={manualPagination}
							manualTotalDocs={paginationProps?.totalDocs ?? 0}
						/>
					)}
					{isResizingColumn ? (
						<MemoizedTablePagination
							loading={loading}
							manualPagination={manualPagination}
							controlledPaginationProps={paginationProps}
							onPaginationChange={onPaginationChange}
						/>
					) : (
						<TablePagination
							loading={loading}
							manualPagination={manualPagination}
							controlledPaginationProps={paginationProps}
							onPaginationChange={onPaginationChange}
						/>
					)}
				</FooterGroup>
			</DataTableWrapper>
		</TableContext.Provider>
	)
}

const DataTableWrapper = tw.div`space-y-2 max-w-full w-full overflow-x-hidden transition-width duration-200`
const FooterGroup = memo(tw.div`flex items-center justify-between`, (prevProps, nextProps) => prevProps === nextProps)

export default DataGrid
