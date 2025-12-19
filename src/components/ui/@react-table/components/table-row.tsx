import { cn } from '@/common/utils/cn'
import { Collapsible, CollapsibleContent, Div } from '@/components/ui'
import { flexRender, type Row } from '@tanstack/react-table'
import { useMemoizedFn } from 'ahooks'
import { Fragment, memo } from 'react'
import { TableCell, TableRow } from '../../@core/table'
import { useTableContext } from '../context/table.context'
import { getStickyOffsetPosition } from '../utils/table.util'
import { type TableBodyProps } from './table-body'

type VirtualTableRowProps = Pick<TableBodyProps, 'renderSubComponent'> & {
	row: Row<any>
	size: number
}

const VirtualTableRow: React.FC<VirtualTableRowProps> = ({ row, size, renderSubComponent }) => {
	'use no memo'

	const { table } = useTableContext('table')

	const computeStickyOffsetPosition = useMemoizedFn(getStickyOffsetPosition)

	return (
		<Fragment>
			<TableRow
				data-role='data-grid-row'
				aria-selected={row.getIsSelected()}
				aria-expanded={row.getIsExpanded()}
				className='group border-spacing-0'>
				{row.getVisibleCells().map((cell) => {
					return (
						<TableCell
							data-role='data-grid-cell'
							{...cell.column.columnDef?.meta?.tableCellProps}
							key={cell.id}
							align={cell.column.columnDef.meta?.align}
							style={{
								width: `var(--column-${cell.column.id}-size)`,
								height: size,
								...computeStickyOffsetPosition(cell.column)
							}}>
							<Div align={cell.column.columnDef.meta?.align} className={cn('!line-clamp-1', {})}>
								{flexRender(cell.column.columnDef.cell, cell.getContext())}
							</Div>
						</TableCell>
					)
				})}
			</TableRow>
			{/* Sub-component */}
			{typeof renderSubComponent === 'function' && (
				<TableRow data-role='expandable-row'>
					<TableCell
						colSpan={row.getVisibleCells().length}
						className={cn(
							'p-0',
							!row.getIsExpanded() ? 'border-none shadow-none' : 'shadow-[inset_0_0px_4px_#17171725]'
						)}>
						<Collapsible data-state={row.getIsExpanded() ? 'open' : 'closed'} open={row.getIsExpanded()}>
							<CollapsibleContent
								style={{
									width: 'var(--table-width)',
									position: 'sticky',
									left: '0',
									scrollbarGutter: 'stable'
								}}
								className='overflow-auto bg-secondary/50 transition-none data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down'>
								<Div className='p-3'>{renderSubComponent({ table, row })}</Div>
							</CollapsibleContent>
						</Collapsible>
					</TableCell>
				</TableRow>
			)}
		</Fragment>
	)
}

const VirtualPlaceholderRow: React.FC<React.ComponentProps<'td'>> = memo((props) => {
	return (
		<TableRow>
			<TableCell {...props} />
		</TableRow>
	)
})

VirtualPlaceholderRow.displayName = 'VirtualPlaceholderRow'

const MemoizedVirtualTableRow = memo(VirtualTableRow)

export { MemoizedVirtualTableRow, VirtualPlaceholderRow, VirtualTableRow }
