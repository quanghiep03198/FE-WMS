import { cn } from '@/common/utils/cn'
import {
	Button,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	Div,
	Form as FormProvider,
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
	Icon,
	InputFieldControl,
	Popover,
	PopoverContent,
	SelectFieldControl,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
	Tooltip,
	Typography,
	buttonVariants
} from '@/components/ui'
import ConfirmDialog from '@/components/ui/@override/confirm-dialog'
import { RFIDService } from '@/services/rfid.service'
import { zodResolver } from '@hookform/resolvers/zod'
import { PopoverTrigger } from '@radix-ui/react-popover'
import { useMemoizedFn, useResetState, useUnmount } from 'ahooks'
import { pick, uniqBy } from 'lodash'
import { Fragment, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import tw from 'tailwind-styled-components'
import { UNKNOWN_ORDER, useDeleteOrderMutation } from '../../_apis/rfid.api'
import { OrderItem, OrderSize, usePageContext } from '../../_contexts/-page-context'
import { ExchangeEpcFormValue, exchangeEpcSchema } from '../../_schemas/exchange-epc.schema'

const OrderDetails: React.FC = () => {
	const { t } = useTranslation()
	const { connection, scannedOrders, scannedSizes, setScannedOrders, setScanningStatus, setScannedSizes } =
		usePageContext((state) =>
			pick(state, [
				'connection',
				'scannedOrders',
				'scannedSizes',
				'setScannedOrders',
				'setScanningStatus',
				'setScannedSizes'
			])
		)
	const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false)
	const [orderToDelete, setOrderToDelete, resetOrderToDelete] = useResetState<string | null>(null)

	// Delete unexpected orders
	const { mutateAsync: deleteOrderAsync } = useDeleteOrderMutation()
	const handleDeleteOrder = async () => {
		console.log(1)

		try {
			const res = await deleteOrderAsync({ host: connection, orderCode: orderToDelete })
			console.log(res)
			const filteredOrders = scannedOrders.filter((item) => item?.mo_no !== orderToDelete)
			if (filteredOrders.length === 0) {
				setScanningStatus(undefined)
				resetOrderToDelete()
				return
			}
			setScannedOrders(filteredOrders)
			setScannedSizes(scannedSizes.filter((item) => item.mo_no !== orderToDelete))
			resetOrderToDelete()
		} catch (e) {
			console.log(e.message)
			toast.error(t('ns_common:notification.error'))
		}
	}

	const handleBeforeDelete = useMemoizedFn((orderCode: string) => {
		setConfirmDialogOpen(true)
		setOrderToDelete(orderCode)
	})

	return (
		<Fragment>
			<Dialog>
				<HoverCard openDelay={50} closeDelay={50}>
					<HoverCardTrigger asChild>
						<DialogTrigger
							className={cn(buttonVariants({ variant: 'default', className: 'w-full items-center' }))}>
							<Icon name='List' role='img' />
							{t('ns_common:actions.detail')}
						</DialogTrigger>
					</HoverCardTrigger>
					<HoverCardContent side='top' align='start' sideOffset={8}>
						<Typography variant='small'>{t('ns_inoutbound:description.order_size_detail')}</Typography>
					</HoverCardContent>
				</HoverCard>
				<DialogContent className='max-w-6xl'>
					<DialogHeader>
						<DialogTitle>{t('ns_inoutbound:titles.order_sizing_list')}</DialogTitle>
						<DialogDescription>{t('ns_inoutbound:description.order_sizing_list')}</DialogDescription>
					</DialogHeader>
					<Div className='divide-y overflow-clip rounded-lg border text-sm'>
						<Div
							className={cn(
								'relative max-h-96 w-full overflow-x-auto overflow-y-auto scrollbar-track-scrollbar/20',
								Array.isArray(scannedOrders) && scannedOrders.length === 0 && 'h-[50dvh]'
							)}>
							{Array.isArray(scannedOrders) && scannedOrders.length > 0 ? (
								<Table className='border-separate border-spacing-0'>
									<TableHeader>
										<TableRow className='sticky top-0 z-10 bg-background'>
											<TableHead align='left' className='w-[15%]'>
												{t('ns_erp:fields.mo_no')}
											</TableHead>
											<TableHead className='w-[75%]'>Sizes</TableHead>
											<TableHead align='right' className='w-[5%]'>
												{t('ns_common:common_fields.total')}
											</TableHead>
											<TableHead className='w-[5%]'>-</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{scannedOrders.map((order) => {
											return <OrderSizingRow data={order} onBeforeDelete={handleBeforeDelete} />
										})}
									</TableBody>
								</Table>
							) : (
								<Div className='inset-0 flex h-full w-full items-center justify-center gap-x-2'>
									<Icon name='Inbox' size={24} strokeWidth={1} />
									No data
								</Div>
							)}
						</Div>
						<Div className='flex items-center justify-between p-4'>
							<Typography variant='small' color='muted'>
								{t('ns_inoutbound:mo_no_box.caption')}
							</Typography>
						</Div>
					</Div>
				</DialogContent>
			</Dialog>

			{/* Confirm deleting all fetched orders and restart scanning progress */}
			<ConfirmDialog
				title={t('ns_inoutbound:notification.confirm_delete_all_mono.title')}
				description={t('ns_inoutbound:notification.confirm_delete_all_mono.description')}
				open={confirmDialogOpen}
				onOpenChange={setConfirmDialogOpen}
				onConfirm={handleDeleteOrder}
			/>
		</Fragment>
	)
}

