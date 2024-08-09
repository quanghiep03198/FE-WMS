import { cn } from '@/common/utils/cn'
import { Collapsible, CollapsibleContent, Div } from '@/components/ui'
import { flexRender, type Row as TRow, type Table as TTable } from '@tanstack/react-table'
import { Virtualizer, notUndefined } from '@tanstack/react-virtual'
import { Fragment, memo } from 'react'
import isEqual from 'react-fast-compare'
import { TableCell, TableRow, TableBody as TableRowGroup } from '../../@core/table'
import { useTableContext } from '../context/table.context'
import { RenderSubComponent } from '../types'
import { DataTableUtility } from '../utils/table.util'

type TableBodyProps = {
	table: TTable<any>
	virtualizer: Virtualizer<HTMLDivElement, Element>
	renderSubComponent: RenderSubComponent
}

export const TableBody: React.FC<TableBodyProps> = ({ table, virtualizer, renderSubComponent }) => {
	const { tableWrapperRef } = useTableContext()
	const { rows } = table.getRowModel()
	const virtualItems = virtualizer.getVirtualItems()

	const [before, after] =
		virtualItems.length > 0
			? [
					notUndefined(virtualItems[0]).start - virtualizer.options.scrollMargin,
					virtualItems.length > 0
						? virtualizer.getTotalSize() - notUndefined(virtualItems[virtualItems.length - 1]).end
						: 0
				]
			: [0, 0]

	return (
		<TableRowGroup>
			{before > 0 && (
				<TableRow>
					<TableCell colSpan={table.getAllColumns().length} style={{ height: before }} />
				</TableRow>
			)}
			{Array.isArray(virtualItems) &&
				virtualItems.map((virtualRow) => {
					const row = rows[virtualRow.index] as TRow<any>
					return (
						<Fragment key={row?.id}>
							<TableRow data-index={virtualRow.index} className='group border-spacing-0'>
								{row?.getVisibleCells()?.map((cell) => {
									return (
										<TableCell
											key={cell.id}
											aria-selected={row.getIsSelected()}
											align={cell.column.columnDef.meta?.align}
											style={{
												width: `calc(var(--col-${cell.column.id}-size) * 1px)`,
												height: virtualRow.size,
												...DataTableUtility.getStickyOffsetPosition(cell.column)
											}}>
											<Div
												className={cn('line-clamp-1', {
													'block text-left': cell.column.columnDef.meta?.align === 'left',
													'block text-center': cell.column.columnDef.meta?.align === 'center',
													'block text-right': cell.column.columnDef.meta?.align === 'right'
												})}>
												{flexRender(cell.column.columnDef.cell, cell.getContext())}
											</Div>
										</TableCell>
									)
								})}
							</TableRow>
							{/* Sub-component */}
							<TableRow data-index={virtualRow.index}>
								<TableCell
									colSpan={row.getVisibleCells().length}
									className={cn('p-0', !row.getIsExpanded() ? 'border-none shadow-none' : 'shadow-inner')}>
									<Collapsible data-state={row.getIsExpanded() ? 'open' : 'closed'} open={row.getIsExpanded()}>
										<CollapsibleContent
											style={{
												position: 'sticky',
												left: '0',
												maxWidth: `calc(${tableWrapperRef.current?.clientWidth}px - var(--scrollbar-width, 16px))`
											}}
											className='transition-all ease-in-out data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down'>
											<Div className='p-4'>
												{typeof renderSubComponent === 'function' && renderSubComponent({ table, row })}
											</Div>
										</CollapsibleContent>
									</Collapsible>
								</TableCell>
							</TableRow>
						</Fragment>
					)
				})}
			{after > 0 && (
				<TableRow ref={(node) => virtualizer.measureElement(node)}>
					<TableCell colSpan={table.getAllColumns().length} style={{ height: after }} />
				</TableRow>
			)}
		</TableRowGroup>
	)
}

export const MemorizedTableBody = memo(TableBody, (prev, next) =>
	isEqual(prev.table.options.data, next.table.options.data)
)
