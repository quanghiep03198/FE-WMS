import { cn } from '@/common/utils/cn'
import {
	Button,
	buttonVariants,
	Checkbox,
	Div,
	Icon,
	Popover,
	PopoverContent,
	PopoverTrigger,
	TableCell,
	TableRow,
	Typography
} from '@/components/ui'
import { CheckedState } from '@radix-ui/react-checkbox'
import { PopoverClose } from '@radix-ui/react-popover'
import { useMemoizedFn } from 'ahooks'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { FALLBACK_ORDER_VALUE, useDeleteEpcMutation } from '../../_apis/rfid.api'
import { useOrderDetailContext } from '../../_contexts/-order-detail-context'
import { usePageContext } from '../../_contexts/-page-context'
import { OrderItem } from '../../_types'
import DeleteSizePopover from './-delete-size-popover'

type OrderDetailTableRowProps = {
	data: OrderItem
	// inViewport: boolean
}

const OrderDetailTableRow: React.FC<OrderDetailTableRowProps> = ({ data }) => {
	const { t } = useTranslation()
	const { scannedOrders, setScanningStatus, setScannedOrders } = usePageContext(
		'scannedOrders',
		'setScanningStatus',
		'setScannedOrders'
	)
	const {
		selectedRows,
		pushSelectedRow,
		pullSelectedRow,
		setExchangeOrderDialogOpen,
		setExchangeEpcDialogOpen,
		setDefaultExchangeEpcFormValues,
		setDefaultExchangeOrderFormValues
	} = useOrderDetailContext(
		'selectedRows',
		'pushSelectedRow',
		'pullSelectedRow',
		'setExchangeOrderDialogOpen',
		'setExchangeEpcDialogOpen',
		'setDefaultExchangeEpcFormValues',
		'setDefaultExchangeOrderFormValues'
	)

	const { mutateAsync: deleteOrderAsync, isPending: isDeleting } = useDeleteEpcMutation()

	const hasSomeRowMatch = useMemo(() => {
		if (!selectedRows || selectedRows.length === 0) return false
		return data?.mat_code === selectedRows[0].mat_code
	}, [selectedRows])

	const [popoverOpen, setPopoverOpen] = useState<boolean>(false)

	const handleToggleSelectRow = (checked: CheckedState, data: any) => {
		checked ? pushSelectedRow(data) : pullSelectedRow(data)
	}

	const handleDeleteOrder = useMemoizedFn(async () => {
		try {
			await deleteOrderAsync({ ['mo_no.eq']: data?.mo_no })
			// * Remove from selected row if scanned order is deleted
			if (selectedRows.some((row) => row.mo_no === data?.mo_no)) {
				pullSelectedRow(selectedRows.find((row) => row.mo_no === data?.mo_no))
			}
			// * If all order is deleted, reset all
			const filteredOrders = scannedOrders.filter((item) => item?.mo_no !== data?.mo_no)
			if (filteredOrders.length === 0) {
				setScanningStatus(undefined)
				return
			}
			setScannedOrders(filteredOrders)
			setPopoverOpen(false)
			toast.success(t('ns_common:notification.success'), { id: 'DELETE_UNEXPECTED_ORDER' })
		} catch (e) {
			toast.error(t('ns_common:notification.error'), { id: 'DELETE_UNEXPECTED_ORDER' })
		}
	})

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
							mat_code: data?.mat_code,
							count: aggregateSizeCount
						})
					}
				/>
			</TableCell>
			<TableCell className='group/cell sticky left-[var(--row-selection-col-width)] z-10 w-[var(--sticky-left-col-width)] min-w-[var(--sticky-left-col-width)] space-y-1 text-center'>
				<Div className='flex items-center gap-x-2'>
					{data?.mo_no ?? FALLBACK_ORDER_VALUE}
					<button
						className='opacity-0 duration-100 group-hover/cell:opacity-100'
						onClick={() => {
							setExchangeOrderDialogOpen(true)
							setDefaultExchangeOrderFormValues({
								mo_no: data?.mo_no,
								mat_code: data?.mat_code,
								count: aggregateSizeCount
							})
						}}>
						<Icon name='ArrowLeftRight' className='stroke-active' />
					</button>
				</Div>
			</TableCell>
			<TableCell className='sticky left-[calc(var(--row-selection-col-width)+var(--sticky-left-col-width))] z-10 w-[var(--sticky-left-col-width)] min-w-[var(--sticky-left-col-width)]'>
				{data?.shoes_style_code_factory}
			</TableCell>
			<TableCell className='sticky left-[calc(var(--row-selection-col-width)+2*var(--sticky-left-col-width))] z-10 w-[var(--sticky-left-col-width)] min-w-[var(--sticky-left-col-width)] border-r-0 drop-shadow-[1px_0px_hsl(var(--border))]'>
				{data?.mat_code}
			</TableCell>
			<TableCell className={cn('!p-0')}>
				<Div
					className='flex flex-grow border-collapse flex-nowrap divide-x'
					onContextMenu={(e) => e.preventDefault()}>
					{Array(data?.sizes) &&
						data?.sizes?.map((size) => (
							<Div
								key={size?.size_numcode}
								className='group/cell inline-grid min-w-36 shrink-0 basis-36 grid-rows-2 divide-y last:flex-1'>
								<TableCell className='bg-table-head font-medium'>
									<Div className='flex items-center gap-x-2'>
										{size?.size_numcode}
										<button
											onClick={() => {
												setExchangeEpcDialogOpen(true)
												setDefaultExchangeEpcFormValues({
													mo_no: data?.mo_no,
													mat_code: data?.mat_code,
													size_numcode: size?.size_numcode,
													count: size?.count
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
												mat_code: data?.mat_code,
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
			<TableCell align='right' className='sticky right-[var(--row-action-col-width)] w-24 min-w-24 font-medium'>
				{aggregateSizeCount}
			</TableCell>
			<TableCell align='center' className='sticky right-0 w-[var(--sticky-right-col-width)] !opacity-100'>
				<Popover open={popoverOpen} onOpenChange={setPopoverOpen} modal>
					<PopoverTrigger
						disabled={data?.mo_no === FALLBACK_ORDER_VALUE}
						className='[&:disabled>svg]:cursor-not-allowed [&:disabled>svg]:stroke-muted-foreground [&>svg]:stroke-destructive'>
						<Icon name='Trash2' />
					</PopoverTrigger>
					<PopoverContent className='w-96 space-y-6' side='left' align='center' sideOffset={16}>
						<Div className='space-y-1.5'>
							<Typography className='font-medium'>
								{t('ns_inoutbound:notification.confirm_delete_all_mono.title')}
							</Typography>
							<Typography variant='small'>
								{t('ns_inoutbound:notification.confirm_delete_all_mono.description')}
							</Typography>
						</Div>
						<Div className='flex items-stretch justify-end gap-x-1 *:basis-20'>
							<PopoverClose
								disabled={isDeleting}
								className={cn(buttonVariants({ variant: 'secondary', size: 'sm' }))}>
								{t('ns_common:actions.cancel')}
							</PopoverClose>
							<Button disabled={isDeleting} variant='destructive' size='sm' onClick={handleDeleteOrder}>
								{isDeleting && <Icon name='LoaderCircle' role='img' className='animate-spin' />}
								{t('ns_common:actions.delete')}
							</Button>
						</Div>
					</PopoverContent>
				</Popover>
			</TableCell>
		</TableRow>
	)
}

export default OrderDetailTableRow
