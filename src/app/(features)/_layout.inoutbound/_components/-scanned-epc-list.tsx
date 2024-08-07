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
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
	Tooltip,
	Typography
} from '@/components/ui'
import ConfirmDialog from '@/components/ui/@override/confirm-dialog'
import { useDeepCompareEffect, useVirtualList } from 'ahooks'
import { Fragment, useCallback, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import tw from 'tailwind-styled-components'
import { UNKNOWN_ORDER, useGetScannedEPC } from '../_apis/rfid.api'
import { usePageContext } from '../_contexts/-page-context'

const matchWithAllOrders = (item, orderList) => {
	return orderList?.some((order) => item.mo_no === order.mo_no)
}

const matchWithCurrentOrder = (item, orderList, currentOrder) => {
	return item.mo_no === currentOrder && orderList.some((order) => item.mo_no === order.mo_no)
}

const VIRTUAL_ITEM_SIZE = 40
const VIRTUAL_LIST_HEIGHT = 384
const PRERENDERED_ITEMS = 5

const EPCListBox: React.FC = () => {
	return (
		<Container>
			<EPCListHeading />
			<EPCDatalist />
			<OrderDetails />
		</Container>
	)
}

const EPCListHeading: React.FC = () => {
	const { selectedOrder, scanningStatus, scannedOrders, setSelectedOrder } = usePageContext()

	return (
		<Div className='flex items-center justify-between px-4 py-2 text-center'>
			<Typography variant='h6' className='relative z-10 inline-flex items-center gap-x-2 text-center text-base px-2'>
				<Icon name='ScanBarcode' size={20} />
				EPC Data
			</Typography>
			<Select
				disabled={scanningStatus === 'scanning' || typeof scanningStatus === 'undefined'} // Disable selecting connection while scanning
				value={selectedOrder}
				onValueChange={(value) => setSelectedOrder(value)}>
				<SelectTrigger className='basis-52 flex justify-start gap-x-2'>
					<Icon name='ListFilter' />
					<SelectValue placeholder={!selectedOrder && 'Select'} />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						{Array.isArray(scannedOrders) && scannedOrders.length > 0 ? (
							<Fragment>
								<SelectItem value='all'>All</SelectItem>
								{Array.isArray(scannedOrders) &&
									scannedOrders.map((order, index) => (
										<SelectItem key={index} value={order.mo_no} className='!flex items-center gap-x-2'>
											{order.mo_no ?? UNKNOWN_ORDER} {`(${order.count} pairs)`}
										</SelectItem>
									))}
							</Fragment>
						) : (
							<SelectItem disabled value={undefined}>
								No data
							</SelectItem>
						)}
					</SelectGroup>
				</SelectContent>
			</Select>
		</Div>
	)
}

const EPCDatalist: React.FC = () => {
	const { t } = useTranslation()
	const {
		selectedOrder,
		scannedEPCs,
		connection,
		scanningStatus,
		scannedOrders,
		resetScannedOrders,
		setSelectedOrder,
		setScannedOrderSizing,
		setScannedEPCs
	} = usePageContext()

	const { data } = useGetScannedEPC({ connection, scanningStatus })

	const originalData = useMemo(() => (Array.isArray(data?.datalist) ? data.datalist : []), [data?.datalist])

	// Sync scanned result with fetched data from server while scanning is on and previous data is staled
	useDeepCompareEffect(() => {
		if (scanningStatus === 'scanning') {
			setScannedEPCs(originalData)
			resetScannedOrders(data?.orderList)
			setScannedOrderSizing(data?.sizing)
			// Alert if there are more than 3 orders scanned
			if (data?.orderList?.length > 3)
				toast('Oops !!!', { description: t('ns_inoutbound:notification.too_many_mono') })
		}
	}, [data, scanningStatus])

	// Filter scanned result
	useDeepCompareEffect(() => {
		if (scanningStatus === 'stopped' || scanningStatus === 'finished') {
			const filteredData = Array.isArray(data?.datalist)
				? data?.datalist?.filter((item) =>
						selectedOrder === 'all'
							? matchWithAllOrders(item, scannedOrders)
							: matchWithCurrentOrder(item, scannedOrders, selectedOrder)
					)
				: []

			console.log(data.datalist?.filter((item) => !item.mo_no))
			setScannedEPCs(filteredData)
			setSelectedOrder(selectedOrder || (scannedOrders?.length > 0 ? 'all' : undefined))
		}
	}, [data, selectedOrder, scannedOrders])

	const containerRef = useRef<HTMLDivElement>(null)
	const wrapperRef = useRef<HTMLDivElement>(null)

	const [virtualItems] = useVirtualList(scannedEPCs, {
		containerTarget: containerRef,
		wrapperTarget: wrapperRef,
		itemHeight: VIRTUAL_ITEM_SIZE,
		overscan: PRERENDERED_ITEMS
	})

	return (
		<List ref={containerRef} style={{ height: VIRTUAL_LIST_HEIGHT }}>
			{Array.isArray(scannedEPCs) && scannedEPCs?.length === 0 ? (
				<EmptyList>
					<Icon name='Inbox' stroke='hsl(var(--muted-foreground))' size={32} strokeWidth={1} />
					<Typography color='muted'>Empty</Typography>
				</EmptyList>
			) : (
				<Div ref={wrapperRef}>
					{Array.isArray(virtualItems) &&
						virtualItems.map((virtualItem) => {
							return (
								<ListItem
									key={virtualItem.index}
									className={cn('hover:bg-secondary')}
									style={{ height: VIRTUAL_ITEM_SIZE }}>
									<Typography className='font-medium'>{virtualItem.data?.epc_code}</Typography>
									<Typography variant='small' className='text-foreground capitalize'>
										{virtualItem.data?.mo_no}
									</Typography>
								</ListItem>
							)
						})}
				</Div>
			)}
		</List>
	)
}

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

const Container = tw.div`flex flex-1 h-full divide-y divide-border flex-col items-stretch rounded-[var(--radius)] border md:order-2 overflow-y-auto scrollba`
const List = tw.div`flex max-h-full flex-1 basis-full flex-col items-stretch divide-y divide-border overflow-y-scroll p-2 scrollbar`
const ListItem = tw.div`px-4 py-2 h-10 flex justify-between uppercase transition-all duration-200 rounded border-b last:border-none whitespace-nowrap`
const EmptyList = tw.div`flex basis-full items-center justify-center gap-x-4 min-h-64`
const GridCell = tw.div`py-2 px-4`

export default EPCListBox
