import { cn } from '@/common/utils/cn'
import { type Header, type HeaderGroup, type Table } from '@tanstack/react-table'
import { useUpdate } from 'ahooks'
import { Fragment, memo } from 'react'
import { TableHead, TableHeader, TableRow } from '../../@core/table'
import { DEFAULT_ESTIMATE_SIZE } from '../constants'
import { useTableContext } from '../context/table.context'
import { DataTableUtility } from '../utils'
import CollapsibleFilterCell from './collapsible-filter-cell'
import ColumnResizer from './column-resizer'
import TableCellHead from './table-cell-head'

const DataTableHeader: React.FC = () => {
	const { table, event$ } = useTableContext()
	const rerender = useUpdate()

	event$.useSubscription((value) => {
		if (value.columnPinning && Array.isArray(value.columnPinning.left) && Array.isArray(value.columnPinning.right))
			rerender()
	})

	return (
		<TableHeader className='sticky top-0 z-20 bg-background'>
			{table.getHeaderGroups().map((headerGroup) => {
				return (
					<Fragment key={headerGroup.id}>
						<TableHeaderRow table={table} headerGroup={headerGroup} />
						<TableHeaderFilterRow headerGroup={headerGroup} />
					</Fragment>
				)
			})}
		</TableHeader>
	)
}

const TableHeaderRow: React.FC<{ table: Table<any>; headerGroup: HeaderGroup<any> }> = ({ headerGroup }) => {
	return (
		<TableRow>
			{headerGroup.headers.map((header) => {
				const rowSpan = header.column.columnDef.meta?.rowSpan
				if (!header.isPlaceholder && rowSpan !== undefined && header.id === header.column.id) {
					return null
				}

				return <DataTableHead key={header.id} header={header} rowSpan={rowSpan} />
			})}
		</TableRow>
	)
}

TableHeaderRow.displayName = 'TableHeaderRow'

const DataTableHead: React.FC<{ header: Header<any, any>; rowSpan: number }> = ({ header, rowSpan }) => {
	'use no memo'

	return (
		<TableHead
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
}

DataTableHead.displayName = 'DataTableHead'

const TableHeaderFilterRow: React.FC<{ headerGroup: HeaderGroup<any> }> = ({ headerGroup }) => {
	return (
		headerGroup.headers.every((header) => header.colSpan === 1) && (
			<TableRow>
				{headerGroup.headers.map((header) => {
					return <CollapsibleFilterCell key={header.id} header={header} />
				})}
			</TableRow>
		)
	)
}

TableHeaderFilterRow.displayName = 'TableHeaderFilterRow'

export default memo(DataTableHeader)
