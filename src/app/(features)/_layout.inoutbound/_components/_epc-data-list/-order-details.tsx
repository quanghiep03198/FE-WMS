import { cn } from '@/common/utils/cn'
import {
	Button,
	buttonVariants,
	ComboboxFieldControl,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	Div,
	Form as FormProvider,
	Icon,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
	Tooltip,
	Typography
} from '@/components/ui'
import ConfirmDialog from '@/components/ui/@override/confirm-dialog'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMemoizedFn, useResetState } from 'ahooks'
import { debounce } from 'lodash'
import { Fragment, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import {
	UNKNOWN_ORDER,
	useDeleteOrderMutation,
	useGetCustOrderListQuery,
	useUpdateOrderCodeMutation
} from '../../_apis/rfid.api'
import { useOrderSizingRowContext } from '../../_contexts/-order-sizing-row-context'
import { ScannedOrder, usePageContext } from '../../_contexts/-page-context'
import { UpdateOrderFormValue, updateOrderSchema } from '../../_schemas/order.schema'

const OrderDetails: React.FC = () => {
	const { t } = useTranslation()
	const { connection, scannedOrders, setScannedOrders, setScannedEPCs, setSelectedOrder, setScanningStatus } =
		usePageContext()
	const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false)
	const [orderToDelete, setOrderToDelete, resetOrderToDelete] = useResetState<string | null>(null)

	// Delete unexpected orders
	const { mutateAsync: deleteOrderAsync } = useDeleteOrderMutation()
	const handleDeleteOrder = async () => {
		await deleteOrderAsync({ host: connection, orderCode: orderToDelete })
		const filteredOrders = scannedOrders.filter((item) => item?.mo_no !== orderToDelete)
		if (filteredOrders.length === 0) {
			setScanningStatus(undefined)
			resetOrderToDelete()
			return
		}
		setScannedOrders(filteredOrders)
		setScannedEPCs((prev) => prev.filter((item) => item.mo_no !== orderToDelete))
		setSelectedOrder(filteredOrders[1]?.mo_no ?? filteredOrders[0]?.mo_no)
		resetOrderToDelete()
	}

	const handleBeforeDelete = useMemoizedFn((orderCode: string) => {
		setConfirmDialogOpen(true)
		setOrderToDelete(orderCode)
	})

	return (
		<Fragment>
			<Div className='flex items-center justify-between px-4 py-2'>
				<Dialog>
					<DialogTrigger
						className={cn(buttonVariants({ variant: 'secondary', size: 'sm', className: 'items-center' }))}>
						<Icon name='List' role='img' />
						{t('ns_common:actions.detail')}
					</DialogTrigger>
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
												<TableHead className='w-1/6'>{t('ns_inoutbound:fields.mo_no')}</TableHead>
												<TableHead className='w-3/4'>Sizes</TableHead>
												<TableHead className='w-1/6'>{t('ns_common:common_fields.total')}</TableHead>
												<TableHead>-</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{scannedOrders.map((order) => {
												return <OrderSizingRow data={order} onBeforeDelete={handleBeforeDelete} />
											})}
										</TableBody>
									</Table>
								) : (
									<Div className='inset-0 flex h-[50dvh] w-full items-center justify-center gap-x-2'>
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
				<Typography variant='small' color='muted'>
					{t('ns_inoutbound:mo_no_box.order_count', {
						count: scannedOrders?.length ?? 0,
						defaultValue: null
					})}
				</Typography>
			</Div>
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

const OrderSizingRow: React.FC<{ data: ScannedOrder; onBeforeDelete?: (orderCode: string) => void }> = ({
	data,
	onBeforeDelete
}) => {
	const { scannedOrderSizing } = usePageContext()
	const { t } = useTranslation()

	const filteredSizeByOrder = useMemo(
		() => scannedOrderSizing.filter((size) => size?.mo_no === data?.mo_no),
		[scannedOrderSizing, data]
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
						<Div key={size?.size_numcode} className='grid grid-rows-2 divide-y'>
							<TableCell className='bg-secondary/50 font-medium text-secondary-foreground'>
								{size?.size_numcode ?? UNKNOWN_ORDER}
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
						<Icon name='Trash2' />
					</Button>
				</Tooltip>
			</TableCell>
		</TableRow>
	)
}

/**
 * @deprecated
 */
const OrderUpdateForm: React.FC<{ defaultValue: string }> = ({ defaultValue }) => {
	const form = useForm<UpdateOrderFormValue>({
		resolver: zodResolver(updateOrderSchema),
		defaultValues: { mo_no: defaultValue },
		mode: 'onChange'
	})
	const { connection } = usePageContext()
	const { handleToggleEditing } = useOrderSizingRowContext()
	const [searchTerm, setSearchTerm] = useState<string>('')

	const { data } = useGetCustOrderListQuery(connection, searchTerm)

	const { mutateAsync, isPending } = useUpdateOrderCodeMutation((variables) => {
		handleToggleEditing()
	})

	const datalist = useMemo(() => {
		const originalData = Array.isArray(data) ? data : []
		return [...new Set([...originalData, defaultValue])].map((item) => ({ label: item, value: item }))
	}, [data])

	return (
		<FormProvider {...form}>
			<form
				className='w-full'
				onSubmit={form.handleSubmit(async (data) => {
					await mutateAsync({ host: connection, previousOrder: defaultValue, payload: data }).finally(() =>
						form.setValue('mo_no', data.mo_no)
					)
				})}>
				<ComboboxFieldControl
					name='mo_no'
					form={form}
					onInput={debounce((value) => setSearchTerm(value), 200)}
					datalist={datalist}
					labelField='label'
					valueField='value'
					disabled={isPending}
					triggerProps={{ className: 'border-none shadow-none w-full' }}
				/>
				<button className='sr-only' id={defaultValue}>
					Save changes
				</button>
			</form>
		</FormProvider>
	)
}

export default OrderDetails
