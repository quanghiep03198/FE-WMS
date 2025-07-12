import useVirutalScrollOffset from '@/common/hooks/use-virtual-scroll-offset'
import { TableBody, TableCell, TableRow } from '@/components/ui'
import { Row } from '@tanstack/react-table'
import { Virtualizer } from '@tanstack/react-virtual'
import { Fragment, memo } from 'react'
import { TableRowData } from '.'
import DataTableEmptyState from './data-table-empty-state'
import { DataTableRow, MemoizedDataTableRow } from './data-table-row'

type DataTableBodyProps<T> = {
	virtualizer: Virtualizer<any, any>
	rows: Row<T>[]
	columnCount: number
	isSomeRowsExpanded: boolean
}

const DataTableBody = function <T extends TableRowData>({
	virtualizer,
	rows,
	columnCount,
	isSomeRowsExpanded
}: DataTableBodyProps<T>) {
	'use no memo'

	const { before, after } = useVirutalScrollOffset(virtualizer)
	const virtualItems = virtualizer.getVirtualItems()

	return (
		<TableBody className='[&_tr:last-child_td]:!border-b-0 [&_tr>td]:border-b'>
			{virtualItems.length > 0 ? (
				<Fragment>
					{before > 0 && (
						<TableRow ref={(node) => virtualizer.measureElement(node)}>
							<TableCell colSpan={columnCount} style={{ height: before }} />
						</TableRow>
					)}
					{virtualItems.map((virtualItem) => {
						return virtualizer.isScrolling && !isSomeRowsExpanded ? (
							<MemoizedDataTableRow
								key={virtualItem.key}
								size={virtualItem.size}
								row={rows[virtualItem.index]}
							/>
						) : (
							<DataTableRow
								key={virtualItem.key}
								size={virtualItem.size}
								row={rows[virtualItem.index]}
								data-index={virtualItem.index * 2 + 1}
							/>
						)
					})}
					{after > 0 && (
						<TableRow ref={(node) => virtualizer.measureElement(node)}>
							<TableCell colSpan={columnCount} style={{ height: after }} />
						</TableRow>
					)}
				</Fragment>
			) : (
				<DataTableEmptyState colSpan={columnCount} />
			)}
		</TableBody>
	)
}

const MemoizedDataTableBody = memo(DataTableBody)

DataTableBody.displayName = 'DataTableBody'

export { DataTableBody, MemoizedDataTableBody }
