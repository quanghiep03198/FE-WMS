import { cn } from '@/common/utils/cn'
import { type Table as TTable } from '@tanstack/react-table'
import { elementScroll, useVirtualizer, VirtualizerOptions } from '@tanstack/react-virtual'
import { Fragment, memo, useCallback, useId, useMemo, useRef } from 'react'
import { Collapsible, CollapsibleContent, Table, TableCaption, TableHead, TableHeader, TableRow } from '../..'
import { useTableContext } from '../context/table.context'
import { type DataTableProps } from '../types'
import { DataTableUtility } from '../utils/table.util'
import { ColumnFilter } from './column-filter'
import ColumnResizer from './column-resizer'
import { MemorizedTableBody, TableBody } from './table-body'
import { TableBodyLoading } from './table-body-loading'
import { TableCellHead } from './table-cell-head'
import TableEmpty from './table-empty'
import TableFooter from './table-footer'
import { TableHeadCaption } from './table-head-caption'
// needed for table body level scope DnD setup
import { type DragEndEvent } from '@dnd-kit/core'
import tw from 'tailwind-styled-components'

interface TableProps<TData, TValue>
	extends Omit<DataTableProps<TData, TValue>, 'data' | 'slot'>,
		Omit<React.AllHTMLAttributes<HTMLTableElement>, 'data'>,
		Pick<React.ComponentProps<'div'>, 'style'> {
	table: TTable<TData>
	onColumnDragEnd?: (event: DragEndEvent) => void
}

export const ESTIMATE_SIZE = 40

function easeInOutQuint(t) {
	return t <= 0.5 ? 16 * t ** 5 : 1 + 16 * (--t) ** 5
}

function TableDataGrid<TData, TValue>({
	containerProps = { style: { height: screen.height / 2 } },
	table,
	footerProps = { hidden: true, slot: null },
	caption,
	loading,
	renderSubComponent
}: TableProps<TData, TValue>) {
	const { isFilterOpened } = useTableContext()
	const { rows } = table.getRowModel()
	const containerRef = useRef<HTMLDivElement>(null)
	const tableRef = useRef<HTMLTableElement>(null)
	const scrollingRef = useRef<number>()
	const captionId = useId()

	const scrollToFn: VirtualizerOptions<any, any>['scrollToFn'] = useCallback((offset, canSmooth, instance) => {
		const duration = 1000
		const start = containerRef.current.scrollTop
		const startTime = (scrollingRef.current = Date.now())

		const run = () => {
			if (scrollingRef.current !== startTime) return
			const now = Date.now()
			const elapsed = now - startTime
			const progress = easeInOutQuint(Math.min(elapsed / duration, 1))
			const interpolated = start + (offset - start) * progress

			if (elapsed < duration) {
				elementScroll(interpolated, canSmooth, instance)
				requestAnimationFrame(run)
			} else {
				elementScroll(interpolated, canSmooth, instance)
			}
		}

		requestAnimationFrame(run)
	}, [])

	const virtualizer = useVirtualizer({
		count: rows.length,
		indexAttribute: 'data-index',
		overscan:
			table.getCanSomeRowsExpand() && table.getIsSomeRowsExpanded()
				? table.getExpandedRowModel().flatRows.length
				: 5,
		getScrollElement: () => containerRef.current,
		estimateSize: useCallback(() => ESTIMATE_SIZE, []),
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

	const hasSomeGroupedColumn = table
		.getHeaderGroups()
		.some((headerGroup) => headerGroup.headers.some((header) => header.colSpan > 1))

	return (
		<Wrapper role='group'>
			{caption && <TableHeadCaption id={captionId} aria-description={caption} />}
			<ScrollArea ref={containerRef} role='scrollbar' className={containerProps?.className} {...containerProps}>
				<Table
					ref={tableRef}
					className='w-full table-fixed border-separate border-spacing-0'
					style={{
						...columnSizeVars,
						minWidth: table.getTotalSize(),
						height: virtualizer.getTotalSize()
					}}>
					{caption && (
						<TableCaption aria-labelledby={captionId} className='hidden'>
							{caption}
						</TableCaption>
					)}
					<TableHeader className='sticky top-0 z-20 bg-background [&:not(:only-child)>tr:not(:last-child)>th:not(:last-child)]:!border-l-0'>
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
													className={cn('group relative h-10 p-0')}
													style={{
														height: `${ESTIMATE_SIZE}px`,
														width: `calc(var(--header-${header?.id}-size) * 1px)`,
														...DataTableUtility.getStickyOffsetPosition(header?.column, table)
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
												return (
													<TableHead
														key={header.id}
														colSpan={header.colSpan}
														className={cn(
															'group relative p-0',
															isFilterOpened ? 'border-b border-border' : 'border-none'
														)}
														style={{
															width: `calc(var(--header-${header?.id}-size) * 1px)`,
															...DataTableUtility.getStickyOffsetPosition(header?.column)
														}}>
														<Collapsible
															data-state={isFilterOpened ? 'open' : 'closed'}
															open={isFilterOpened}>
															<CollapsibleContent className='overflow-hidden h-10 transition-all data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down'>
																<ColumnFilter column={header.column} />
															</CollapsibleContent>
														</Collapsible>
													</TableHead>
												)
											})}
										</TableRow>
									)}
								</Fragment>
							)
						})}
					</TableHeader>

					{loading ? (
						<TableBodyLoading table={table} prepareRows={10} />
					) : table.getState().columnSizingInfo.isResizingColumn ? (
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

const Wrapper = tw.div`flex bprder flex-col items-stretch border rounded-[var(--radius)] overflow-clip divide-y divide-border`
const ScrollArea = tw.div`relative flex flex-col items-stretch overflow-scroll scrollbar-track-scrollbar/20`

TableDataGrid.displayName = 'DataTable'

export default memo(TableDataGrid)
