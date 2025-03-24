import { Table } from '@tanstack/react-table'
import { TableCell, TableRow } from '../..'
import Skeleton from '../../@custom/skeleton'
import { DataTableUtility } from '../utils/table.util'

type DataTableLoading<TData> = {
	table: Table<TData>
	prepareRows: number
}

export function TableBodyLoading<T>({ prepareRows, table }: DataTableLoading<T>) {
	const preRenderRows = Array.from(new Array(prepareRows), (_, index) => index)
	const preRenderColumns = table.getAllLeafColumns()

	return preRenderRows.map((rowIndex) => (
		<TableRow key={rowIndex}>
			{preRenderColumns.map((column, columnIndex) => {
				return (
					<TableCell
						key={`${rowIndex}-${columnIndex}`}
						style={{
							...DataTableUtility.getStickyOffsetPosition(column),
							width: `calc(var(--col-${column?.id}-size) * 1px)`,
							height: 40
						}}>
						<Skeleton />
					</TableCell>
				)
			})}
		</TableRow>
	))
}
