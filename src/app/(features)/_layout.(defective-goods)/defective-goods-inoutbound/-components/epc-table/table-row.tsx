import { TableCell, TableRow } from '@/components/ui'
import { IDefectiveGoods } from '@/services/defective-goods.service'
import { flexRender, Row } from '@tanstack/react-table'
import { VirtualItem } from '@tanstack/react-virtual'
import React, { memo } from 'react'

export const DataTableRow: React.FC<{
	row: Row<IDefectiveGoods>
	virtualRow: VirtualItem
}> = ({ row, virtualRow }) => {
	'use no memo'

	return (
		<TableRow key={row.id} style={{ width: '100%', height: virtualRow.size }} className='group'>
			{row.getVisibleCells().map((cell) => {
				const { columnDef } = cell.column
				return (
					<TableCell
						key={cell.id}
						className='dark:bg-table-head'
						style={{ width: cell.column.getSize() }}
						align={columnDef.meta?.align}>
						<span className='line-clamp-1'>{flexRender(columnDef.cell, cell.getContext())}</span>
					</TableCell>
				)
			})}
		</TableRow>
	)
}

export const MemoizedDataTableRow = memo(DataTableRow)
