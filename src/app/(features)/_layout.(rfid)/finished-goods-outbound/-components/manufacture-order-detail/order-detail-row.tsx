import { NestedCell, NestedRow } from '@/app/(features)/-components/-shared/horizontal-nested-table'
import { type OrderItem } from '@/app/(features)/_layout.(rfid)'
import { FALLBACK_VALUE } from '@/common/constants/constants'
import { cn } from '@/common/utils/cn'
import formatIntlNumber from '@/common/utils/format-intl-number'
import { Div, TableCell, TableRow } from '@/components/ui'
import { sortBy } from 'lodash'
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
			<TableCell
				style={{ height: virtualRow.size }}
				className='group/cell left-0 z-10 w-[var(--sticky-left-col-width)] min-w-[var(--sticky-left-col-width)] space-y-1 text-pretty text-center md:right-auto xl:sticky'>
				<Div className='flex items-center gap-x-2'>{data?.mo_no ?? FALLBACK_VALUE}</Div>
			</TableCell>
			<TableCell
				style={{ height: virtualRow.size }}
				className='z-10 w-[var(--sticky-left-ntn-col-width)] min-w-[var(--sticky-left-ntn-col-width)] text-pretty xl:sticky xl:left-[var(--sticky-left-col-width)] xl:right-auto'>
				{data?.factory_shoes_style}
			</TableCell>
			<TableCell
				style={{ height: virtualRow.size }}
				className='z-10 w-[var(--sticky-left-ntn-col-width)] min-w-[var(--sticky-left-ntn-col-width)] text-pretty border-r-0 drop-shadow-[1px_0px_hsl(var(--border))] xl:!sticky xl:left-[calc(var(--sticky-left-col-width)+var(--sticky-left-col-width))] xl:right-auto'>
				{data?.color_sn}
			</TableCell>
			<TableCell style={{ height: virtualRow.size }} className={cn('!p-0')}>
				<Div
					className='flex flex-grow border-collapse flex-nowrap divide-x'
					onContextMenu={(e) => e.preventDefault()}>
					{Array(data?.sizes) &&
						sortBy(data.sizes, 'size_numcode').map((size) => (
							<NestedRow
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
							</NestedRow>
						))}
				</Div>
			</TableCell>
			<TableCell
				style={{ height: virtualRow.size }}
				align='right'
				className='w-28 min-w-28 font-medium md:relative md:right-auto xl:sticky xl:right-[var(--row-action-col-width)]'>
				{formatIntlNumber(aggregateSizeCount)}
			</TableCell>
			<TableCell
				style={{ height: virtualRow.size }}
				align='center'
				className='w-[var(--sticky-right-col-width)] min-w-[var(--sticky-right-col-width)] md:relative md:right-auto xl:sticky xl:right-0'>
				<DeleteOrderPopover data={data} />
			</TableCell>
		</TableRow>
	)
}

export default memo(OrderDetailTableRow, (preProps, nextProps) => isEqual(preProps.data, nextProps.data))
