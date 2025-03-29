import { IOutboundReport } from '@/common/types/entities'
import { cn } from '@/common/utils/cn'
import { Div, TableCell, TableRow } from '@/components/ui'
import { sortBy } from 'lodash'
import { useMemo } from 'react'

export const ReportDetailRow: React.FC<{ data: IOutboundReport['detail'][number] }> = ({ data }) => {
	const aggregateSizeCount = useMemo(
		() =>
			Array.isArray(data?.sizes)
				? data.sizes.reduce((acc, curr) => {
						return acc + curr.qty
					}, 0)
				: 0,
		[data]
	)

	return (
		<TableRow>
			<TableCell className='group/cell sticky left-0 z-10 w-[var(--sticky-left-col-width)] min-w-[var(--sticky-left-col-width)] space-y-1 text-center'>
				<Div className='flex items-center gap-x-2'>{data?.mo_no}</Div>
			</TableCell>
			<TableCell className={cn('!p-0')}>
				<Div
					className='flex flex-grow border-collapse flex-nowrap divide-x'
					onContextMenu={(e) => e.preventDefault()}>
					{Array(data?.sizes) &&
						sortBy(data.sizes, 'size_numcode').map((size) => (
							<Div
								key={size?.size_numcode}
								className='group/cell inline-grid min-w-28 shrink-0 basis-28 grid-rows-2 divide-y last:flex-1'>
								<TableCell className='bg-table-head font-medium'>
									<Div className='flex items-center gap-x-2'>{size?.size_numcode}</Div>
								</TableCell>
								<TableCell>{size?.qty ?? 0}</TableCell>
							</Div>
						))}
				</Div>
			</TableCell>
			<TableCell align='right' className='sticky right-0 w-24 min-w-24 font-medium'>
				{aggregateSizeCount}
			</TableCell>
		</TableRow>
	)
}
