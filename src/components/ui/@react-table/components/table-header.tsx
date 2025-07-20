import { cn } from '@/common/utils/cn'
import { Collapsible, CollapsibleContent, TableHead, TableHeader, TableRow } from '@/components/ui'
import { ColumnPinningState, type HeaderGroup } from '@tanstack/react-table'
import { useUpdate } from 'ahooks'
import { Fragment, memo } from 'react'
import { DEFAULT_ESTIMATE_SIZE } from '../constants'
import { useTableContext } from '../context/table.context'
import { DataTableUtility } from '../utils'
import { ColumnFilter } from './column-filter'
import ColumnResizer from './column-resizer'
import TableCellHead from './table-cell-head'

const DataTableHeader: React.FC = () => {
	const { table, event$ } = useTableContext('table', 'event$')
	const rerender = useUpdate()

	event$.useSubscription((value: { columnPinning?: ColumnPinningState }) => {
		if (value.columnPinning && Array.isArray(value.columnPinning.left) && Array.isArray(value.columnPinning.right))
			rerender()
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

const TableHeaderRow: React.FC<{ headerGroup: HeaderGroup<any> }> = ({ headerGroup }) => {
	'use no memo'

	return (
		<TableRow>
			{headerGroup.headers.map((header) => {
				const rowSpan = header.column.columnDef.meta?.rowSpan
				if (!header.isPlaceholder && rowSpan !== undefined && header.id === header.column.id) {
					return null
				}

				return (
					<TableHead
						key={header.id}
						colSpan={header.colSpan}
						rowSpan={rowSpan}
						className={cn('group relative z-40 bg-table-head p-0')}
						align={header.column.columnDef.meta?.align}
						style={{
							height: `${DEFAULT_ESTIMATE_SIZE}px`,
							width: `calc(var(--header-${header?.id}-size) * 1px)`,
							...DataTableUtility.getStickyOffsetPosition(header?.column)
						}}>
						<TableCellHead header={header} />
						<ColumnResizer header={header} />
					</TableHead>
				)
			})}
		</TableRow>
	)
}

TableHeaderRow.displayName = 'TableHeaderRow'

const TableHeaderFilterRow: React.FC<{ headerGroup: HeaderGroup<any> }> = ({ headerGroup }) => {
	'use no memo'

	const { filterOpen } = useTableContext('filterOpen')

	return (
		headerGroup.headers.every((header) => header.colSpan === 1) && (
			<TableRow>
				{headerGroup.headers.map((header) => {
					return (
						<TableHead
							key={header.id}
							colSpan={header.colSpan}
							className={cn('group relative z-40 p-0', filterOpen ? 'border-b border-border' : 'border-none')}
							style={{
								width: `calc(var(--header-${header?.id}-size) * 1px)`,
								...DataTableUtility.getStickyOffsetPosition(header?.column)
							}}>
							<Collapsible
								defaultOpen={filterOpen}
								open={filterOpen}
								data-state={filterOpen ? 'open' : 'closed'}>
								<CollapsibleContent className='h-10 overflow-hidden transition-all data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down'>
									<ColumnFilter column={header.column} />
								</CollapsibleContent>
							</Collapsible>
						</TableHead>
					)
				})}
			</TableRow>
		)
	)
}

TableHeaderFilterRow.displayName = 'TableHeaderFilterRow'

const MemoizedDataTableHeader = memo(DataTableHeader) as typeof DataTableHeader

export { DataTableHeader, MemoizedDataTableHeader }
