import { cn } from '@/common/utils/cn'
import { Collapsible, CollapsibleContent, TableHead, TableHeader, TableRow } from '@/components/ui'
import { RowData, type HeaderGroup } from '@tanstack/react-table'
import { useUpdate } from 'ahooks'
import { Fragment, memo } from 'react'
import { useTableContext } from '../context/table.context'
import { columnSizingHandler, getStickyOffsetPosition } from '../utils'
import ColumnResizer from './column-resizer'
import TableCellHead from './table-cell-head'
import { TableColumnFilter } from './table-column-filter'

const DataTableHeader: React.FC = () => {
	// 'use no memo'

	const rerender = useUpdate()

	const { table, event$ } = useTableContext('table', 'event$')

	event$.useSubscription((value) => {
		if (value.columnPinning) {
			console.log('value.columnPinning', value.columnPinning)
			rerender()
		}
	})

	return (
		<TableHeader className='sticky top-0 z-20 bg-background'>
			{table.getHeaderGroups().map((headerGroup) => {
				return (
					<Fragment key={headerGroup.id}>
						<TableHeaderRow headerGroup={headerGroup} />
						<TableHeaderFilterRow headerGroup={headerGroup} />
					</Fragment>
				)
			})}
		</TableHeader>
	)
}

DataTableHeader.displayName = 'DataTableHeader'

const TableHeaderRow: React.FC<{ headerGroup: HeaderGroup<RowData> }> = ({ headerGroup }) => {
	// 'use no memo'

	const { table } = useTableContext('table')

	return (
		<TableRow data-role='data-grid-row' className='divide-x [&_th]:border-x-0'>
			{headerGroup.headers.map((header) => {
				const rowSpan = header.column.columnDef.meta?.rowSpan
				if (!header.isPlaceholder && rowSpan !== undefined && header.id === header.column.id) {
					return null
				}

				return (
					<TableHead
						data-role='data-grid-head'
						key={header.id}
						colSpan={header.colSpan}
						rowSpan={rowSpan}
						className={cn('group relative z-50 border-x-0 bg-table-head p-0')}
						align={header.column.columnDef.meta?.align}
						ref={(node) => columnSizingHandler(node, table, header.column)}
						style={{
							height: 'var(--header-row-height)',
							width: `calc(var(--header-${header?.id}-size) * 1px)`,
							...getStickyOffsetPosition(header?.column)
						}}>
						<TableCellHead header={header} />
						{table?.options?.enableColumnResizing && <ColumnResizer header={header} />}
					</TableHead>
				)
			})}
		</TableRow>
	)
}

TableHeaderRow.displayName = 'TableHeaderRow'

const TableHeaderFilterRow: React.FC<{ headerGroup: HeaderGroup<RowData> }> = ({ headerGroup }) => {
	// 'use no memo'

	const { filterOpen } = useTableContext('filterOpen')

	return (
		<TableRow>
			{headerGroup.headers.map((header) => {
				if (header.column.columns.length === 0)
					return (
						<TableHead
							key={header.id}
							colSpan={header.colSpan}
							data-role='data-grid-row'
							className={cn('group relative z-40 p-0', filterOpen ? 'border-border' : 'border-transparent')}
							rowSpan={header.column.getIsPinned() ? headerGroup.headers.length : 1}
							style={{
								width: `calc(var(--header-${header?.id}-size) * 1px)`,
								maxHeight: 'var(--header-row-height)',
								...getStickyOffsetPosition(header?.column)
							}}>
							<Collapsible open={filterOpen} data-state={filterOpen ? 'open' : 'closed'}>
								<CollapsibleContent className='h-[var(--header-row-height)] overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down'>
									<TableColumnFilter column={header.column} />
								</CollapsibleContent>
							</Collapsible>
						</TableHead>
					)
			})}
		</TableRow>
	)
}

TableHeaderFilterRow.displayName = 'TableHeaderFilterRow'

const MemoizedDataTableHeader = memo(DataTableHeader) as typeof DataTableHeader

export { DataTableHeader, MemoizedDataTableHeader }
