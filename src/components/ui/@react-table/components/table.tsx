import useScrollToFn from '@/common/hooks/use-scroll-fn'
import { cn } from '@/common/utils/cn'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useMemoizedFn, useSize } from 'ahooks'
import { useId, useMemo, useRef } from 'react'
import tw from 'tailwind-styled-components'
import { Table, TableCaption } from '../..'
import { ROW_EXPANSION_COLUMN_ID, ROW_SELECTION_COLUMN_ID } from '../constants'
import { useTableContext } from '../context/table.context'
import { type DataTableProps } from '../types'
import { MemoizedTableBody, TableBody } from './table-body'
import { TableBodyLoading } from './table-body-loading'
import TableEmpty from './table-empty'
import TableFooter from './table-footer'
import { TableHeadCaption } from './table-head-caption'
import DataTableHeader from './table-header'

type TableProps<TData, TValue> = Omit<DataTableProps<TData, TValue>, 'data' | 'slot'> &
	Omit<React.AllHTMLAttributes<HTMLTableElement>, 'data'> &
	Pick<React.ComponentProps<'div'>, 'style'>

function TableDataGrid<TData, TValue>(props: TableProps<TData, TValue>) {
	const { instanceId, table } = useTableContext()
	const { rows } = table.getRowModel()
	const containerRef = useRef<HTMLDivElement>(null)
	const tableRef = useRef<HTMLTableElement>(null)
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
	const measureElement = useMemoizedFn((element) => element?.getBoundingClientRect()?.height)

	const virtualizer = useVirtualizer({
		count: rows.length,
		indexAttribute: 'data-index',
		overscan: virtualizerOptions.overscan,
		getScrollElement,
		estimateSize,
		scrollToFn,
		measureElement:
			typeof window !== 'undefined' && navigator.userAgent.indexOf('Firefox') === -1 ? measureElement : undefined
	})

	const columnSizeVars = useMemo(() => {
		const headers = table.getFlatHeaders()
		const colSizes: { [key: string]: number } = {}
		headers.forEach((header) => {
			colSizes[`--header-${header.id}-size`] = header.getSize()
			colSizes[`--col-${header.column.id}-size`] = header.column.getSize()
		})
		return colSizes
	}, [table.getState().columnSizingInfo, table.getState().columnSizing])

	const wrapperRef = useRef<HTMLDivElement>(null)
	const wrapperSize = useSize(wrapperRef)

	const isColumnResizing =
		table.getState().columnSizingInfo.isResizingColumn &&
		!table.getState().columnPinning.left.some((columnId) => {
			return columnId !== ROW_EXPANSION_COLUMN_ID && columnId !== ROW_SELECTION_COLUMN_ID
		})

	return (
		<Wrapper ref={wrapperRef} style={{ '--table-width': wrapperSize?.width - 10 + 'px' }}>
			{caption && <TableHeadCaption id={captionId} aria-description={caption} />}
			<ScrollArea tabIndex={0} ref={containerRef} {...containerProps}>
				<Table
					id={instanceId}
					ref={tableRef}
					className='w-full table-fixed border-separate border-spacing-0 border-none'
					style={{
						...columnSizeVars,
						minWidth: table.getTotalSize(),
						height: loading ? 'auto' : virtualizer.getTotalSize()
					}}>
					{caption && (
						<TableCaption aria-labelledby={captionId} className='hidden'>
							{caption}
						</TableCaption>
					)}
					{/* {virtualizer.isScrolling ? <MemoizedDataTableHeader /> : <DataTableHeader />} */}
					<DataTableHeader />
					{loading ? (
						<TableBodyLoading table={table} prepareRows={10} />
					) : isColumnResizing ? (
						<MemoizedTableBody {...{ virtualizer, renderSubComponent }} />
					) : (
						<TableBody {...{ virtualizer, renderSubComponent }} />
					)}
				</Table>
				{!loading && table.getRowModel().rows.length === 0 && <TableEmpty />}
			</ScrollArea>
			{footerProps && <TableFooter {...{ table, ...footerProps }} />}
		</Wrapper>
	)
}

const Wrapper = tw.div`flex flex-col items-stretch border outline-none ring-0 ring-offset-0 ring-offset-transparent overflow-clip rounded-md`
const ScrollArea = tw.div`will-change-transform contain-paint relative flex flex-col items-stretch overflow-scroll max-w-full w-full scrollbar-track-scrollbar/20 outline-none border-none ring-0 ring-offset-0 ring-offset-transparent`

TableDataGrid.displayName = 'DataTable'

export default TableDataGrid
