import { TableBody } from '@/components/ui'
import { VirtualPlaceholderRow } from '@/components/ui/@react-table/components/table-row'
import useVirtualScrollPadding from '@hooks/use-virtual-scroll-padding'
import type { Row } from '@tanstack/react-table'
import type { Virtualizer } from '@tanstack/react-virtual'
import { Fragment, memo } from 'react'
import type { TableRowData } from '.'
import DataTableEmptyState from './data-table-empty-state'
import { DataTableRow, MemoizedDataTableRow } from './data-table-row'

type DataTableBodyProps = {
	virtualizer: Virtualizer<any, any>
	rows: Row<TableRowData>[]
	columnCount: number
	isSomeRowsExpanded: boolean
}

const DataTableBody: React.FC<DataTableBodyProps> = ({ virtualizer, rows, columnCount, isSomeRowsExpanded }) => {
	'use no memo'

	const virtualItems = virtualizer.getVirtualItems()
	const { before, after } = useVirtualScrollPadding(virtualizer)

	return (
		<TableBody className='[&_tr:last-child_td]:border-b-0! [&_tr>td]:border-b'>
			{virtualItems?.length > 0 ? (
				<Fragment>
					{before > 0 && <VirtualPlaceholderRow colSpan={columnCount} style={{ height: before }} />}
					{virtualItems.map((virtualItem) => {
						return virtualizer.isScrolling && !isSomeRowsExpanded ? (
							<MemoizedDataTableRow
								key={virtualItem.key}
								row={rows[virtualItem.index]}
								size={virtualItem.size}
							/>
						) : (
							<DataTableRow key={virtualItem.key} size={virtualItem.size} row={rows[virtualItem.index]} />
						)
					})}
					{after > 0 && <VirtualPlaceholderRow colSpan={columnCount} style={{ height: after }} />}
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
