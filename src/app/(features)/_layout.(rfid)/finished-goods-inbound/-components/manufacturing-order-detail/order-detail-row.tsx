import { NestedCell, NestedColumn, NestedTable } from '@/app/(features)/-components/shared/horizontal-nested-table'
import { type OrderItem } from '@/app/(features)/_layout.(rfid)'
import { FALLBACK_VALUE } from '@/common/constants/constants'
import { cn } from '@/common/utils/cn'
import formatIntlNumber from '@/common/utils/format-intl-number'
import { Checkbox, Div, Icon, TableCell, TableRow } from '@/components/ui'
import { CheckedState } from '@radix-ui/react-checkbox'
import { sortBy } from 'lodash-es'
import { useMemo } from 'react'
import { useOrderDetailContext } from '../../-contexts/order-detail-context'
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
		setFillEpcDataDialogOpen,
		setDefaultExchangeEpcFormValues,
		setDefaultExchangeOrderFormValues
	} = useOrderDetailContext(
		'selectedRows',
		'pushSelectedRow',
		'pullSelectedRow',
		'setFillEpcDataDialogOpen',
		'setExchangeOrderDialogOpen',
		'setExchangeEpcDialogOpen',
		'setDefaultExchangeEpcFormValues',
		'setDefaultExchangeOrderFormValues'
	)

	const hasSomeRowMatch = useMemo(() => {
		if (!selectedRows || selectedRows.length === 0) return false
		return (
			data?.color_sn === selectedRows[0].color_sn &&
			data?.factory_shoes_style === selectedRows[0].factory_shoes_style
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
				'w-full transition-all duration-500',
				!hasSomeRowMatch && selectedRows.length > 0 && '*:!text-muted-foreground/50'
			)}>
			<TableCell>
				<Checkbox
					disabled={!hasSomeRowMatch && selectedRows.length > 0}
					checked={selectedRows.some((row) => row.mo_no === data?.mo_no)}
					onCheckedChange={(checked) =>
						handleToggleSelectRow(checked, {
							mo_no: data?.mo_no,
							factory_shoes_style: data?.factory_shoes_style,
							color_sn: data?.color_sn,
							count: aggregateSizeCount
						})
					}
				/>
			</TableCell>
			<TableCell>
				<Div className='flex items-center gap-x-2'>
					{data?.mo_no ?? FALLBACK_VALUE}
					{data?.mo_no === FALLBACK_VALUE ? (
						<button
							className='opacity-0 duration-100 group-hover/cell:opacity-100'
							onClick={() => setFillEpcDataDialogOpen(true)}>
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
									factory_shoes_style: data?.factory_shoes_style,
									scanned_size_qty: aggregateSizeCount
								})
							}}>
							<Icon name='ArrowLeftRight' className='stroke-active' />
						</button>
					)}
				</Div>
			</TableCell>
			<TableCell>{data?.factory_shoes_style}</TableCell>
			<TableCell>{data?.color_sn}</TableCell>
			<TableCell className='p-0'>
				<NestedTable onContextMenu={(e) => e.preventDefault()}>
					{Array.isArray(data?.sizes) &&
						sortBy(data.sizes, 'size_numcode').map((size) => (
							<NestedColumn key={size?.size_numcode}>
								<NestedCell className='bg-table-head font-medium'>
									<Div className='flex items-center gap-x-2'>
										{size?.size_numcode}
										<button
											onClick={() => {
												setExchangeEpcDialogOpen(true)
												setDefaultExchangeEpcFormValues({
													mo_no: data?.mo_no,
													color_sn: data?.color_sn,
													factory_shoes_style: data?.factory_shoes_style,
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
							</NestedColumn>
						))}
				</NestedTable>
			</TableCell>
			<TableCell align='right' className='font-medium'>
				{formatIntlNumber(aggregateSizeCount)}
			</TableCell>
			<TableCell align='center'>
				<DeleteOrderPopover data={{ mo_no: data?.mo_no }} />
			</TableCell>
		</TableRow>
	)
}

export default OrderDetailTableRow
