import { cn } from '@/common/utils/cn'
import { HeaderGroup, Table } from '@tanstack/react-table'
import { Fragment } from 'react'
import { TableHead, TableHeader, TableRow } from '../../@core/table'
import { DEFAULT_ESTIMATE_SIZE } from '../constants'
import { DataTableUtility } from '../utils/table.util'
import CollapsibleFilterCell from './collapsible-filter-cell'
import ColumnResizer from './column-resizer'
import { TableCellHead } from './table-cell-head'

type DataTableHeaderProps = { table: Table<any> }

const DataTableHeader: React.FC<DataTableHeaderProps> = ({ table }) => {
	'use no memo'

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

const TableHeaderRow: React.FC<{ table: Table<any>; headerGroup: HeaderGroup<any> }> = ({ table, headerGroup }) => {
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
						<TableCellHead table={table} header={header} />
						<ColumnResizer header={header} />
					</TableHead>
				)
			})}
		</TableRow>
	)
}

const TableHeaderFilterRow: React.FC<{ headerGroup: HeaderGroup<any> }> = ({ headerGroup }) => {
	'use no memo'

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

export { DataTableHeader }
