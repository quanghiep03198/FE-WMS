import useQueryParams from '@/common/hooks/use-query-params';
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
} from '@tanstack/react-table';
import { memo, useCallback, useEffect, useState } from 'react';
import { Box } from '../..';
import { TableProvider } from '../context/table.context';
import { fuzzyFilter } from '../utils/fuzzy-filter.util';
import TableDataGrid from './table';
import TablePagination from './table-pagination';
import TableToolbar from './table-toolbar';

export interface DataTableProps<TData, TValue> {
	data: Array<TData>;
	columns: ColumnDef<TData | any, TValue>[];
	loading?: boolean;
	manualPagination?: boolean;
	manualFilter?: boolean;
	enableColumnResizing?: boolean;
	paginationState?: Omit<Pagination<TData>, 'docs'>;
	slot?: React.ReactNode;
	selectedRows?: Array<any>;
	onRowsSelectionChange?: (...args) => void;
}

function DataTable<TData, TValue>({
	data,
	columns,
	loading,
	manualPagination,
	slot,
	paginationState,
	enableColumnResizing,
	selectedRows,
	onRowsSelectionChange
}: DataTableProps<TData, TValue>) {
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState<string>('');
	const [params] = useQueryParams('page', 'limit');

	const table = useReactTable({
		data: data || [],
		columns,
		initialState: {
			pagination: {
				pageIndex: params.page ? Number(params.page) - 1 : 0,
				pageSize: params.limit ? Number(params.limit) : 10
			}
		},
		state: {
			sorting,
			columnFilters,
			globalFilter
		},
		manualPagination,
		globalFilterFn: fuzzyFilter,
		columnResizeMode: 'onChange',
		enableColumnResizing,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onGlobalFilterChange: setGlobalFilter,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
		debugTable: import.meta.env.VITE_NODE_ENV === 'development'
	} as TableOptions<TData>);

	const clearAllFilter = useCallback(() => {
		setGlobalFilter('');
		setColumnFilters([]);
	}, []);

	useEffect(() => {
		if (onRowsSelectionChange && typeof onRowsSelectionChange === 'function') onRowsSelectionChange(table.getSelectedRowModel().flatRows);
	}, [table.getSelectedRowModel().flatRows]);

	useEffect(() => {
		if (Array.isArray(selectedRows) && selectedRows.length === 0) table.resetRowSelection();
	}, [selectedRows]);

	return (
		<TableProvider areAllFiltersCleared={columnFilters.length === 0 && globalFilter.length === 0}>
			<Box className='flex h-full flex-col items-stretch gap-y-4'>
				<TableToolbar
					table={table}
					isFiltered={globalFilter.length !== 0 || columnFilters.length !== 0}
					globalFilter={globalFilter}
					onGlobalFilterChange={setGlobalFilter}
					onClearAllFilters={clearAllFilter}
					slot={slot}
				/>
				<TableDataGrid table={table} columns={columns} loading={loading} />
				<TablePagination table={table} manualPagination={Boolean(manualPagination)} {...paginationState} />
			</Box>
		</TableProvider>
	);
}

export default memo(DataTable);
