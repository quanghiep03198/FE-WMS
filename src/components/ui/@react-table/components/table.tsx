import { flexRender, type Row, type Table as TTable } from '@tanstack/react-table'
import { notUndefined, useVirtualizer } from '@tanstack/react-virtual'
import { Fragment, WheelEventHandler, useCallback, useContext, useRef } from 'react'
import { type DataTableProps } from '..'
import { Div, Icon, Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../..'
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

export default function TableDataGrid<TData, TValue>({
	containerProps = { style: { height: screen.height / 2 } },
	table,
	caption,
	loading,
	renderSubComponent
}: TableProps<TData, TValue>) {
	const { rows } = table.getRowModel()
	const containerRef = useRef<HTMLDivElement>(null)
	const headerRef = useRef<HTMLTableSectionElement>(null)
	const tableRef = useRef<HTMLTableElement>(null)
	const timeoutRef = useRef<NodeJS.Timeout | null>(null)
	const { isScrolling, setIsScrolling } = useContext(TableContext)

	const virtualizer = useVirtualizer({
		count: rows.length,
		indexAttribute: 'data-index',
		overscan: table.getState().pagination.pageSize,
		getScrollElement: () => containerRef.current,
		estimateSize: useCallback(() => ESTIMATE_SIZE, []),
		measureElement:
			typeof window !== 'undefined' && navigator.userAgent.indexOf('Firefox') === -1
				? (element) => element?.getBoundingClientRect().height
				: undefined
	})

	const virtualItems = virtualizer.getVirtualItems()

	const [before, after] =
		virtualItems.length > 0
			? [
					notUndefined(virtualItems[0]).start - virtualizer.options.scrollMargin,
					virtualizer.getTotalSize() - notUndefined(virtualItems[virtualItems.length - 1]).end
				]
			: [0, 0]

	const colSpan = table.getAllColumns().length

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
			role='group'
			className='flex flex-col items-stretch divide-y divide-border overflow-clip rounded-[var(--radius)] border bg-secondary/25 shadow'>
			<Div
				{...containerProps}
				ref={containerRef}
				role='scrollbar'
				className='relative flex flex-col items-stretch overflow-auto scroll-smooth scrollbar scrollbar-track-background'
				onWheel={handleMouseWheel}>
				<Table
					ref={tableRef}
					className='w-full table-fixed border-separate border-spacing-0'
					style={{ minWidth: table.getTotalSize(), height: virtualizer.getTotalSize() }}>
					{caption && (
						<TableCaption aria-labelledby='#caption' className='hidden'>
							{caption}
						</TableCaption>
					)}
					<TableHeader className='sticky top-0 z-20 bg-background' ref={headerRef}>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header, index) => (
									<TableHead
										key={header.id}
										colSpan={header.colSpan}
										data-sticky={header.column.columnDef?.meta?.sticky}
										className='group relative px-0'
										style={{ width: header.getSize() }}>
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
							<Fragment>
								{before > 0 && (
									<TableRow>
										<TableCell colSpan={colSpan} style={{ height: before }} />
									</TableRow>
								)}

								{virtualItems.map((virtualRow) => {
									const row = rows[virtualRow.index] as Row<TData>
									return (
										<Fragment key={row.id}>
											<TableRow
												data-index={virtualRow.index}
												// ref={(node) => virtualizer.measureElement(node)}
											>
												{row.getVisibleCells().map((cell) => (
													<TableCell
														key={cell.id}
														data-sticky={cell.column.columnDef?.meta?.sticky}
														data-state={row.getIsSelected() && 'selected'}
														style={{ width: cell.column.getSize(), height: virtualRow.size }}>
														<Div className='line-clamp-1'>
															{flexRender(cell.column.columnDef.cell, cell.getContext())}
														</Div>
													</TableCell>
												))}
											</TableRow>

											{row.getIsExpanded() && (
												<TableRow className='bg-background'>
													<TableCell colSpan={row.getVisibleCells().length}>
														{typeof renderSubComponent === 'function' && renderSubComponent({ row })}
													</TableCell>
												</TableRow>
											)}
										</Fragment>
									)
								})}

								{after > 0 && (
									<TableRow>
										<TableCell colSpan={colSpan} style={{ height: after }} />
									</TableRow>
								)}
							</Fragment>
						)}
					</TableBody>
				</Table>
				{!loading && table.getRowModel().rows.length === 0 && (
					<Div
						role='contentinfo'
						className='sticky left-0 top-0 flex h-full w-full flex-1 items-center justify-center bg-background'>
						<Div className='flex items-center justify-center gap-x-2 text-muted-foreground'>
							<Icon name='Database' strokeWidth={1} size={32} /> No data
						</Div>
					</Div>
				)}
			</Div>
			{caption && (
				<Div
					aria-description={caption}
					id='caption'
					className='bg-background p-3 text-center text-sm text-muted-foreground'>
					{caption}
				</Div>
			)}
		</Div>
	)
}

TableDataGrid.displayName = 'DataTable'
