import { cn } from '@/common/utils/cn'
import { type Table as TTable } from '@tanstack/react-table'
import { elementScroll, useVirtualizer, VirtualizerOptions } from '@tanstack/react-virtual'
import { Fragment, useCallback, useContext, useId, useMemo, useRef } from 'react'
import { Div, Icon, Table, TableCaption, TableHead, TableHeader, TableRow } from '../..'
import { TableContext } from '../context/table.context'
import { type DataTableProps } from '../types'
import { DataTableUtility } from '../utils/table.util'
import { ColumnFilter } from './column-filter'
import ColumnResizer from './column-resizer'
import { MemorizedTableBody, TableBody } from './table-body'
import { TableBodyLoading } from './table-body-loading'
import { TableCellHead } from './table-cell-head'
import TableEmpty from './table-empty'
import { TableFooter } from './table-footer'
import { TableHeadCaption } from './table-head-caption'

interface TableProps<TData, TValue>
	extends Omit<DataTableProps<TData, TValue>, 'data' | 'slot'>,
		Omit<React.AllHTMLAttributes<HTMLTableElement>, 'data'>,
		Pick<React.ComponentProps<'div'>, 'style'> {
	table: TTable<TData>
}

export const ESTIMATE_SIZE = 36

function easeInOutQuint(t) {
	return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t
}

function TableDataGrid<TData, TValue>({
	containerProps = { style: { height: screen.height / 2 } },
	table,
	footerProps = { hidden: true, slot: null },
	caption,
	loading,
	renderSubComponent
}: TableProps<TData, TValue>) {
	const { isFilterOpened } = useContext(TableContext)
	const { rows } = table.getRowModel()
	const containerRef = useRef<HTMLDivElement>(null)
	const headerRef = useRef<HTMLTableSectionElement>(null)
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
		for (let i = 0; i < headers.length; i++) {
			const header = headers[i]!
			colSizes[`--header-${header.id}-size`] = header.getSize()
			colSizes[`--col-${header.column.id}-size`] = header.column.getSize()
		}
		return colSizes
	}, [table.getState().columnSizingInfo, table.getState().columnSizing])

	return (
		<Div
			role='group'
			className='flex flex-col items-stretch divide-y divide-border overflow-clip rounded-[var(--radius)] border bg-secondary/50'>
			{caption && <TableHeadCaption id={captionId} aria-description={caption} />}
			<Div
				{...containerProps}
				ref={containerRef}
				role='scrollbar'
				className={cn(
					'relative flex flex-col items-stretch overflow-auto scroll-smooth scrollbar scrollbar-track-background',
					containerProps?.className
				)}>
				<Table
					ref={tableRef}
					className='w-full table-fixed border-separate border-spacing-0'
					style={{ ...columnSizeVars, minWidth: table.getTotalSize(), height: virtualizer.getTotalSize() }}>
					{caption && (
						<TableCaption aria-labelledby={captionId} className='hidden'>
							{caption}
						</TableCaption>
					)}
					<TableHeader className='sticky top-0 z-20 bg-background' ref={headerRef}>
						{table.getHeaderGroups().map((headerGroup) => (
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
												data-sticky={header.column.columnDef?.meta?.sticky}
												className={cn('group relative')}
												style={{
													width: `calc(var(--header-${header?.id}-size) * 1px)`,
													...DataTableUtility.getStickyOffsetPosition(header.column)
												}}>
												<TableCellHead table={table} header={header} />
												<ColumnResizer header={header} visible={true} />
											</TableHead>
										)
									})}
								</TableRow>
								{isFilterOpened &&
									headerGroup.headers.every((header) => {
										return header.colSpan === 1
									}) && (
										<TableRow>
											{headerGroup.headers.map((header) => {
												return (
													<TableHead
														key={header.id}
														colSpan={header.colSpan}
														data-sticky={header.column.columnDef?.meta?.sticky}
														className='group relative p-0'
														style={{
															width: `calc(var(--header-${header?.id}-size) * 1px)`,
															...DataTableUtility.getStickyOffsetPosition(header.column)
														}}>
														{header.column.columnDef.enableColumnFilter ? (
															<ColumnFilter column={header.column} />
														) : (
															<Div className='flex h-full select-none items-center justify-center px-2 text-xs font-medium text-muted-foreground/50'>
																<Icon name='Minus' />
															</Div>
														)}
													</TableHead>
												)
											})}
										</TableRow>
									)}
							</Fragment>
						))}
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
			</Div>
			{footerProps && <TableFooter {...{ table, ...footerProps }} />}
		</Div>
	)
}

TableDataGrid.displayName = 'DataTable'

export default TableDataGrid
