import { Table } from '@tanstack/react-table'
import { TableCell, TableRow } from '../..'
import { cn } from '@/common/utils/cn'
import Skeleton from '../../@custom/skeleton'
import { ESTIMATE_SIZE } from './table'

type DataTableLoading<TData> = {
	table: Table<TData>
	prepareRows: number
}

export function TableBodyLoading<T = unknown>({ prepareRows, table }: DataTableLoading<T>) {
	const preRenderRows = Array.apply(null, Array(prepareRows)).map((_, index) => index)
	const preRenderColumns = table.getAllColumns()

	return preRenderRows.map((row) => (
		<TableRow key={row}>
			{preRenderColumns.map((column) => {
				const isStickyLeft = column?.columnDef.meta?.sticky === 'left'
				const isStickyRight = column?.columnDef.meta?.sticky === 'right'
				const key = crypto.randomUUID()
				return (
					<TableCell
						key={key}
						style={{ width: column.getSize(), height: ESTIMATE_SIZE }}
						className={cn({
							'sticky left-0 z-10': isStickyLeft,
							'sticky right-0 z-10': isStickyRight
						})}>
						<Skeleton />
					</TableCell>
				)
			})}
		</TableRow>
	))
}
