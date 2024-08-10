import { cn } from '@/common/utils/cn'
import {
	Button,
	buttonVariants,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	Div,
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
import { useResetState } from 'ahooks'
import { Fragment, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDeleteOrderMutation } from '../../_apis/rfid.api'
import { usePageContext } from '../../_contexts/-page-context'

const OrderDetails: React.FC = () => {
	const { t } = useTranslation()
	const {
		connection,
		scannedOrders,
		scannedOrderSizing,
		scanningStatus,
		setScannedOrders,
		setScannedEPCs,
		setSelectedOrder,
		setScanningStatus
	} = usePageContext()
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

	const getSizeByOrder = useCallback(
		(orderCode: string) => {
			return scannedOrderSizing.filter((size) => size.mo_no === orderCode)
		},
		[scannedOrderSizing]
	)

	return (
		<Fragment>
			<Div className='px-4 py-2 flex justify-between items-center'>
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
						<Div className='rounded-lg border divide-y text-sm overflow-clip'>
							<Div
								className={cn(
									'max-h-96 w-full relative overflow-y-auto overflow-x-auto scrollbar-track-scrollbar/20',
									Array.isArray(scannedOrders) && scannedOrders.length === 0 && 'min-h-56'
								)}>
								{Array.isArray(scannedOrders) && scannedOrders.length > 0 ? (
									<Table className='border-separate border-spacing-0'>
										<TableHeader>
											<TableRow className='sticky top-0 bg-background z-10'>
												<TableHead className='w-36'>{t('ns_inoutbound:fields.mo_no')}</TableHead>
												<TableHead>Sizes</TableHead>
												<TableHead className='w-32'>{t('ns_common:common_fields.total')}</TableHead>
												<TableHead className='w-20'>-</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{scannedOrders.map((order) => {
												return (
													<TableRow>
														<TableCell align='center' className='font-medium'>
															{order?.mo_no ?? 'Unknown'}
														</TableCell>
														<TableCell align='center' className='p-0'>
															<Div
																style={{
																	display: 'grid',
																	gridTemplateColumns: `repeat(${getSizeByOrder(order.mo_no).length}, 1fr)`
																}}>
																{getSizeByOrder(order.mo_no)?.map((size) => (
																	<Div className='divide-y grid grid-rows-2 text-right'>
																		<TableCell className='bg-secondary/50 text-secondary-foreground font-medium'>
																			{size.size_numcode ?? 'Unknown'}
																		</TableCell>
																		<TableCell>{size.count}</TableCell>
																	</Div>
																))}
															</Div>
														</TableCell>
														<TableCell align='center' className='font-medium'>
															{order.count}
														</TableCell>
														<TableCell align='center'>
															<Tooltip
																triggerProps={{ asChild: true }}
																message={t('ns_common:actions.delete')}>
																<Button
																	variant='ghost'
																	size='icon'
																	disabled={scanningStatus !== 'finished'}
																	onClick={() => {
																		setConfirmDialogOpen(true)
																		setOrderToDelete(order.mo_no)
																	}}>
																	<Icon name='Trash2' size={14} />
																</Button>
															</Tooltip>
														</TableCell>
													</TableRow>
												)
											})}
										</TableBody>
									</Table>
								) : (
									<Div className='absolute inset-0 inline-flex items-center justify-center gap-x-2 h-full'>
										<Icon name='Inbox' size={24} strokeWidth={1} />
										No data
									</Div>
								)}
							</Div>
							<Div className='flex justify-between items-center p-4'>
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

export default OrderDetails
