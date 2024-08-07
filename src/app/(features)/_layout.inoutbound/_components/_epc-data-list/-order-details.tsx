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
	ScrollArea,
	Tooltip,
	Typography
} from '@/components/ui'
import ConfirmDialog from '@/components/ui/@override/confirm-dialog'
import { Fragment, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import { usePageContext } from '../../_contexts/-page-context'

const OrderDetails: React.FC = () => {
	const { t } = useTranslation()
	const {
		scannedOrders,
		scannedOrderSizing,
		backLength,
		forwardLength,
		scanningStatus,
		back,
		forward,
		setScannedOrders,
		setScannedEPCs,
		setSelectedOrder,
		setScanningStatus
	} = usePageContext()
	const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false)

	// Delete unexpected orders
	const handleDeleteOrder = (selectedOrder: string) => {
		if (scannedOrders?.length === 1) {
			setConfirmDialogOpen(true)
			return
		}
		const filteredOrders = scannedOrders.filter((item) => item?.mo_no !== selectedOrder)
		setScannedOrders(filteredOrders)
		setScannedEPCs((prev) => prev.filter((item) => item.mo_no !== selectedOrder))
		setSelectedOrder(filteredOrders[1]?.mo_no ?? filteredOrders[0]?.mo_no)
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
					<DialogContent className='max-w-4xl'>
						<DialogHeader>
							<DialogTitle>{t('ns_inoutbound:titles.order_sizing_list')}</DialogTitle>
							<DialogDescription>{t('ns_inoutbound:description.order_sizing_list')}</DialogDescription>
						</DialogHeader>
						<Div className='rounded-lg border divide-y divide-border text-sm'>
							<ScrollArea className='h-96 w-full relative'>
								{Array.isArray(scannedOrders) && scannedOrders.length > 0 ? (
									<Div className='divide-y divide-border w-full col-span-full'>
										{scannedOrders.map((order) => {
											return (
												<Div className='grid grid-cols-[144px_auto_128px_64px] divide-x divide-border '>
													<Div className='divide-y divide-border'>
														<GridCell className='row-span-2 text-center grid place-content-center font-medium p-0 overflow-hidden h-20'>
															{order?.mo_no ?? 'Unknown'}
														</GridCell>
													</Div>
													<Div
														className='grid row-span-1 divide-x divide-border'
														style={{
															gridTemplateColumns: `repeat(${getSizeByOrder(order.mo_no).length}, 1fr)`
														}}>
														{getSizeByOrder(order.mo_no)?.map((size) => (
															<Div className='divide-y divide-border'>
																<GridCell className='bg-secondary/50 text-secondary-foreground font-medium'>
																	{size.size_numcode ?? 'Unknown'}
																</GridCell>
																<GridCell>{size.count}</GridCell>
															</Div>
														))}
													</Div>
													<Div className='divide-y divide-border'>
														<GridCell className='bg-secondary/50 text-secondary-foreground'>
															{t('ns_common:common_fields.total')}
														</GridCell>
														<GridCell className='font-medium'>{order.count}</GridCell>
													</Div>
													<GridCell className='row-span-2 grid place-content-center'>
														<Tooltip
															triggerProps={{ asChild: true }}
															message={t('ns_common:actions.delete')}>
															<Button
																variant='ghost'
																size='icon'
																disabled={scanningStatus !== 'finished'}
																onClick={() => handleDeleteOrder(order.mo_no)}>
																<Icon name='Trash2' size={14} />
															</Button>
														</Tooltip>
													</GridCell>
												</Div>
											)
										})}
									</Div>
								) : (
									<Div className='absolute inset-0 inline-flex items-center justify-center gap-x-2 h-full'>
										<Icon name='Inbox' size={24} strokeWidth={1} />
										No data
									</Div>
								)}
							</ScrollArea>
							<Div className='flex justify-between items-center px-4 py-2'>
								<Typography variant='small' color='muted'>
									{t('ns_inoutbound:mo_no_box.caption')}
								</Typography>
								<Div className='flex justify-end gap-x-1'>
									<Tooltip message='Undo'>
										<Button
											size='icon'
											variant='ghost'
											className='size-8'
											disabled={backLength <= 0}
											onClick={back}>
											<Icon name='Undo2' />
										</Button>
									</Tooltip>
									<Tooltip message='Redo'>
										<Button
											size='icon'
											variant='ghost'
											className='size-8'
											disabled={forwardLength <= 0}
											onClick={forward}>
											<Icon name='Redo2' />
										</Button>
									</Tooltip>
								</Div>
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
				onConfirm={() => setScanningStatus(undefined)}
			/>
		</Fragment>
	)
}

const GridCell = tw.div`py-2 px-4`

export default OrderDetails
