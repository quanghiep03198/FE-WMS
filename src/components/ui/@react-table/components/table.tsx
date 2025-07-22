import useScrollToFn from '@/common/hooks/use-scroll-fn'
import { cn } from '@/common/utils/cn'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useMemoizedFn, useSize } from 'ahooks'
import React, { useId, useMemo, useRef } from 'react'
import tw from 'tailwind-styled-components'
import { Table, TableCaption } from '../..'
import { ROW_ACTIONS_COLUMN_ID, ROW_EXPANSION_COLUMN_ID, ROW_SELECTION_COLUMN_ID } from '../constants'
import { useTableContext } from '../context/table.context'
import { type DataTableProps } from '../types'
import { MemoizedTableBody, TableBody } from './table-body'
import { TableBodyLoading } from './table-body-loading'
import TableEmpty from './table-empty'
import TableFooter from './table-footer'
import { TableHeadCaption } from './table-head-caption'
import { DataTableHeader, MemoizedDataTableHeader } from './table-header'

type TableProps<TData, TValue> = Omit<DataTableProps<TData, TValue>, 'data' | 'slot'> &
	Omit<React.AllHTMLAttributes<HTMLTableElement>, 'data'> &
	Pick<React.ComponentProps<'div'>, 'style'>

function DataTable<TData, TValue>(props: TableProps<TData, TValue>) {
	const { table } = useTableContext('table')
	const { rows } = table.getRowModel()
	const containerRef = useRef<HTMLDivElement>(null)
	const scrollingRef = useRef<number>(0)
	const captionId = useId()

	const {
		containerProps = { className: cn('h-[52.5dvh] xxl:h-[62.5dvh]') },
		footerProps = { hidden: true, slot: null },
		caption,
		loading,
		virtualizerOptions = {
			estimateSize: 40,
			overscan: table.getIsSomeRowsExpanded() ? table.getExpandedRowModel().flatRows.length : 5
		},
		renderSubComponent
	} = props

	const scrollToFn = useScrollToFn(containerRef, scrollingRef)
	const estimateSize = useMemoizedFn(() => virtualizerOptions.estimateSize)
	const getScrollElement = useMemoizedFn(() => containerRef.current)

	const virtualizer = useVirtualizer({
		count: rows.length,
		overscan: virtualizerOptions.overscan,
		horizontal: false,
		getScrollElement,
		estimateSize,
		scrollToFn
	})

	const wrapperRef = useRef<HTMLDivElement>(null)
	const wrapperSize = useSize(wrapperRef)

	const { columnSizingInfo, columnSizing, columnPinning } = table.getState()
	const isColumnResizing = columnSizingInfo.isResizingColumn

	/**
	 * * Column pinning cause wrong positioning of columns when resizing
	 * * This is a workaround to fix the issue by calculating the column sizes based on the current state and applying them to the table element.
	 */
	const hasPinnedLeftColumns = columnPinning.left.some((columnId) => {
		return columnId !== ROW_EXPANSION_COLUMN_ID && columnId !== ROW_SELECTION_COLUMN_ID
	})
	const hasPinnedRightColumns = columnPinning.right.some((columnId) => {
		return columnId !== ROW_ACTIONS_COLUMN_ID
	})
	const isSomeColumnsPinned = table.getIsSomeColumnsPinned() && (hasPinnedLeftColumns || hasPinnedRightColumns)

	const shouldSkipRerender = virtualizer.isScrolling || (isColumnResizing && !isSomeColumnsPinned)

	const computedColumnSizes = useMemo(() => {
		const headers = table.getFlatHeaders()
		const columnSizes: Record<string, number> = {}
		headers.forEach((header) => {
			columnSizes[`--header-${header.id}-size`] = header.getSize()
			columnSizes[`--column-${header.column.id}-size`] = header.column.getSize()
		})
		return columnSizes
	}, [columnSizingInfo, columnSizing])

	console.log('shouldSkipRerender :>> ', shouldSkipRerender)

	return (
		<Wrapper ref={wrapperRef} style={{ '--table-width': wrapperSize?.width - 10 + 'px' }}>
			{caption && <TableHeadCaption id={captionId} aria-description={caption} />}
			<ScrollArea ref={containerRef} {...containerProps}>
				<Table
					className='border-separate border-spacing-0 border-none'
					style={
						{
							...computedColumnSizes,
							minWidth: table.getTotalSize(),
							height: loading ? 'auto' : virtualizer.getTotalSize(),
							'--row-height': `${virtualizerOptions.estimateSize}px`
						} as React.CSSProperties
					}>
					{caption && (
						<TableCaption aria-labelledby={captionId} className='hidden'>
							{caption}
						</TableCaption>
					)}
					{virtualizer.isScrolling || (isColumnResizing && !isSomeColumnsPinned) ? (
						<MemoizedDataTableHeader />
					) : (
						<DataTableHeader />
					)}
					{loading ? (
						<TableBodyLoading />
					) : isColumnResizing && !isSomeColumnsPinned ? (
						<MemoizedTableBody {...{ virtualizer, renderSubComponent }} />
					) : (
						<TableBody {...{ virtualizer, renderSubComponent }} />
					)}
				</Table>
				{!loading && table.getRowModel().rows.length === 0 && <TableEmpty />}
			</ScrollArea>
			{footerProps && <TableFooter {...footerProps} />}
		</Wrapper>
	)
}

const Wrapper = tw.div`flex flex-col items-stretch border outline-none ring-0 ring-offset-0 ring-offset-transparent overflow-clip rounded-md`
const ScrollArea = tw.div` relative flex flex-col items-stretch overflow-scroll max-w-full w-full scrollbar-track-scrollbar/20 outline-none border-none ring-0 ring-offset-0 ring-offset-transparent`

DataTable.displayName = 'DataTable'

export default DataTable
