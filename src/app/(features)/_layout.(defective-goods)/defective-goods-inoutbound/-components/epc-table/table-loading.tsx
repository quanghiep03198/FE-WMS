import { PresetBreakPoints } from '@/common/constants/enums'
import useMediaQuery from '@/common/hooks/use-media-query'
import { TableBody, TableCell, TableRow } from '@/components/ui'
import Skeleton from '@/components/ui/@custom/skeleton'
import type { IDefectiveGoods } from '@/services/defective-goods.service'
import type { ColumnDef } from '@tanstack/react-table'
import React from 'react'

const DataTableLoading: React.FC<{ columns: ColumnDef<IDefectiveGoods>[] }> = ({ columns }) => {
	const isLargeScreen = useMediaQuery(PresetBreakPoints.EXTRA_LARGE)

	return (
		<TableBody className='min-h-[calc(var(--outlet-wrapper-height)-var(--header-height)-var(--row-height)*3)]'>
			{Array.from({ length: isLargeScreen ? 15 : 10 }).map((_, rowId) => {
				return (
					<TableRow key={String(rowId)} className='h-[var(--row-height)]'>
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
