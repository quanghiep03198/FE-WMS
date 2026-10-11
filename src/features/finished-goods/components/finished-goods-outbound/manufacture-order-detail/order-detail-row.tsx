import { FALLBACK_VALUE } from '@common/constants/constants'
import { cn } from '@common/utils/cn'
import formatIntlNumber from '@common/utils/format-intl-number'
import { Div } from '@components/customs/div'
import { NestedCell, NestedColumn } from '@components/shared/horizontal-nested-table'
import { TableCell, TableRow } from '@components/ui/table'
import { type OrderItem } from '@features/finished-goods/types'
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
			<TableCell className={cn('p-0!')} style={{ height: virtualRow.size }}>
				<Div className='flex grow border-collapse flex-nowrap divide-x' onContextMenu={(e) => e.preventDefault()}>
					{Array.isArray(data?.sizes) &&
						sortBy(data.sizes, 'size_numcode').map((size) => (
							<NestedColumn
								className='group/cell inline-grid min-w-20 shrink-0 basis-20 grid-rows-2 divide-y last:flex-1'
								key={size?.size_numcode}>
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
			<TableCell align='right' className='font-medium' style={{ height: virtualRow.size }}>
				{formatIntlNumber(aggregateSizeCount)}
			</TableCell>
			<TableCell align='center' style={{ height: virtualRow.size }}>
				<DeleteOrderPopover data={data} />
			</TableCell>
		</TableRow>
	)
}

export default memo(OrderDetailTableRow, (preProps, nextProps) => isEqual(preProps.data, nextProps.data))