const OrderSizingRow: React.FC<{ data: OrderItem; onBeforeDelete?: (orderCode: string) => void }> = ({
	data,
	onBeforeDelete
}) => {
	const { scannedSizes } = usePageContext((state) => pick(state, 'scannedSizes'))
	const { t } = useTranslation()

	const filteredSizeByOrder = useMemo(
		() => scannedSizes?.filter((size) => size?.mo_no === data?.mo_no),
		[scannedSizes, data]
	)

	return (
		<TableRow>
			<TableCell className='font-medium'>{data?.mo_no ?? UNKNOWN_ORDER}</TableCell>
			<TableCell className='!p-0'>
				<Div
					className='divide-x'
					style={{
						display: 'grid',
						gridTemplateColumns: `repeat(${filteredSizeByOrder?.length}, 1fr)`
					}}>
					{filteredSizeByOrder?.map((size) => (
						<Div key={size?.size_numcode} className='group/cell grid grid-rows-2 divide-y'>
							<TableCell className='bg-secondary/25 font-medium text-secondary-foreground'>
								<Div className='inline-flex items-center gap-x-4'>
									{size?.size_numcode ?? UNKNOWN_ORDER}
									<OrderUpdateForm defaultValues={size} />
								</Div>
							</TableCell>
							<TableCell>{size?.count}</TableCell>
						</Div>
					))}
				</Div>
			</TableCell>
			<TableCell align='right' className='font-medium'>
				{data?.count}
			</TableCell>
			<TableCell align='center'>
				<Tooltip triggerProps={{ asChild: true }} message={t('ns_common:actions.delete')}>
					<Button type='button' variant='ghost' size='icon' onClick={() => onBeforeDelete(data?.mo_no)}>
						<Icon name='Trash2' className='stroke-destructive' />
					</Button>
				</Tooltip>
			</TableCell>
		</TableRow>
	)
}

