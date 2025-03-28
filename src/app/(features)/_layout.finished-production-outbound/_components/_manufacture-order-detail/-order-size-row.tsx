import { FALLBACK_ORDER_VALUE } from '@/app/(features)/_layout.finished-production-inbound/_apis/inbound-rfid.api'
import { type OrderItem } from '@/app/(features)/_types/rfid'
import { cn } from '@/common/utils/cn'
import { Div, TableCell, TableRow } from '@/components/ui'
import { sortBy } from 'lodash'
import { useMemo } from 'react'
import DeleteOrderPopover from './-delete-order-popover'
import DeleteSizePopover from './-delete-size-popover'

type OrderDetailTableRowProps = {
	data: OrderItem
}

const OrderDetailTableRow: React.FC<OrderDetailTableRowProps> = ({ data }) => {
	const aggregateSizeCount = useMemo(
		() =>
			Array.isArray(data?.sizes)
				? data.sizes.reduce((acc, curr) => {
						return acc + curr.count
					}, 0)
				: 0,
		[data]
	)

	return (
		<TableRow className={cn('transition-all duration-500')}>
			<TableCell className='group/cell sticky left-0 z-10 w-[var(--sticky-left-col-width)] min-w-[var(--sticky-left-col-width)] space-y-1 text-center'>
				<Div className='flex items-center gap-x-2'>{data?.mo_no ?? FALLBACK_ORDER_VALUE}</Div>
			</TableCell>
			<TableCell className='sticky left-[var(--sticky-left-col-width)] z-10 w-[var(--sticky-left-col-width)] min-w-[var(--sticky-left-col-width)]'>
				{data?.shoes_style_code_factory}
			</TableCell>
			<TableCell className='sticky left-[calc(2*var(--sticky-left-col-width))] z-10 w-[var(--sticky-left-col-width)] min-w-[var(--sticky-left-col-width)] border-r-0 drop-shadow-[1px_0px_hsl(var(--border))]'>
				{data?.mat_ecolor}
			</TableCell>
			<TableCell className={cn('!p-0')}>
				<Div
					className='flex flex-grow border-collapse flex-nowrap divide-x'
					onContextMenu={(e) => e.preventDefault()}>
					{Array(data?.sizes) &&
						sortBy(data.sizes, 'size_numcode').map((size) => (
							<Div
								key={size?.size_numcode}
								className='group/cell inline-grid min-w-20 shrink-0 basis-20 grid-rows-2 divide-y last:flex-1'>
								<TableCell className='bg-table-head font-medium'>
									<Div className='flex items-center gap-x-2'>
										{size?.size_numcode}
										<DeleteSizePopover
											data={{
												mo_no: data?.mo_no,
												mat_ecolor: data?.mat_ecolor,
												size_numcode: size?.size_numcode,
												quantity: size?.count
											}}
										/>
									</Div>
								</TableCell>
								<TableCell>{size?.count ?? 0}</TableCell>
							</Div>
						))}
				</Div>
			</TableCell>
			<TableCell align='right' className='sticky right-[var(--row-action-col-width)] w-28 min-w-28 font-medium'>
				{aggregateSizeCount}
			</TableCell>
			<TableCell
				align='center'
				className='sticky right-0 w-[var(--sticky-right-col-width)] min-w-[var(--sticky-right-col-width)] !opacity-100'>
				<DeleteOrderPopover data={data} />
			</TableCell>
		</TableRow>
	)
}

export default OrderDetailTableRow
