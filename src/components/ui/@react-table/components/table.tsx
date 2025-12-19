import useScrollToFn from '@/common/hooks/use-scroll-fn'
import { cn } from '@/common/utils/cn'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useMemoizedFn, useSize, useUpdateEffect } from 'ahooks'
import React, { useId, useMemo, useRef } from 'react'
import tw from 'tailwind-styled-components'
import { Table, TableCaption } from '../..'
import { ROW_ACTIONS_COLUMN_ID } from '../constants'
import { useTableContext } from '../context/table.context'
import { type DataTableProps } from '../types'
import { MemoizedTableBody, TableBody } from './table-body'
import { TableBodyLoading } from './table-body-loading'
import TableEmpty from './table-empty'
import TableFooter from './table-footer'
import { TableHeadCaption } from './table-head-caption'
import { DataTableHeader } from './table-header'

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

	const virtualizer = useVirtualizer<HTMLDivElement, HTMLTableRowElement>({
		count: rows.length,
		overscan: virtualizerOptions.overscan,
		horizontal: false,
		getScrollElement,
		estimateSize,
		scrollToFn
	})

	const wrapperRef = useRef<HTMLDivElement>(null)
	const wrapperSize = useSize(wrapperRef)

	const computedColumnSizes = useMemo(() => {
		const headers = table.getFlatHeaders()
		const columnSizes: Record<string, string> = {}
		headers.forEach((header) => {
			columnSizes[`--header-${header.id}-size`] = header.getSize() + 'px'
			columnSizes[`--column-${header.column.id}-size`] = header.column.getSize() + 'px'
		})
		return columnSizes
	}, [table.getState().columnSizingInfo, table.getState().columnSizing])

	useUpdateEffect(() => {
		table.setColumnPinning((prev) => {
			if (prev.right.includes(ROW_ACTIONS_COLUMN_ID)) {
				prev.right = prev.right.filter((id) => id !== ROW_ACTIONS_COLUMN_ID).concat(ROW_ACTIONS_COLUMN_ID)
			}
			return prev
		})
	}, [table.getState().columnPinning])

	return (
		<Wrapper ref={wrapperRef} style={{ '--table-width': wrapperSize?.width - 10 + 'px' }}>
			{caption && <TableHeadCaption id={captionId} aria-description={caption} />}
			<ScrollArea ref={containerRef} {...containerProps}>
				<Table
					data-role='data-grid'
					className='table-auto border-separate border-spacing-0 border-none'
					style={
						{
							...computedColumnSizes,
							minWidth: table.getTotalSize(),
							height: loading ? 'auto' : virtualizer.getTotalSize(),
							'--header-row-height': '40px',
							'--row-height': `${virtualizerOptions.estimateSize}px`
						} as React.CSSProperties
					}>
					{caption && (
						<TableCaption aria-labelledby={captionId} className='hidden'>
							{caption}
						</TableCaption>
					)}
					<DataTableHeader />
					{loading ? (
						<TableBodyLoading />
					) : table.getState().columnSizingInfo.isResizingColumn ? (
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
const ScrollArea = tw.div`scroll-smooth relative flex flex-col items-stretch overflow-scroll contain-strict will-change-scroll max-w-full w-full scrollbar-track-scrollbar/20 outline-none border-none ring-0 ring-offset-0 ring-offset-transparent backface-hidden [overflow-anchor:none]`

DataTable.displayName = 'DataTable'

export default DataTable
