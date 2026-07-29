import { TableCell, TableRow } from '@components/ui'
import type { IDefectiveGoods } from '@features/defective-goods/types'
import type { Row } from '@tanstack/react-table'
import { flexRender } from '@tanstack/react-table'
import type { VirtualItem } from '@tanstack/react-virtual'
import React, { memo } from 'react'

export const DataTableRow: React.FC<{
	row: Row<IDefectiveGoods>
	virtualRow: VirtualItem
}> = ({ row, virtualRow }) => {
	'use no memo'

	return (
		<TableRow style={{ width: '100%', height: virtualRow.size }} className='group'>
			{row.getVisibleCells().map((cell) => {
				const { columnDef } = cell.column
				return (
					<TableCell
						key={cell.id}
						style={{ width: `var(--column-${cell.column.id}-size)` }}
						align={columnDef.meta?.align ?? 'left'}>
						<span className='line-clamp-1 text-ellipsis'>{flexRender(columnDef.cell, cell.getContext())}</span>
					</TableCell>
				)
			})}
		</TableRow>
	)
}

export const MemoizedDataTableRow = memo(DataTableRow)
