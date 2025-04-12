import useScrollToFn from '@/common/hooks/use-scroll-fn'
import { cn } from '@/common/utils/cn'
import { type Table as TTable } from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useSize } from 'ahooks'
import { Fragment, useCallback, useId, useMemo, useRef } from 'react'
import tw from 'tailwind-styled-components'
import { Table, TableCaption, TableHead, TableHeader, TableRow } from '../..'
import { DEFAULT_ESTIMATE_SIZE, ROW_EXPANSION_COLUMN_ID, ROW_SELECTION_COLUMN_ID } from '../constants'
import { type DataTableProps } from '../types'
import { DataTableUtility } from '../utils/table.util'
import CollapsibleFilterCell from './collapsible-filter-cell'
import ColumnResizer from './column-resizer'
import { MemorizedTableBody, TableBody } from './table-body'
import { TableBodyLoading } from './table-body-loading'
import { TableCellHead } from './table-cell-head'
import TableEmpty from './table-empty'
import TableFooter from './table-footer'
import { TableHeadCaption } from './table-head-caption'

interface TableProps<TData, TValue>
	extends Omit<DataTableProps<TData, TValue>, 'data' | 'slot'>,
		Omit<React.AllHTMLAttributes<HTMLTableElement>, 'data'>,
		Pick<React.ComponentProps<'div'>, 'style'> {
	table: TTable<TData>
}

function TableDataGrid<TData, TValue>({
	containerProps = { className: cn('h-[52.5dvh] xxl:h-[62.5dvh]') },
	table,
	footerProps = { hidden: true, slot: null },
	caption,
	loading,
	virtualizerOptions = {
		estimateSize: 40,
		overscan: table.getIsSomeRowsExpanded() ? table.getExpandedRowModel().flatRows.length : 10
	},
	renderSubComponent
}: TableProps<TData, TValue>) {
	const { rows } = table.getRowModel()
	const containerRef = useRef<HTMLDivElement>(null)
	const tableRef = useRef<HTMLTableElement>(null)
	const scrollingRef = useRef<number>(0)
	const captionId = useId()

	const scrollToFn = useScrollToFn(containerRef, scrollingRef)

	const virtualizer = useVirtualizer({
		count: rows.length,
		indexAttribute: 'data-index',
		overscan: virtualizerOptions.overscan,
		getScrollElement: () => containerRef.current,
		estimateSize: useCallback(() => virtualizerOptions.estimateSize, []),
		measureElement:
			typeof window !== 'undefined' && navigator.userAgent.indexOf('Firefox') === -1
				? (element) => element?.getBoundingClientRect().height
				: undefined,
		scrollToFn
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

	return (
		<Wrapper
			ref={wrapperRef}
			style={{
				'--table-width': wrapperSize?.width - 12 + 'px'
			}}>
			{caption && <TableHeadCaption id={captionId} aria-description={caption} />}
			<ScrollArea tabIndex={0} ref={containerRef} {...containerProps}>
				<Table
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
					<TableHeader className='sticky top-0 z-20 bg-background'>
						{table.getHeaderGroups().map((headerGroup) => {
							return (
								<Fragment key={headerGroup.id}>
									<TableRow>
										{headerGroup.headers.map((header) => {
											const rowSpan = header.column.columnDef.meta?.rowSpan
											if (!header.isPlaceholder && rowSpan !== undefined && header.id === header.column.id) {
												return null
											}

											return (
												<TableHead
													key={header.id}
													colSpan={header.colSpan}
													rowSpan={rowSpan}
													className={cn('group relative z-40 bg-table-head p-0')}
													align={header.column.columnDef.meta?.align}
													style={{
														height: `${DEFAULT_ESTIMATE_SIZE}px`,
														width: `calc(var(--header-${header?.id}-size) * 1px)`,
														...DataTableUtility.getStickyOffsetPosition(header?.column)
													}}>
													<TableCellHead table={table} header={header} />
													<ColumnResizer header={header} />
												</TableHead>
											)
										})}
									</TableRow>
									{headerGroup.headers.every((header) => header.colSpan === 1) && (
										<TableRow>
											{headerGroup.headers.map((header) => {
												return <CollapsibleFilterCell key={header.id} header={header} />
											})}
										</TableRow>
									)}
								</Fragment>
							)
						})}
					</TableHeader>
					{loading ? (
						<TableBodyLoading table={table} prepareRows={10} />
					) : table.getState().columnSizingInfo.isResizingColumn &&
					  !table
							.getState()
							.columnPinning.left.some(
								(columnId) => columnId !== ROW_EXPANSION_COLUMN_ID && columnId !== ROW_SELECTION_COLUMN_ID
							) ? (
						<MemorizedTableBody {...{ table, virtualizer, renderSubComponent }} />
					) : (
						<TableBody {...{ table, virtualizer, renderSubComponent }} />
					)}
				</Table>
				{!loading && table.getRowModel().rows.length === 0 && <TableEmpty />}
			</ScrollArea>
			{footerProps && <TableFooter {...{ table, ...footerProps }} />}
		</Wrapper>
	)
}

const Wrapper = tw.div`flex flex-col items-stretch border outline-none ring-0 ring-offset-0 ring-offset-transparent overflow-clip rounded-md`
const ScrollArea = tw.div`relative flex flex-col items-stretch overflow-scroll max-w-full w-full scrollbar-track-scrollbar/20 outline-none border-none ring-0 ring-offset-0 ring-offset-transparent`

TableDataGrid.displayName = 'DataTable'

export default TableDataGrid
