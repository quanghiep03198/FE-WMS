import useScrollToFn from '@/common/hooks/use-scroll-fn'
import useVirtualScrollPadding from '@/common/hooks/use-virtual-scroll-padding'
import env from '@/common/utils/env'
import { RowData, Table, type Row as TRow } from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useMemoizedFn } from 'ahooks'
import { Activity, memo, useCallback } from 'react'
import { TableBody as TableRowGroup } from '../../@core/table'
import { useTableContext } from '../context/table.context'
import { RenderSubComponent } from '../types'
import { MemoizedVirtualTableRow, VirtualPlaceholderRow } from './table-row'

export type TableBodyProps<TData extends RowData> = {
	table: Table<TData>
	containerRef: React.RefObject<HTMLDivElement>
	estimatedRowHeight: number
	renderSubComponent: RenderSubComponent<any>
}

function DataTableBody<TData>({ containerRef, estimatedRowHeight, renderSubComponent }: TableBodyProps<TData>) {
	'use no memo'

	const { table } = useTableContext('table')
	const { rows } = table.getRowModel()
	const scrollToFn = useScrollToFn(containerRef)
	const estimateSize = useCallback(() => estimatedRowHeight, [estimatedRowHeight])
	const getScrollElement = () => containerRef.current
	const getItemKey = useCallback((index) => table.getRowModel().rows[index]?.id, [table.options.data])

	const virtualizer = useVirtualizer<HTMLDivElement, HTMLTableRowElement>({
		count: rows.length,
		overscan: table.getIsSomeRowsExpanded() ? table.getExpandedRowModel().rows.length : 5,
		horizontal: false,
		getItemKey,
		getScrollElement,
		estimateSize,
		scrollToFn,
		debug: env<RuntimeEnvironment>('VITE_NODE_ENV') === 'development'
	})
	const virtualRowIndexes = virtualizer.getVirtualIndexes()

	const { before, after } = useVirtualScrollPadding<HTMLDivElement, HTMLTableRowElement>(virtualizer)
	const virtualItems = virtualizer.getVirtualItems()
	const colSpan = table.getAllColumns().length

	const scrollToIndex = useMemoizedFn((index: number) =>
		virtualizer.scrollToIndex(index, { align: 'start', behavior: 'auto' })
	)

	return (
		<TableRowGroup style={{ height: virtualizer.getTotalSize() }}>
			<Activity mode={before > 0 ? 'visible' : 'hidden'}>
				<VirtualPlaceholderRow colSpan={colSpan} style={{ height: before }} />
			</Activity>
			{Array.isArray(virtualItems) &&
				virtualRowIndexes.map((index) => {
					const row = rows[index] as TRow<any>
					return (
						<MemoizedVirtualTableRow
							key={row.id}
							row={row}
							index={index}
							isScrolling={virtualizer.isScrolling}
							scrollToIndex={scrollToIndex}
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

export default memo(
	DataTableBody,
	(_prevProps, nextProps) => nextProps.table.getState()?.columnSizingInfo?.isResizingColumn !== false
) as typeof DataTableBody
