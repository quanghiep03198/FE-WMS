import { TableBody, TableCell, TableRow } from '@/components/ui'
import Skeleton from '@/components/ui/@custom/skeleton'
import { IDefectiveGoods } from '@/services/defective-goods.service'
import { ColumnDef } from '@tanstack/react-table'
import React from 'react'

const DataTableLoading: React.FC<{ columns: ColumnDef<IDefectiveGoods>[] }> = ({ columns }) => {
	return (
		<TableBody>
			{Array.from({ length: 10 }).map((_, rowId) => {
				return (
					<TableRow key={String(rowId)}>
						{columns.map((column) => {
							return (
								<TableCell key={`${rowId}.${String(column.id)}`} style={{ width: column.size }}>
									<Skeleton />
								</TableCell>
							)
						})}
					</TableRow>
				)
			})}
		</TableBody>
	)
}

export default DataTableLoading
