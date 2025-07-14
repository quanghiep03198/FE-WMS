import useMeasureElement from '@/common/hooks/use-measure-element'
import useScrollToFn from '@/common/hooks/use-scroll-fn'
import { SizeQuantity } from '@/common/types/entities'
import { Table, TableCaption, Typography } from '@/components/ui'
import { fuzzyFilter } from '@/components/ui/@react-table/utils'
import {
	ColumnDef,
	ColumnFiltersState,
	ExpandedState,
	getCoreRowModel,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getFilteredRowModel,
	getSortedRowModel,
	Row,
	RowData,
	SortingState,
	useReactTable
} from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useMemoizedFn, useSize } from 'ahooks'
import React, { useId, useLayoutEffect, useRef, useState } from 'react'
import tw from 'tailwind-styled-components'
import { RFIDDataType } from '../../../_layout.(rfid)/-constants'
import { DataTableBody } from './data-table-body'
import DataTableGlobalFilter from './data-table-filter'
import { DataTableHeader, MemoizedDataTableHeader } from './data-table-header'

export type TableRowData = RowData & { inv_sizes: SizeQuantity }

type DataTableProps<T extends TableRowData> = {
	data: Array<T>
	columns: ColumnDef<T, any>[]
	caption: string
	dataType: RFIDDataType
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

	const table = useReactTable({
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

	const scrollingRef = useRef<number>(0)
	const scrollToFn = useScrollToFn(containerRef, scrollingRef)
	const estimateSize = useMemoizedFn(() => VIRTUAL_ROW_SIZE)
	const getScrollElement = useMemoizedFn(() => containerRef.current)
	const measureElement = useMeasureElement()

	const virtualizer = useVirtualizer({
		count: rows.length,
		overscan: 20,
		getScrollElement,
		estimateSize,
		scrollToFn,
		measureElement
	})

	useLayoutEffect(() => {
		virtualizer.measure()
	}, [])

	const containerSize = useSize(containerRef)

	return (
		<Container>
			<DataTableGlobalFilter
				globalFilter={table.getState().globalFilter ?? ''}
				onGlobalFilterChange={table.setGlobalFilter}
				dataType={dataType}
			/>
			<ScrollArea ref={containerRef} style={{ overflowAnchore: 'none' }}>
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
			<Typography aria-labelledby={captionId} className='block text-center text-sm text-muted-foreground'>
				{caption}
			</Typography>
		</Container>
	)
}

const Container = tw.div`space-y-4 rounded-md border p-5 shadow-sm`
const ScrollArea = tw.div`relative h-72 overflow-auto rounded-sm scrollbar-track-accent/20 contain-paint will-change-transform [overflow-anchor:none]`

export default DataTable
