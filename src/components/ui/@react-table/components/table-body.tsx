import useVirutalScrollOffset from '@/common/hooks/use-virtual-scroll-offset'
import { RowData, Table, type Row as TRow } from '@tanstack/react-table'
import { Virtualizer } from '@tanstack/react-virtual'
import { Fragment, memo } from 'react'
import { TableBody as TableRowGroup } from '../../@core/table'
import { ROW_EXPANSION_COLUMN_ID, ROW_SELECTION_COLUMN_ID } from '../constants'
import { useTableContext } from '../context/table.context'
import { RenderSubComponent } from '../types'
import { MemoizedVirtualTableRow, VirtualPlaceholderRow, VirtualTableRow } from './table-row'

type TableBodyProps = {
	virtualizer: Virtualizer<HTMLDivElement, Element>
	table?: Table<RowData>
	renderSubComponent: RenderSubComponent<any>
}

const TableBody: React.FC<TableBodyProps> = ({ virtualizer, renderSubComponent }) => {
	'use no memo'

	const { table } = useTableContext('table')
	const { before, after } = useVirutalScrollOffset(virtualizer)
	const virtualItems = virtualizer.getVirtualItems()

	const { rows } = table.getRowModel()
	const {
		columnSizingInfo: { isResizingColumn },
		columnPinning
	} = table.getState()
	const isSomeRowsExpanded = table.getIsSomeRowsExpanded()
	const colSpan = table.getAllColumns().length
	const hasNoColumnPinnedLeft = !columnPinning.left.some((columnId) => {
		return columnId !== ROW_EXPANSION_COLUMN_ID && columnId !== ROW_SELECTION_COLUMN_ID
	})
	const shouldSkipRerender =
		(isResizingColumn && hasNoColumnPinnedLeft) || (virtualizer.isScrolling && !isSomeRowsExpanded)

	return (
		<TableRowGroup>
			<Fragment>
				{before > 0 && <VirtualPlaceholderRow colSpan={colSpan} style={{ height: before }} />}
				{Array.isArray(virtualItems) &&
					virtualItems.map((virtualRow) => {
						const row = rows[virtualRow.index] as TRow<any>
						return shouldSkipRerender ? (
							<MemoizedVirtualTableRow
								key={row.id}
								row={row}
								size={virtualRow.size}
								renderSubComponent={renderSubComponent}
							/>
						) : (
							<VirtualTableRow
								key={row.id}
								row={row}
								size={virtualRow.size}
								renderSubComponent={renderSubComponent}
							/>
						)
					})}
				{after > 0 && <VirtualPlaceholderRow colSpan={colSpan} style={{ height: after }} />}
			</Fragment>
		</TableRowGroup>
	)
}

const MemoizedTableBody = memo(TableBody) as typeof TableBody

export { MemoizedTableBody, TableBody, type TableBodyProps }
