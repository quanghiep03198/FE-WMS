import { cn } from '@/common/utils/cn'
import { Collapsible, CollapsibleContent, Div } from '@/components/ui'
import { flexRender, type Row } from '@tanstack/react-table'
import { useMemoizedFn, useUpdateEffect } from 'ahooks'
import { Fragment, memo, useRef } from 'react'
import { TableCell, TableRow } from '../../@core/table'
import { useTableContext } from '../context/table.context'
import { getStickyOffsetPosition } from '../utils/table.util'
import { type TableBodyProps } from './table-body'

type VirtualTableRowProps = Pick<TableBodyProps, 'renderSubComponent'> & {
	row: Row<any>
	index: number
	size: number
	measureElement: (node: HTMLTableRowElement) => void
	scrollToIndex: (index) => void
}

const VirtualTableRow: React.FC<VirtualTableRowProps> = ({
	row,
	index,
	size,
	measureElement,
	scrollToIndex,
	renderSubComponent
}) => {
	'use no memo'

	const { table } = useTableContext('table')
	const computeStickyOffsetPosition = useMemoizedFn(getStickyOffsetPosition)
	const requestAnimationFrameRef = useRef<number>(null)

	const isSelected = row.getIsSelected()
	const isExpanded = row.getIsExpanded()

	useUpdateEffect(() => {
		if (isExpanded) requestAnimationFrameRef.current = requestAnimationFrame(() => scrollToIndex(index))

		return () => {
			if (requestAnimationFrameRef.current) {
				cancelAnimationFrame(requestAnimationFrameRef.current)
				requestAnimationFrameRef.current = null
			}
		}
	}, [isExpanded])

	return (
		<Fragment>
			<TableRow
				data-role='data-grid-row'
				data-index={index}
				aria-selected={isSelected}
				aria-expanded={isExpanded}
				className='group'
				// ref={measureElement}
			>
				{row.getVisibleCells().map((cell) => {
					return (
						<TableCell
							data-role='data-grid-cell'
							{...cell.column.columnDef?.meta?.tableCellProps}
							key={cell.id}
							align={cell.column.columnDef.meta?.align}
							className={cn(devicePixelRatio > 1 ? 'py-1.5' : 'py-2')}
							style={{
								width: `var(--column-${cell.column.id}-size)`,
								height: size,
								maxHeight: size,
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

			{typeof renderSubComponent === 'function' && isExpanded && (
				<TableRow data-role='expandable-row'>
					<TableCell colSpan={row.getVisibleCells().length} className='p-0 shadow-[inset_0_0px_4px_#17171725]'>
						<Collapsible open={isExpanded}>
							<CollapsibleContent
								className='sticky left-0 w-[var(--table-width)] overflow-auto bg-secondary/50 [scrollbar-gutter:stable]'
								// transition-none transition-allow-discrete data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down
							>
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
		<TableRow role='placeholder-row'>
			<TableCell {...props} />
		</TableRow>
	)
})

VirtualPlaceholderRow.displayName = 'VirtualPlaceholderRow'

const MemoizedVirtualTableRow = memo(VirtualTableRow)

export { MemoizedVirtualTableRow, VirtualPlaceholderRow, VirtualTableRow }
