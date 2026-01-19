import { cn } from '@/common/utils/cn'
import { Collapsible, CollapsibleContent, Div } from '@/components/ui'
import { flexRender, RowData, type Row } from '@tanstack/react-table'
import { useMemoizedFn } from 'ahooks'
import { Fragment, memo } from 'react'
import { TableCell, TableRow } from '../../@core/table'
import { useTableContext } from '../context/table.context'
import { getStickyOffsetPosition } from '../utils/table.util'
import { type TableBodyProps } from './table-body'

type VirtualTableRowProps<TData extends RowData> = Pick<TableBodyProps<TData>, 'renderSubComponent'> & {
	isScrolling: boolean
	row: Row<any>
	index: number
}

function VirtualTableRow<TData>({ row, isScrolling, index, renderSubComponent }: VirtualTableRowProps<TData>) {
	'use no memo'

	const { table } = useTableContext('table')
	const computeStickyOffsetPosition = useMemoizedFn(getStickyOffsetPosition)

	const isSelected = row.getIsSelected()
	const isExpanded = row.getIsExpanded()

	return (
		<Fragment>
			<TableRow
				data-index={index}
				data-role='data-grid-row'
				aria-selected={isSelected}
				aria-expanded={isExpanded}
				className={cn('group h-[var(--row-height,40px)]', isScrolling && 'will-change-scroll')}>
				{row.getVisibleCells().map((cell) => {
					return (
						<TableCell
							key={cell.id}
							data-role='data-grid-cell'
							align={cell.column.columnDef.meta?.align}
							style={{
								width: `var(--column-${cell.column.id}-size)`,
								...computeStickyOffsetPosition(cell.column)
							}}
							{...cell.column.columnDef?.meta?.tableCellProps}>
							<Div align={cell.column.columnDef.meta?.align} className='line-clamp-1'>
								{flexRender(cell.column.columnDef.cell, cell.getContext())}
							</Div>
						</TableCell>
					)
				})}
			</TableRow>
			{/* Sub-component */}

			{typeof renderSubComponent === 'function' && (
				<TableRow data-role='expandable-row' className='w-full'>
					<TableCell
						colSpan={row.getVisibleCells().length}
						className={cn('p-0', isExpanded ? 'border-b shadow-[inset_0_0px_4px_#17171725]' : 'border-none')}>
						<Collapsible open={isExpanded}>
							<CollapsibleContent className='group/detail sticky left-0 w-[100cqw] overflow-auto bg-secondary/50 transition-allow-discrete [scrollbar-gutter:stable] data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down'>
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
		<tr role='placeholder-row' style={props.style}>
			<td colSpan={props.colSpan} />
		</tr>
	)
})

VirtualPlaceholderRow.displayName = 'VirtualPlaceholderRow'

const MemoizedVirtualTableRow = memo(VirtualTableRow, (prevProps, nextProps) => nextProps.isScrolling)

export { MemoizedVirtualTableRow, VirtualPlaceholderRow }
