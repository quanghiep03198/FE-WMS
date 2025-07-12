import useScrollToFn from '@/common/hooks/use-scroll-fn'
import { SizeQuantity } from '@/common/types/entities'
import { Div, Table, TableCaption, Typography } from '@/components/ui'
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
import React, { useId, useMemo, useRef, useState } from 'react'
import { RFIDDataType } from '../../../_layout.(rfid)/-constants'
import { DataTableBody, MemoizedDataTableBody } from './data-table-body'
import DataTableGlobalFilter from './data-table-filter'
import { DataTableHeader, MemoizedDataTableHeader } from './data-table-header'

type DataTableProps<T> = {
	data: Array<T>
	columns: ColumnDef<T, any>[]
	caption: string
	dataType: RFIDDataType
	footer: React.FC<{ rows: Row<T>[] }>
}

export type TableRowData = RowData & { inv_sizes: SizeQuantity }

const VIRTUAL_ROW_SIZE = 40

export default function DataTable<T extends TableRowData>({
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
	const wrapperRef = useRef<HTMLDivElement>(null)
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

	const scrollingRef = useRef<number>(0)
	const scrollToFn = useScrollToFn(containerRef, scrollingRef)
	const estimateSize = useMemoizedFn(() => VIRTUAL_ROW_SIZE)
	const getScrollElement = useMemoizedFn(() => containerRef.current)
	const measureElement = useMemo(
		() =>
			typeof window !== 'undefined' && navigator.userAgent.indexOf('Firefox') === -1
				? (element: HTMLElement | null) => element?.getBoundingClientRect()?.height
				: undefined,
		[]
	)

	const virtualizer = useVirtualizer({
		count: rows.length,
		overscan: 5,
		getScrollElement,
		estimateSize,
		scrollToFn,
		measureElement
	})

	const wrapperSize = useSize(wrapperRef)

	return (
		<Div className='space-y-4 rounded-md border p-5 shadow-sm'>
			<DataTableGlobalFilter table={table} dataType={dataType} />
			<Div ref={wrapperRef} className='w-full'>
				<Div
					ref={containerRef}
					className='relative h-72 overflow-auto rounded-sm scrollbar-track-accent/20 scrollbar-corner-transparent'>
					<Table
						className='w-full table-fixed border-separate border-spacing-0'
						style={{ '--table-width': wrapperSize?.width - 10 + 'px' } as React.CSSProperties}>
						<TableCaption id={captionId} className='sr-only'>
							{caption}
						</TableCaption>
						{virtualizer.isScrolling ? (
							<MemoizedDataTableHeader headerGroups={table.getHeaderGroups()} />
						) : (
							<DataTableHeader headerGroups={table.getHeaderGroups()} />
						)}
						{virtualizer.isScrolling && !table.getIsSomeRowsExpanded() ? (
							<MemoizedDataTableBody
								rows={table.getRowModel().rows}
								columnCount={columns.length}
								virtualizer={virtualizer}
								isSomeRowsExpanded={table.getIsSomeRowsExpanded()}
							/>
						) : (
							<DataTableBody
								rows={table.getRowModel().rows}
								columnCount={columns.length}
								virtualizer={virtualizer}
								isSomeRowsExpanded={table.getIsSomeRowsExpanded()}
							/>
						)}
						<DataTableFooter rows={table.getFilteredRowModel().rows} />
					</Table>
				</Div>
			</Div>

			<Typography aria-labelledby={captionId} className='block text-center text-sm text-muted-foreground'>
				{caption}
			</Typography>
		</Div>
	)
}
