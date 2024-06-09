import { cn } from '@/common/utils/cn'
import { Table as TableType, flexRender } from '@tanstack/react-table'
import { useContext } from 'react'
import tw from 'tailwind-styled-components'
import { DataTableProps } from '.'
import { Div, Icon, ScrollArea, ScrollBar, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../..'
import { TableContext } from '../context/table.context'
import ColumnResizer from './column-resizer'
import { TableBodyLoading } from './table-body-loading'
import { TableCellHead } from './table-cell-head'

interface TableProps<TData, TValue>
	extends Omit<DataTableProps<TData, TValue>, 'data' | 'slot'>,
		React.AllHTMLAttributes<HTMLTableElement> {
	table: TableType<TData>
}

export default function TableDataGrid<TData, TValue>({ table, columns, loading, ...props }: TableProps<TData, TValue>) {
	const { handleScroll } = useContext(TableContext)

	return (
		<TableWrapper className='group w-full shadow'>
			<ScrollArea
				onWheel={handleScroll}
				className={cn('relative', { 'h-[60vh]': table.getRowModel().rows.length >= 10 })}>
				<Table
					className='border-separate border-spacing-0'
					style={{
						width: table.getCenterTotalSize(),
						minWidth: '100%'
					}}
					{...props}>
					<TableHeader className='sticky top-0 z-10 border-b bg-opacity-90 backdrop-blur'>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id} className='sticky top-0 hover:bg-background'>
								{headerGroup.headers.map((header, index) => (
									<TableHead
										className='relative whitespace-nowrap border-b px-4'
										{...{
											key: header.id,
											colSpan: header.colSpan,
											style: {
												width: header.getSize()
											}
										}}>
										<TableCellHead table={table} header={header} />
										{index !== headerGroup.headers.length - 1 && table.options.enableColumnResizing && (
											<ColumnResizer header={header} />
										)}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{loading ? (
							<TableBodyLoading prepareRows={10} prepareCols={columns.length} />
						) : (
							table.getRowModel().rows.map((row) => (
								<TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											<span className='line-clamp-1'>
												{flexRender(cell.column.columnDef.cell, cell.getContext())}
											</span>
										</TableCell>
									))}
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
				<ScrollBar orientation='horizontal' />
			</ScrollArea>
			{!loading && table.getRowModel().rows.length === 0 && (
				<Div className='flex h-[25vh] w-full items-center justify-center'>
					<Div className='flex items-center justify-center gap-x-2 text-muted-foreground'>
						<Icon name='PackageOpen' strokeWidth={1} size={32} /> Không có dữ liệu
					</Div>
				</Div>
			)}
		</TableWrapper>
	)
}

const TableWrapper = tw.div`relative flex flex-col items-stretch h-full max-w-full mx-auto overflow-clip border rounded-lg`

TableDataGrid.displayName = 'DataTable'
