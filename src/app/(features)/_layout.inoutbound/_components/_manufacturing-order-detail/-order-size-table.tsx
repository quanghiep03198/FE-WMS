import { useSelectedText } from '@/common/hooks/use-selected-text'
import { cn } from '@/common/utils/cn'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	Div,
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
	Icon,
	Table,
	TableBody,
	TableHead,
	TableHeader,
	TableRow,
	Typography,
	buttonVariants
} from '@/components/ui'
import ConfirmDialog from '@/components/ui/@override/confirm-dialog'
import { useQueryClient } from '@tanstack/react-query'
import { useMemoizedFn, useResetState } from 'ahooks'
import { pick } from 'lodash'
import { Fragment, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { ORDER_DETAIL_PROVIDE_TAG, useDeleteOrderMutation, useGetOrderDetail } from '../../_apis/rfid.api'
import { usePageContext } from '../../_contexts/-page-context'
import OrderDetailTableRow from './-order-size-row'

const OrderSizeDetailTable: React.FC = () => {
	const { t } = useTranslation()
	const { connection, scannedOrders, scanningStatus, setScannedOrders, setScanningStatus, setScannedSizes } =
		usePageContext((state) =>
			pick(state, [
				'connection',
				'scannedOrders',
				'scanningStatus',
				'setScannedOrders',
				'setScanningStatus',
				'setScannedSizes'
			])
		)
	const queryClient = useQueryClient()
	const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false)
	const [orderToDelete, setOrderToDelete, resetOrderToDelete] = useResetState<string | null>(null)
	const { data } = useGetOrderDetail()

	useEffect(() => {
		if (typeof scanningStatus === 'undefined') {
			queryClient.removeQueries({ queryKey: [ORDER_DETAIL_PROVIDE_TAG, connection] })
			return
		}
		setScannedSizes(data?.sizes)
		setScannedOrders(data?.orders)
	}, [data, scanningStatus])

	// Delete unexpected orders
	const { mutateAsync: deleteOrderAsync } = useDeleteOrderMutation()

	const handleDeleteOrder = async () => {
		try {
			toast.loading(t('ns_common:notification.processing_request'), { id: 'DELETE_UNEXPECTED_ORDER' })
			await deleteOrderAsync(orderToDelete)
			const filteredOrders = scannedOrders.filter((item) => item?.mo_no !== orderToDelete)

			if (filteredOrders.length === 0) {
				setScanningStatus(undefined)
				resetOrderToDelete()
				return
			}
			resetOrderToDelete()
			toast.success(t('ns_common:notification.success'), { id: 'DELETE_UNEXPECTED_ORDER' })
		} catch (e) {
			toast.error(t('ns_common:notification.error'), { id: 'DELETE_UNEXPECTED_ORDER' })
		} finally {
			setConfirmDialogOpen(false)
		}
	}

	const handleBeforeDelete = useMemoizedFn((orderCode: string) => {
		setConfirmDialogOpen(true)
		setOrderToDelete(orderCode)
	})

	const [select, text] = useSelectedText()

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
				<DialogContent className='max-w-7xl focus-visible:outline-none focus-visible:ring-0 xxl:max-w-8xl'>
					<DialogHeader>
						<DialogTitle>{t('ns_inoutbound:titles.order_sizing_list')}</DialogTitle>
						<DialogDescription>{t('ns_inoutbound:description.order_sizing_list')}</DialogDescription>
					</DialogHeader>
					<Div className='border-collapse divide-y overflow-hidden rounded-lg border'>
						{Array.isArray(scannedOrders) && scannedOrders.length > 0 ? (
							<Div className='flow-root max-h-96 w-full overflow-scroll rounded-lg'>
								<Table className='border-separate border-spacing-0 rounded-lg'>
									<TableHeader>
										<TableRow className='sticky top-0 z-20'>
											<TableHead className='left-0 z-20 w-36 min-w-36 border-r-0 drop-shadow-[1px_0px_hsl(var(--border))]'>
												{t('ns_erp:fields.mo_no')}
											</TableHead>
											<TableHead>Size</TableHead>
											<TableHead align='right' className='right-20 z-20'>
												{t('ns_common:common_fields.total')}
											</TableHead>
											<TableHead className='absolute right-0 z-20 min-w-20'>-</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody className='[&_tr]:snap-start'>
										{scannedOrders.map((order) => {
											return (
												<OrderDetailTableRow
													data={order}
													selectedText={text}
													onSelectedTextChange={select}
													onBeforeDelete={handleBeforeDelete}
												/>
											)
										})}
									</TableBody>
								</Table>
							</Div>
						) : (
							<Div className='inset-0 flex min-h-64 w-full items-center justify-center gap-x-2'>
								<Icon name='Inbox' size={24} strokeWidth={1} />
								No data
							</Div>
						)}
						<Div className='sticky bottom-0 left-0 flex items-center justify-between bg-background p-4'>
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

export default OrderSizeDetailTable
