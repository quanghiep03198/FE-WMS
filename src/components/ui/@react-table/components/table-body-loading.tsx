import { Table } from '@tanstack/react-table'
import { TableCell, TableRow } from '../..'
import Skeleton from '../../@custom/skeleton'
import { DataTableUtility } from '../utils/table.util'
import { ESTIMATE_SIZE } from './table'

type DataTableLoading<TData> = {
	table: Table<TData>
	prepareRows: number
}

export function TableBodyLoading<T>({ prepareRows, table }: DataTableLoading<T>) {
	const preRenderRows = Array.apply(null, Array(prepareRows)).map((_, index) => index)
	const preRenderColumns = table.getAllLeafColumns()

	return preRenderRows.map((rowIndex) => (
		<TableRow key={rowIndex}>
			{preRenderColumns.map((column, columnIndex) => {
				return (
					<TableCell
						key={`${rowIndex}-${columnIndex}`}
						data-sticky={column.getIsPinned()}
						className='py-1 data-[sticky=left]:!sticky data-[sticky=right]:!sticky data-[sticky=left]:z-10'
						style={{
							width: `calc(var(--col-${column?.id}-size) * 1px)`,
							height: ESTIMATE_SIZE,
							...DataTableUtility.getStickyOffsetPosition(column)
						}}>
						<Skeleton />
					</TableCell>
				)
			})}
		</TableRow>
	))
}
