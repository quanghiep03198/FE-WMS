import { Row, flexRender, type Table as TTable } from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useDeepCompareEffect } from 'ahooks'
import { WheelEventHandler, useCallback, useContext, useRef, useState } from 'react'
import { DataTableProps } from '..'
import { Div, Icon, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../..'
import { TableContext } from '../context/table.context'
import ColumnResizer from './column-resizer'
import { TableBodyLoading } from './table-body-loading'
import { TableCellHead } from './table-cell-head'

interface TableProps<TData, TValue>
	extends Omit<DataTableProps<TData, TValue>, 'data' | 'slot'>,
		Omit<React.AllHTMLAttributes<HTMLTableElement>, 'data'>,
		Pick<React.ComponentProps<'div'>, 'style'> {
	table: TTable<TData>
}

export const ESTIMATE_SIZE = 52

const adjustTableHeight = (tableRef, virtualHeight) => {
	if (!tableRef.current) return
	const existingPseudoElement = window.getComputedStyle(tableRef.current, '::after')
	const existingPseudoHeight = parseFloat(existingPseudoElement.height) || 0
	const tableHeight = tableRef.current.clientHeight - existingPseudoHeight
	const pseudoHeight = Math.max(virtualHeight - tableHeight, 0)
	document.documentElement.style.setProperty('--pseudo-height', `${pseudoHeight}px`)
	return pseudoHeight
}

export default function TableDataGrid<TData, TValue>({
	containerProps = { style: { height: screen.availHeight / 2 } },
	table,
	loading
}: TableProps<TData, TValue>) {
	const { rows } = table.getRowModel()
	const containerRef = useRef<HTMLDivElement>(null)
	const headerRef = useRef<HTMLTableSectionElement>(null)
	const scrollableRef = useRef<HTMLDivElement>(null)
	const tableRef = useRef<HTMLTableElement>(null)
	const [isScrollNearBottom, setIsScrollNearBottom] = useState<boolean>(false)
	const timeoutRef = useRef<NodeJS.Timeout | null>(null)
	const { isScrolling, setIsScrolling } = useContext(TableContext)

	const virtualizer = useVirtualizer({
		count: rows.length,
		getScrollElement: () => containerRef.current,
		estimateSize: () => ESTIMATE_SIZE,
		measureElement:
			typeof window !== 'undefined' && navigator.userAgent.indexOf('Firefox') === -1
				? (element) => element?.getBoundingClientRect().height
				: undefined,
		overscan: 1,
		indexAttribute: 'data-index'
	})

	const virtualItems = virtualizer.getVirtualItems()
	const virtualSize = virtualizer.getTotalSize()

	const handlePseudoResize = useCallback(() => {
		return adjustTableHeight(tableRef, virtualSize)
	}, [tableRef, virtualSize])

	const handleScroll = useCallback(() => {
		if (containerRef.current) {
			const scrollPosition = containerRef.current?.scrollTop
			const visibleHeight = containerRef.current?.clientHeight
			setIsScrollNearBottom(scrollPosition >= virtualSize * 0.95 - visibleHeight)
		}
	}, [containerRef, virtualSize])

	useDeepCompareEffect(() => {
		const scrollable = containerRef.current
		if (scrollable) scrollable.addEventListener('scroll', handleScroll)
		handlePseudoResize()
		return () => {
			if (scrollable) scrollable.removeEventListener('scroll', handleScroll)
		}
	}, [handleScroll, handlePseudoResize])

	useDeepCompareEffect(() => {
		if (isScrollNearBottom) handlePseudoResize()
	}, [isScrollNearBottom, virtualItems.length, handlePseudoResize])

	// Close all
	const handleMouseWheel: WheelEventHandler = (e) => {
		e.stopPropagation()
		if (timeoutRef.current) clearTimeout(timeoutRef.current!)
		setIsScrolling(!isScrolling)
		timeoutRef.current = setTimeout(() => {
			setIsScrolling(!isScrolling)
		}, 0)
	}

	return (
		<Div
			ref={containerRef}
			className='relative overflow-auto rounded-[var(--radius)] border bg-secondary/50 shadow scrollbar'
			onWheel={handleMouseWheel}
			{...containerProps}>
			<Div ref={scrollableRef} style={{ position: 'relative', height: virtualSize }}>
				<Table
					ref={tableRef}
					className='border-separate border-spacing-0 after:block after:h-[var(--pseudo-height)] after:[content:""]'
					style={{ minWidth: table.getTotalSize() }}>
					<TableHeader className='sticky top-0 z-20 bg-background' ref={headerRef}>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header, index) => (
									<TableHead
										key={header.id}
										colSpan={header.colSpan}
										data-sticky={header.column.columnDef?.meta?.sticky}
										className='group'
										style={{
											width: header.getSize(),
											position: 'relative'
										}}>
										<TableCellHead table={table} header={header} />
										{index === headerGroup.headers.length - 1 ? null : header.column.getCanResize() ? (
											<ColumnResizer header={header} />
										) : null}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{loading ? (
							<TableBodyLoading table={table} prepareRows={10} />
						) : (
							virtualItems.map((virtualItem, index) => {
								const row = rows[virtualItem.index] as Row<TData>
								return (
									<TableRow
										key={row.id}
										data-index={virtualItem.index}
										ref={(node) => virtualizer.measureElement(node)}
										style={{ transform: `translateY(${virtualItem.start - index * virtualItem.size}px)` }}>
										{row.getVisibleCells().map((cell) => (
											<TableCell
												key={cell.id}
												data-sticky={cell.column.columnDef?.meta?.sticky}
												data-state={row.getIsSelected() && 'selected'}
												style={{ width: cell.column.getSize(), height: virtualItem.size }}>
												<Div className='line-clamp-1'>
													{flexRender(cell.column.columnDef.cell, cell.getContext())}
												</Div>
											</TableCell>
										))}
									</TableRow>
								)
							})
						)}
					</TableBody>
				</Table>
			</Div>
			{!loading && table.getRowModel().rows.length === 0 && (
				<Div
					className='sticky left-0 top-10 flex h-full w-full items-center justify-center bg-background'
					style={{ top: headerRef.current?.offsetHeight }}>
					<Div className='flex items-center justify-center gap-x-2 text-muted-foreground'>
						<Icon name='Database' strokeWidth={1} size={32} /> No data
					</Div>
				</Div>
			)}
		</Div>
	)
}

TableDataGrid.displayName = 'DataTable'
