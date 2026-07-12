import { NestedCell, NestedColumn } from '@/components/shared/horizontal-nested-table'
import { Div, TableCell, TableRow } from '@/components/ui'
import { type OrderItem } from '@/features/finished-goods/types'
import { FALLBACK_VALUE } from '@common/constants/constants'
import { cn } from '@common/utils/cn'
import formatIntlNumber from '@common/utils/format-intl-number'
import { sortBy } from 'lodash-es'
import { memo, useMemo } from 'react'
import isEqual from 'react-fast-compare'
import DeleteOrderPopover from './delete-order-popover'
import DeleteSizePopover from './delete-size-popover'

type OrderDetailTableRowProps = {
	data: OrderItem
	virtualRow: { index: number; start: number; size: number }
}

const OrderDetailTableRow: React.FC<OrderDetailTableRowProps> = ({ data, virtualRow }) => {
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
		<TableRow data-index={virtualRow.index} style={{ height: virtualRow.size }}>
			<TableCell style={{ height: virtualRow.size }}>
				<Div className='flex items-center gap-x-2'>{data?.mo_no ?? FALLBACK_VALUE}</Div>
			</TableCell>
			<TableCell style={{ height: virtualRow.size }}>{data?.factory_shoes_style}</TableCell>
			<TableCell style={{ height: virtualRow.size }}>{data?.color_sn}</TableCell>
			<TableCell style={{ height: virtualRow.size }} className={cn('!p-0')}>
				<Div
					className='flex flex-grow border-collapse flex-nowrap divide-x'
					onContextMenu={(e) => e.preventDefault()}>
					{Array.isArray(data?.sizes) &&
						sortBy(data.sizes, 'size_numcode').map((size) => (
							<NestedColumn
								key={size?.size_numcode}
								className='group/cell inline-grid min-w-20 shrink-0 basis-20 grid-rows-2 divide-y last:flex-1'>
								<NestedCell className='bg-table-head font-medium'>
									<Div className='flex items-center gap-x-2'>
										{size?.size_numcode}
										<DeleteSizePopover
											data={{
												mo_no: data?.mo_no,
												size_numcode: size?.size_numcode
											}}
										/>
									</Div>
								</NestedCell>
								<NestedCell>{formatIntlNumber(size?.count) ?? 0}</NestedCell>
							</NestedColumn>
						))}
				</Div>
			</TableCell>
			<TableCell style={{ height: virtualRow.size }} align='right' className='font-medium'>
				{formatIntlNumber(aggregateSizeCount)}
			</TableCell>
			<TableCell style={{ height: virtualRow.size }} align='center'>
				<DeleteOrderPopover data={data} />
			</TableCell>
		</TableRow>
	)
}

export default memo(OrderDetailTableRow, (preProps, nextProps) => isEqual(preProps.data, nextProps.data))