const OrderUpdateForm: React.FC<{ defaultValues: OrderSize }> = ({ defaultValues }) => {
	const { t } = useTranslation()
	const { scannedSizes, connection, setScannedSizes } = usePageContext((state) =>
		pick(state, ['scannedSizes', 'connection', 'setScannedSizes'])
	)
	const form = useForm<any>({
		resolver: zodResolver(exchangeEpcSchema),
		defaultValues,
		mode: 'onChange'
	})
	const [isPending, setIsPending] = useState<boolean>(false)

	const exchangableOrders = uniqBy(
		scannedSizes.filter(
			(item) =>
				item.size_numcode === defaultValues.size_numcode &&
				item.mo_no !== defaultValues.mo_no &&
				item.mat_code === defaultValues.mat_code
		),
		'mo_no'
	)

	const handleExchangeEpc = async (data: Omit<ExchangeEpcFormValue, 'maxExchangableQuantity'>) => {
		setIsPending(true)
		try {
			await RFIDService.exchangeEpc(connection, data)
			toast.success(t('ns_common:notification.success'))
		} catch (error) {
			toast.error(t('ns_common:notification.error'), {
				action: {
					label: 'Retry',
					onClick: async () => await RFIDService.exchangeEpc(connection, data)
				}
			})
		} finally {
			setIsPending(false)
			// TODO: optimistic update on success
		}
	}

	useUnmount(() => form.reset())

	return (
		<Popover>
			<Tooltip message='Transfer EPC' triggerProps={{ asChild: true }}>
				<PopoverTrigger className='opacity-0 transition-opacity duration-150 group-hover/cell:opacity-100'>
					<Icon name='ArrowLeftRight' className='stroke-active' />
				</PopoverTrigger>
			</Tooltip>
			<PopoverContent className='grid w-[384px] gap-6' align='center' alignOffset={4}>
				{exchangableOrders.length > 0 ? (
					<Fragment>
						<Div className='space-y-2'>
							<Typography variant='h6' className='text-base font-medium leading-none'>
								Exchange EPC
							</Typography>
							<Typography variant='small' color='muted'>
								Transfer EPC to another order
							</Typography>
						</Div>
						<FormProvider {...form}>
							<Form onSubmit={form.handleSubmit(handleExchangeEpc)}>
								<InputFieldControl
									readOnly
									orientation='horizontal'
									name='mo_no'
									control={form.control}
									label='Order'
									placeholder='0'
								/>
								<InputFieldControl
									orientation='horizontal'
									name='size_numcode'
									control={form.control}
									label='Size'
									readOnly
								/>
								<InputFieldControl
									type='hidden'
									name='mat_code'
									control={form.control}
									readOnly
									placeholder='0'
								/>
								<SelectFieldControl
									orientation='horizontal'
									name='mo_no_actual'
									control={form.control}
									label='Actual order'
									datalist={exchangableOrders}
									labelField='mo_no'
									valueField='mo_no'
								/>
								<InputFieldControl
									orientation='horizontal'
									autoComplete='off'
									name='quantity'
									control={form.control}
									label='Quantity'
									placeholder='0'
									type='number'
									min={1}
								/>
								<Button size='sm' disabled={isPending}>
									{isPending && (
										<Icon name='LoaderCircle' className='animate-[spin_1.5s_linear_infinite]' role='img' />
									)}
									{isPending ? 'Processing' : 'Confirm'}
								</Button>
							</Form>
						</FormProvider>
					</Fragment>
				) : (
					<Div className='grid h-32 place-content-center'>
						<Typography variant='small' color='muted' className='inline-flex flex-col items-center gap-2'>
							<Icon name='Inbox' size={32} className='stroke-foreground stroke-[1px]' />
							{t('ns_inoutbound:description.no_exchangable_order')}
						</Typography>
					</Div>
				)}
			</PopoverContent>
		</Popover>
	)
}

const Form = tw.form`flex w-full flex-col items-stretch gap-3`

export default OrderDetails

/**
 * @deprecated
 * Optimistic update on after exchange EPC
 	const transferedOrder = scannedSizes.find((item) => {
 		return (
 			item.mo_no === data.mo_no && item.mat_code === data.mat_code && item.size_numcode === data.size_numcode
 		)
 	})
 	const receivedOrder = exchangableOrders.find((item) => {
 		return (
 			item.mo_no === data.mo_no_actual &&
 			item.mat_code === data.mat_code &&
 			item.size_numcode === data.size_numcode
 		)
 	})
 	scannedSizes.splice(scannedSizes.indexOf(defaultValues), 1)
 	if (transferedOrder && receivedOrder) {
 		setScannedSizes([
 			...scannedSizes,
 			{ ...transferedOrder, count: transferedOrder.count - data.quantity },
 			{ ...receivedOrder, count: receivedOrder.count + data.quantity }
 		])
 	}
*/
