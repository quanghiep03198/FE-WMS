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
						data-sticky={column?.columnDef.meta?.sticky}
						className='py-1'
						style={{
							width: column.getSize(),
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
