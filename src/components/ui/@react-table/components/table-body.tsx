import useVirutalScrollOffset from '@/common/hooks/use-virtual-scroll-offset'
import { type Row as TRow } from '@tanstack/react-table'
import { Virtualizer } from '@tanstack/react-virtual'
import { useMemoizedFn } from 'ahooks'
import { Activity, memo } from 'react'
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

	const { table } = useTableContext('table')
	const { before, after } = useVirutalScrollOffset(virtualizer)
	const virtualItems = virtualizer.getVirtualItems()
	const colSpan = table.getAllColumns().length
	const { rows } = table.getRowModel()
	const shouldSkipRerender = virtualizer.isScrolling

	const scrollToIndex = useMemoizedFn((index: number) =>
		virtualizer.scrollToIndex(index, { align: 'start', behavior: 'auto' })
	)

	const measureElement = useMemoizedFn(virtualizer.measureElement)

	return (
		<TableRowGroup>
			<Activity mode={before > 0 ? 'visible' : 'hidden'}>
				<VirtualPlaceholderRow colSpan={colSpan} style={{ height: before }} />
			</Activity>
			{Array.isArray(virtualItems) &&
				virtualItems.map((virtualRow) => {
					const row = rows[virtualRow.index] as TRow<any>
					return shouldSkipRerender ? (
						<MemoizedVirtualTableRow
							key={row.id}
							row={row}
							index={virtualRow.index}
							size={virtualRow.size}
							scrollToIndex={scrollToIndex}
							measureElement={measureElement}
							renderSubComponent={renderSubComponent}
						/>
					) : (
						<VirtualTableRow
							key={row.id}
							row={row}
							index={virtualRow.index}
							size={virtualRow.size}
							scrollToIndex={scrollToIndex}
							measureElement={measureElement}
							renderSubComponent={renderSubComponent}
						/>
					)
				})}
			<Activity mode={after > 0 ? 'visible' : 'hidden'}>
				<VirtualPlaceholderRow colSpan={colSpan} style={{ height: after }} />
			</Activity>
		</TableRowGroup>
	)
}

const MemoizedTableBody = memo(TableBody) as typeof TableBody

export { MemoizedTableBody, TableBody, type TableBodyProps }
