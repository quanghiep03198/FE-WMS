'use no memo'

import { cn } from '@/common/utils/cn'
import { Collapsible, CollapsibleContent, Div, TableCell, TableRow } from '@/components/ui'
import { flexRender, Row } from '@tanstack/react-table'
import { Fragment, memo } from 'react'
import { TableRowData } from '.'
import SizeTable from '../../../-components/shared/size-table'
import { getCanSticky } from './utils'

type DataTableRowProps = {
	size: number
	row: Row<TableRowData>
}

const DataTableRow: React.FC<DataTableRowProps> = ({ row, size }) => {
	'use no memo'

	return (
		<Fragment>
			<TableRow aria-expanded={row.getIsExpanded()} className={cn('[&_td]:border-x-0 [&_td]:border-b-0')}>
				{row?.getVisibleCells()?.map((cell) => {
					const meta = cell.column.columnDef.meta
					return (
						<TableCell
							{...cell.column.columnDef?.meta?.tableCellProps}
							key={cell.id}
							style={{
								width: cell.column.getSize(),
								height: size + 'px',
								...getCanSticky(cell.column.id)
							}}>
							<Div
								className={cn('w-full max-w-full place-content-center truncate overflow-ellipsis text-sm', {
									'!text-left': meta?.align === 'left',
									'!text-center': meta?.align === 'center',
									'!text-right': meta?.align === 'right'
								})}>
								{flexRender(cell.column.columnDef.cell, cell.getContext())}
							</Div>
						</TableCell>
					)
				})}
			</TableRow>
			<TableRow>
				<TableCell
					colSpan={row.getVisibleCells().length}
					className={cn('p-0', !row.getIsExpanded() && 'border-none shadow-none')}>
					<Collapsible open={row.getIsExpanded()} data-state={row.getIsExpanded() ? 'open' : 'closed'}>
						<CollapsibleContent
							className='overflow-auto bg-accent/80 transition-none data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down'
							style={{
								width: 'var(--table-width)',
								position: 'sticky',
								left: '0',
								scrollbarGutter: 'stable'
							}}>
							<Div className='p-4'>
								<SizeTable
									data={row.original.inv_sizes}
									total={
										Array.isArray(row.original.inv_sizes) &&
										row.original.inv_sizes.reduce((acc, curr) => acc + curr.qty, 0)
									}
								/>
							</Div>
						</CollapsibleContent>
					</Collapsible>
				</TableCell>
			</TableRow>
		</Fragment>
	)
}

DataTableRow.displayName = 'DataTableRow'

const MemoizedDataTableRow = memo(DataTableRow)

export { DataTableRow, MemoizedDataTableRow }
