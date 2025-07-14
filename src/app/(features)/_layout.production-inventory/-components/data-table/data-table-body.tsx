import useVirutalScrollOffset from '@/common/hooks/use-virtual-scroll-offset'
import { TableBody } from '@/components/ui'
import { VirtualPlaceholderRow } from '@/components/ui/@react-table/components/table-row'
import { Row } from '@tanstack/react-table'
import { Virtualizer } from '@tanstack/react-virtual'
import { Fragment, memo } from 'react'
import { TableRowData } from '.'
import DataTableEmptyState from './data-table-empty-state'
import { DataTableRow, MemoizedDataTableRow } from './data-table-row'

type DataTableBodyProps<T> = {
	// table: Table<T>
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
						<VirtualPlaceholderRow
							measureElement={virtualizer.measureElement}
							colSpan={columnCount}
							style={{ height: before }}
						/>
					)}
					{virtualItems.map((virtualItem) => {
						return virtualizer.isScrolling && !isSomeRowsExpanded ? (
							<MemoizedDataTableRow
								key={virtualItem.key}
								index={virtualItem.index}
								row={rows[virtualItem.index]}
								size={virtualItem.size}
								measureElement={virtualizer.measureElement}
							/>
						) : (
							<DataTableRow
								key={virtualItem.key}
								index={virtualItem.index}
								size={virtualItem.size}
								row={rows[virtualItem.index]}
								measureElement={virtualizer.measureElement}
							/>
						)
					})}
					{after > 0 && (
						<VirtualPlaceholderRow
							measureElement={virtualizer.measureElement}
							colSpan={columnCount}
							style={{ height: after }}
						/>
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
