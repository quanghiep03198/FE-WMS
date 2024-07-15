import { flexRender, type Row as TRow, type Table as TTable } from '@tanstack/react-table'
import { Virtualizer, notUndefined } from '@tanstack/react-virtual'
import { Fragment, memo } from 'react'
import { TableBody as Body, TableCell as Cell, TableRow as Row } from '../../@core/table'
import { Div } from '../../@custom/div'
import { RenderSubComponent } from '../types'
import { DataTableUtility } from '../utils/table.util'

type TableBodyProps = {
	table: TTable<any>
	virtualizer: Virtualizer<HTMLDivElement, Element>
	renderSubComponent: RenderSubComponent
}

export const TableBody: React.FC<TableBodyProps> = ({ table, virtualizer, renderSubComponent }) => {
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
		<Body>
			{before > 0 && (
				<Row>
					<Cell colSpan={table.getAllColumns().length} style={{ height: before }} />
				</Row>
			)}
			{Array.isArray(virtualItems) &&
				virtualItems.map((virtualRow) => {
					const row = rows[virtualRow.index] as TRow<any>
					return (
						<Fragment key={row?.id}>
							<Row data-index={virtualRow.index} className='group'>
								{row?.getVisibleCells()?.map((cell) => (
									<Cell
										key={cell.id}
										data-sticky={cell.column.columnDef?.meta?.sticky}
										aria-selected={row.getIsSelected()}
										className='py-1'
										style={{
											width: `calc(var(--col-${cell.column.id}-size) * 1px)`,
											height: virtualRow.size,
											...DataTableUtility.getStickyOffsetPosition(cell.column)
										}}>
										<Div className='line-clamp-1'>
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
										</Div>
									</Cell>
								))}
							</Row>

							{row?.getIsExpanded() && (
								<Row data-index={virtualRow.index}>
									<Cell colSpan={row.getVisibleCells().length} className='sticky left-0'>
										{typeof renderSubComponent === 'function' && renderSubComponent({ table, row })}
									</Cell>
								</Row>
							)}
						</Fragment>
					)
				})}
			{after > 0 && (
				<Row ref={(node) => virtualizer.measureElement(node)}>
					<Cell colSpan={table.getAllColumns().length} style={{ height: after }} />
				</Row>
			)}
		</Body>
	)
}

export const MemorizedTableBody = memo(TableBody, (prev, next) => prev.table.options.data === next.table.options.data)
