import { PresetBreakPoints } from '@common/constants/enums'
import Skeleton from '@components/customs/skeleton'
import { TableBody, TableCell, TableRow } from '@components/ui/table'
import type { IDefectiveGoods } from '@features/defective-goods/types'
import useMediaQuery from '@hooks/use-media-query'
import type { ColumnDef } from '@tanstack/react-table'
import React from 'react'

const DataTableLoading: React.FC<{ columns: ColumnDef<IDefectiveGoods>[] }> = ({ columns }) => {
	const isLargeScreen = useMediaQuery(PresetBreakPoints.EXTRA_LARGE)

	return (
		<TableBody className='min-h-[calc(var(--outlet-wrapper-height)-var(--header-height)-var(--row-height)*3)]'>
			{Array.from({ length: isLargeScreen ? 15 : 10 }).map((_, rowId) => {
				return (
					<TableRow className='h-(--row-height)' key={String(rowId)}>
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
