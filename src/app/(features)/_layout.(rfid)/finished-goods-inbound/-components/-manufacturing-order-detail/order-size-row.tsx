import { NestedCell, NestedRow } from '@/app/(features)/-components/-shared/horizontal-nested-table'
import { type OrderItem } from '@/app/(features)/_layout.(rfid)'
import { cn } from '@/common/utils/cn'
import formatIntlNumber from '@/common/utils/format-intl-number'
import { Checkbox, Div, Icon, TableCell, TableRow } from '@/components/ui'
import { CheckedState } from '@radix-ui/react-checkbox'
import { sortBy } from 'lodash'
import { useMemo } from 'react'
import { useOrderDetailContext } from '../../-contexts/order-detail-context'
import { FALLBACK_ORDER_VALUE } from '../../-hooks'
import DeleteOrderPopover from './delete-order-popover'
import DeleteSizePopover from './delete-size-popover'

type OrderDetailTableRowProps = {
	data: OrderItem
}

const OrderDetailTableRow: React.FC<OrderDetailTableRowProps> = ({ data }) => {
	const {
		selectedRows,
		pushSelectedRow,
		pullSelectedRow,
		setExchangeOrderDialogOpen,
		setExchangeEpcDialogOpen,
		setCraftEpcInfoDialogOpen,
		setDefaultExchangeEpcFormValues,
		setDefaultExchangeOrderFormValues
	} = useOrderDetailContext(
		'selectedRows',
		'pushSelectedRow',
		'pullSelectedRow',
		'setCraftEpcInfoDialogOpen',
		'setExchangeOrderDialogOpen',
		'setExchangeEpcDialogOpen',
		'setDefaultExchangeEpcFormValues',
		'setDefaultExchangeOrderFormValues'
	)

	const hasSomeRowMatch = useMemo(() => {
		if (!selectedRows || selectedRows.length === 0) return false
		return (
			data?.color_sn === selectedRows[0].color_sn &&
			data?.shoes_style_code_factory === selectedRows[0].shoes_style_code_factory
		)
	}, [selectedRows])

	const handleToggleSelectRow = (checked: CheckedState, data: any) => {
		if (checked) {
			pushSelectedRow(data)
		} else {
			pullSelectedRow(data)
		}
	}

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
		<TableRow
			className={cn(
				'transition-all duration-500',
				!hasSomeRowMatch && selectedRows.length > 0 && '*:!text-muted-foreground/50'
			)}>
			<TableCell className='sticky left-0 z-10 w-[var(--row-selection-col-width)] min-w-[var(--row-selection-col-width)] py-4'>
				<Checkbox
					disabled={!hasSomeRowMatch && selectedRows.length > 0}
					checked={selectedRows.some((row) => row.mo_no === data?.mo_no)}
					onCheckedChange={(checked) =>
						handleToggleSelectRow(checked, {
							mo_no: data?.mo_no,
							shoes_style_code_factory: data?.shoes_style_code_factory,
							color_sn: data?.color_sn,
							count: aggregateSizeCount
						})
					}
				/>
			</TableCell>
			<TableCell className='group/cell sticky left-[var(--row-selection-col-width)] z-10 w-[var(--sticky-left-col-width)] min-w-[var(--sticky-left-col-width)] space-y-1 text-center'>
				<Div className='flex items-center gap-x-2'>
					{data?.mo_no ?? FALLBACK_ORDER_VALUE}

					{data?.mo_no === FALLBACK_ORDER_VALUE ? (
						<button
							className='opacity-0 duration-100 group-hover/cell:opacity-100'
							onClick={() => setCraftEpcInfoDialogOpen(true)}>
							<Icon name='Replace' size={18} />
						</button>
					) : (
						<button
							className='opacity-0 duration-100 group-hover/cell:opacity-100'
							onClick={() => {
								setExchangeOrderDialogOpen(true)
								setDefaultExchangeOrderFormValues({
									mo_no: data?.mo_no,
									color_sn: data?.color_sn,
									shoes_style_code_factory: data?.shoes_style_code_factory,
									scanned_size_qty: aggregateSizeCount
								})
							}}>
							<Icon name='ArrowLeftRight' className='stroke-active' />
						</button>
					)}
				</Div>
			</TableCell>
			<TableCell className='sticky left-[calc(var(--row-selection-col-width)+var(--sticky-left-col-width))] z-10 w-[var(--sticky-left-col-width)] min-w-[var(--sticky-left-col-width)]'>
				{data?.shoes_style_code_factory}
			</TableCell>
			<TableCell className='sticky left-[calc(var(--row-selection-col-width)+2*var(--sticky-left-col-width))] z-10 w-[var(--sticky-left-col-width)] min-w-[var(--sticky-left-col-width)] border-r-0 drop-shadow-[1px_0px_hsl(var(--border))]'>
				{data?.color_sn}
			</TableCell>
			<TableCell className={cn('!p-0')}>
				<Div
					className='flex flex-grow border-collapse flex-nowrap divide-x'
					onContextMenu={(e) => e.preventDefault()}>
					{Array(data?.sizes) &&
						sortBy(data.sizes, 'size_numcode').map((size) => (
							<NestedRow
								key={size?.size_numcode}
								className='group/cell inline-grid min-w-28 shrink-0 basis-28 grid-rows-2 divide-y last:flex-1'>
								<NestedCell className='bg-table-head font-medium'>
									<Div className='flex items-center gap-x-2'>
										{size?.size_numcode}
										<button
											onClick={() => {
												setExchangeEpcDialogOpen(true)
												setDefaultExchangeEpcFormValues({
													mo_no: data?.mo_no,
													color_sn: data?.color_sn,
													shoes_style_code_factory: data?.shoes_style_code_factory,
													size_numcode: size?.size_numcode,
													scanned_size_qty: size?.count
												})
											}}>
											<Icon
												name='ArrowLeftRight'
												className='stroke-active opacity-0 duration-100 group-hover/cell:opacity-100 group-has-[button[data-state=open]]/cell:opacity-100'
											/>
										</button>
										<DeleteSizePopover
											data={{
												mo_no: data?.mo_no,
												size_numcode: size?.size_numcode
											}}
										/>
									</Div>
								</NestedCell>
								<NestedCell>{formatIntlNumber(size?.count)}</NestedCell>
							</NestedRow>
						))}
				</Div>
			</TableCell>
			<TableCell align='right' className='sticky right-[var(--row-action-col-width)] w-28 min-w-28 font-medium'>
				{formatIntlNumber(aggregateSizeCount)}
			</TableCell>
			<TableCell align='center' className='sticky right-0 w-[var(--sticky-right-col-width)] !opacity-100'>
				<DeleteOrderPopover data={{ mo_no: data?.mo_no }} />
			</TableCell>
		</TableRow>
	)
}

export default OrderDetailTableRow
