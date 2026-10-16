import { cn } from '@common/utils/cn'
import { Div } from '@components/customs/div'
import { Collapsible, CollapsibleContent } from '@components/ui/collapsible'
import { TableCell, TableRow } from '@components/ui/table'
import type { Row } from '@tanstack/react-table'
import { flexRender } from '@tanstack/react-table'
import { Fragment, memo } from 'react'
import type { TableRowData } from '.'
import SizeTable from '../../../../../components/shared/size-table'
import { getCanSticky } from '../../../utils/get-can-sticky'

type DataTableRowProps = {
	size: number
	row: Row<TableRowData>
}

const DataTableRow: React.FC<DataTableRowProps> = ({ row, size }) => {
	'use no memo'

	const isExpanded = row.getIsExpanded()

	return (
		<Fragment>
			<TableRow aria-expanded={isExpanded} className={cn('[&_td]:border-x-0 [&_td]:border-b-0')}>
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
								className={cn('w-full max-w-full place-content-center truncate text-sm text-ellipsis', {
									'text-left!': meta?.align === 'left',
									'text-center!': meta?.align === 'center',
									'text-right!': meta?.align === 'right'
								})}>
								{flexRender(cell.column.columnDef.cell, cell.getContext())}
							</Div>
						</TableCell>
					)
				})}
			</TableRow>
			<TableRow>
				<TableCell
					className={cn('p-0', !isExpanded ? 'border-none shadow-none' : 'shadow-[inset_0_0px_4px_#17171725]')}
					colSpan={row.getVisibleCells()?.length}>
					<Collapsible data-state={isExpanded ? 'open' : 'closed'} open={isExpanded}>
						<CollapsibleContent className='bg-accent/50 data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down sticky left-0 w-[calc(100cqw-10px)] overflow-hidden transition-none'>
							<Div className='p-3'>
								<SizeTable
									data={row.original.size_ledger}
									total={
										Array.isArray(row.original.size_ledger)
											? row.original.size_ledger.reduce((acc, curr) => acc + curr.qty, 0)
											: 0
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
