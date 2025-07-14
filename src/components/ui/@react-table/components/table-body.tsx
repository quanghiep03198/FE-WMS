import useVirutalScrollOffset from '@/common/hooks/use-virtual-scroll-offset'
import { type Row as TRow } from '@tanstack/react-table'
import { Virtualizer } from '@tanstack/react-virtual'
import { memo } from 'react'
import { TableBody as TableRowGroup } from '../../@core/table'
import { useTableContext } from '../context/table.context'
import { RenderSubComponent } from '../types'
import { MemoizedVirtualTableRow, VirtualPlaceholderRow, VirtualTableRow } from './table-row'

type TableBodyProps = {
	virtualizer: Virtualizer<HTMLDivElement, Element>
	renderSubComponent: RenderSubComponent<any>
}

const TableBody: React.FC<TableBodyProps> = ({ virtualizer, renderSubComponent }) => {
	'use no memo'

	const { table } = useTableContext()
	const { rows } = table.getRowModel()
	const virtualItems = virtualizer.getVirtualItems()

	const { before, after } = useVirutalScrollOffset(virtualizer)

	const isSomeRowsExpanded = table.getIsSomeRowsExpanded()

	return (
		<TableRowGroup>
			{before > 0 && (
				<VirtualPlaceholderRow
					measureElement={virtualizer.measureElement}
					colSpan={table.getAllColumns().length}
					style={{ height: before }}
				/>
			)}
			{Array.isArray(virtualItems) &&
				virtualItems.map((virtualRow) => {
					const row = rows[virtualRow.index] as TRow<any>

					return virtualizer.isScrolling && !isSomeRowsExpanded ? (
						<MemoizedVirtualTableRow
							key={row.id}
							row={row}
							virtualRow={virtualRow}
							renderSubComponent={renderSubComponent}
						/>
					) : (
						<VirtualTableRow
							key={row.id}
							row={row}
							virtualRow={virtualRow}
							renderSubComponent={renderSubComponent}
						/>
					)
				})}
			{after > 0 && (
				<VirtualPlaceholderRow
					measureElement={virtualizer.measureElement}
					colSpan={table.getAllColumns().length}
					style={{ height: after }}
				/>
			)}
		</TableRowGroup>
	)
}

const MemoizedTableBody = memo(TableBody)

export { MemoizedTableBody, TableBody, type TableBodyProps }
