import { TableCell, TableRow } from '@/components/ui'
import { IDefectiveGoods } from '@/services/defective-goods.service'
import { flexRender, Row } from '@tanstack/react-table'
import React, { memo } from 'react'

export const DataTableRow: React.FC<{
	row: Row<IDefectiveGoods>
}> = ({ row }) => {
	'use no memo'

	return (
		<TableRow key={row.id}>
			{row.getVisibleCells().map((cell) => {
				const { columnDef } = cell.column
				return (
					<TableCell key={cell.id} style={{ width: cell.column.getSize() }} align={columnDef.meta?.align}>
						<span className='line-clamp-1'>{flexRender(columnDef.cell, cell.getContext())}</span>
					</TableCell>
				)
			})}
		</TableRow>
	)
}

export const MemoizedDataTableRow = memo(DataTableRow)
