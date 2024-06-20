import { Row, flexRender, type Table as TTable } from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import { CSSProperties, useContext, useRef } from 'react'
import { DataTableProps } from '.'
import {
	Div,
	Icon,
	ScrollArea,
	Separator,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
	Typography
} from '../..'
import { TableContext } from '../context/table.context'
import ColumnResizer from './column-resizer'
import { TableBodyLoading } from './table-body-loading'
import { TableCellHead } from './table-cell-head'

interface TableProps<TData, TValue>
	extends Omit<DataTableProps<TData, TValue>, 'data' | 'slot'>,
		React.AllHTMLAttributes<HTMLTableElement>,
		Pick<React.ComponentProps<'div'>, 'style'> {
	table: TTable<TData>
}

export const ESTIMATE_SIZE = 48 as const

export default function TableDataGrid<TData, TValue>({
	containerProps = { style: { height: screen.availHeight / 2 } },
	table,
	loading
}: TableProps<TData, TValue>) {
	const { rows } = table.getRowModel()
	const containerRef = useRef<HTMLDivElement>()
	const headerRef = useRef<HTMLTableSectionElement>(null)
	const { handleScroll } = useContext(TableContext)
	const virtualizer = useVirtualizer({
		count: rows.length,
		getScrollElement: () => containerRef.current,
		estimateSize: () => ESTIMATE_SIZE,
		measureElement:
			typeof window !== 'undefined' && navigator.userAgent.indexOf('Firefox') === -1
				? (element) => element?.getBoundingClientRect().height
				: undefined,
		overscan: 5,
		indexAttribute: 'data-index'
	})

	return (
		<Div
			ref={containerRef}
			onWheel={handleScroll}
			className='relative z-0 w-full overflow-auto rounded-[var(--radius)] border bg-secondary/50 shadow scrollbar'
			{...containerProps}>
			<Table className='relative top-0 border-separate border-spacing-0' style={{ minWidth: table.getTotalSize() }}>
				<TableHeader className='sticky top-0 z-20' ref={headerRef}>
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id}>
							{headerGroup.headers.map((header, index) => (
								<TableHead
									key={header.id}
									colSpan={header.colSpan}
									data-sticky={header.column.columnDef?.meta?.sticky}
									style={{ position: 'relative', width: header.getSize() }}>
									<TableCellHead table={table} header={header} />
									{index === headerGroup.headers.length - 1 ? null : header.column.getCanResize() ? (
										<ColumnResizer header={header} />
									) : (
										<Separator
											orientation='vertical'
											className='absolute right-0 top-1/2 h-1/2 w-1 -translate-y-1/2 bg-muted'
										/>
									)}
								</TableHead>
							))}
						</TableRow>
					))}
				</TableHeader>
				<TableBody>
					{loading ? (
						<TableBodyLoading table={table} prepareRows={10} />
					) : (
						virtualizer.getVirtualItems().map((virtualRow, index) => {
							const row = rows[virtualRow.index] as Row<TData>
							const translateY = (offset: number): CSSProperties['transform'] => `translateY(${offset}px)`
							return (
								<TableRow
									key={row.id}
									data-index={virtualRow.index}
									ref={(node) => virtualizer.measureElement(node)}
									style={{ transform: translateY(virtualRow.start - index * virtualRow.size) }}>
									{row.getVisibleCells().map((cell) => (
										<TableCell
											key={cell.id}
											data-sticky={cell.column.columnDef?.meta?.sticky}
											data-state={row.getIsSelected() && 'selected'}
											style={{ width: cell.column.getSize(), height: virtualRow.size }}>
											{cell.getContext()?.cell ? (
												<Typography variant='small' className='line-clamp-1'>
													{flexRender(cell.column.columnDef.cell, cell.getContext())}
												</Typography>
											) : (
												flexRender(cell.column.columnDef.cell, cell.getContext())
											)}
										</TableCell>
									))}
								</TableRow>
							)
						})
					)}
				</TableBody>
			</Table>
			{!loading && table.getRowModel().rows.length === 0 && (
				<Div
					className='sticky left-0 right-auto top-0 flex h-full w-full items-center justify-center bg-background'
					style={{ height: `calc(100% - ${headerRef.current?.offsetHeight}px)` }}>
					<Div className='flex items-center justify-center gap-x-2 text-muted-foreground'>
						<Icon name='Database' strokeWidth={1} size={32} /> No data
					</Div>
				</Div>
			)}
		</Div>
	)
}

TableDataGrid.displayName = 'DataTable'
