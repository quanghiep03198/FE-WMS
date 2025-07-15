import { type Row as TRow } from '@tanstack/react-table'
import { Virtualizer } from '@tanstack/react-virtual'
import { memo } from 'react'
import { TableBody as TableRowGroup } from '../../@core/table'
import { useTableContext } from '../context/table.context'
import { RenderSubComponent } from '../types'
import TableBodyVirtualViewport from './table-body-virtual-viewport'
import { MemoizedVirtualTableRow, VirtualTableRow } from './table-row'

type TableBodyProps = {
	virtualizer: Virtualizer<HTMLDivElement, Element>
	renderSubComponent: RenderSubComponent<any>
}

const TableBody: React.FC<TableBodyProps> = ({ virtualizer, renderSubComponent }) => {
	'use no memo'

	const { table } = useTableContext()
	const { rows } = table.getRowModel()
	const virtualItems = virtualizer.getVirtualItems()

	const isSomeRowsExpanded = table.getIsSomeRowsExpanded()

	return (
		<TableRowGroup>
			<TableBodyVirtualViewport virtualizer={virtualizer} columnCount={table.getAllColumns().length}>
				{Array.isArray(virtualItems) &&
					virtualItems.map((virtualRow) => {
						const row = rows[virtualRow.index] as TRow<any>

						return virtualizer.isScrolling && !isSomeRowsExpanded ? (
							<MemoizedVirtualTableRow
								data-index={virtualRow.index}
								key={row.id}
								row={row}
								virtualRow={virtualRow}
								renderSubComponent={renderSubComponent}
							/>
						) : (
							<VirtualTableRow
								data-index={virtualRow.index}
								key={row.id}
								row={row}
								virtualRow={virtualRow}
								renderSubComponent={renderSubComponent}
							/>
						)
					})}
			</TableBodyVirtualViewport>
		</TableRowGroup>
	)
}

const MemoizedTableBody = memo(TableBody)

export { MemoizedTableBody, TableBody, type TableBodyProps }
