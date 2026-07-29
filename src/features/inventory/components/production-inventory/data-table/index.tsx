import type { SizeQuantity } from '@common/types/entities'
import { Table, TableCaption, Typography } from '@components/ui'
import { fuzzyFilter } from '@components/ui/@react-table/utils'
import type { StockFlow } from '@features/finished-goods/constants/enums'
import useScrollToFn from '@hooks/use-scroll-fn'
import type { ColumnDef, ColumnFiltersState, ExpandedState, Row, SortingState } from '@tanstack/react-table'
import {
	getCoreRowModel,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getFilteredRowModel,
	getSortedRowModel,
	type RowData,
	useReactTable
} from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useMemoizedFn, useSize } from 'ahooks'
import React, { useId, useRef, useState } from 'react'
import tw from 'tailwind-styled-components'
import { DataTableBody } from './data-table-body'
import DataTableGlobalFilter from './data-table-filter'
import { DataTableHeader, MemoizedDataTableHeader } from './data-table-header'

export type TableRowData = RowData & { inv_sizes: SizeQuantity }

type DataTableProps<T extends TableRowData> = {
	data: Array<T>
	columns: ColumnDef<T, any>[]
	caption: string
	dataType: StockFlow
	footer: React.FC<{ rows: Row<T>[] }>
}

const VIRTUAL_ROW_SIZE = 40

function DataTable<T extends TableRowData>({
	data,
	dataType,
	columns,
	caption,
	footer: DataTableFooter
}: DataTableProps<T>) {
	'use no memo'

	const [expanded, setExpanded] = useState<ExpandedState>({})
	const [sorting, setSorting] = useState<SortingState>([])
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
	const containerRef = useRef<HTMLDivElement>(null)
	const captionId = useId()

	const table = useReactTable<T>({
		data,
		columns,
		filterFns: {
			fuzzy: fuzzyFilter,
			inDateRange: null
		},
		initialState: {
			sorting: [],
			columnFilters: [],
			expanded: {}
		},
		state: {
			sorting,
			columnFilters,
			expanded
		},
		enableColumnFilters: true,
		enableSorting: true,
		enableExpanding: true,
		enableMultiSort: true,
		onColumnFiltersChange: setColumnFilters,
		onSortingChange: setSorting,
		onExpandedChange: setExpanded,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues()
	})

	const { rows } = table.getRowModel()
	const isSomeRowsExpanded = table.getIsSomeRowsExpanded()

	const scrollToFn = useScrollToFn(containerRef)
	const estimateSize = useMemoizedFn(() => VIRTUAL_ROW_SIZE)
	const getScrollElement = useMemoizedFn(() => containerRef.current)

	const virtualizer = useVirtualizer({
		count: rows?.length,
		overscan: table.getIsSomeRowsExpanded() ? table.getExpandedRowModel()?.rows?.length : 5,
		useAnimationFrameWithResizeObserver: true,
		getScrollElement,
		estimateSize,
		scrollToFn
	})

	const containerSize = useSize(containerRef)

	return (
		<Container>
			<DataTableGlobalFilter
				globalFilter={table.getState().globalFilter ?? ''}
				onGlobalFilterChange={table.setGlobalFilter}
				dataType={dataType}
			/>
			<ScrollArea ref={containerRef} className='h-72'>
				<Table
					className='w-full table-fixed border-separate border-spacing-0'
					style={{ '--table-width': containerSize?.width - 10 + 'px' } as React.CSSProperties}>
					<TableCaption id={captionId} className='sr-only'>
						{caption}
					</TableCaption>
					{virtualizer.isScrolling ? (
						<MemoizedDataTableHeader headerGroups={table.getHeaderGroups()} />
					) : (
						<DataTableHeader headerGroups={table.getHeaderGroups()} />
					)}
					<DataTableBody
						rows={rows}
						columnCount={columns.length}
						virtualizer={virtualizer}
						isSomeRowsExpanded={isSomeRowsExpanded}
					/>
					<DataTableFooter rows={rows} />
				</Table>
			</ScrollArea>
			<Typography aria-labelledby={captionId} className='text-muted-foreground block text-center text-sm'>
				{caption}
			</Typography>
		</Container>
	)
}

const Container = tw.div`space-y-4 rounded-md border p-5 shadow-sm`
const ScrollArea = tw.div`@container-size relative h-72 overflow-auto rounded-sm scrollbar-track-accent/20 contain-paint will-change-transform`

export default DataTable
