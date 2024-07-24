import { cn } from '@/common/utils/cn'
import {
	Badge,
	Button,
	Div,
	Icon,
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectSeparator,
	SelectTrigger,
	SelectValue,
	Tooltip,
	Typography
} from '@/components/ui'
import ConfirmDialog from '@/components/ui/@override/confirm-dialog'
import { useDeepCompareEffect, useVirtualList } from 'ahooks'
import { Fragment, useMemo, useRef, useState } from 'react'
import isEqual from 'react-fast-compare'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import tw from 'tailwind-styled-components'
import { useGetUnscannedEPC } from '../_composables/-use-rfid-api'
import { ScannedOrder, usePageStore } from '../_contexts/-page.context'

const matchWithAllOrders = (item, orderList) => {
	return orderList?.some((order) => item.mo_no === order.orderCode)
}

const matchWithCurrentOrder = (item, orderList, currentOrder) => {
	return item.mo_no === currentOrder && orderList.some((order) => item.mo_no === order.orderCode)
}

const VIRTUAL_ITEM_SIZE = 40 as const
const VIRTUAL_LIST_HEIGHT = 384 as const
const PRERENDERED_ITEMS = 5 as const

const ScannedEPCsList: React.FC = () => {
	const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false)
	const { t } = useTranslation()
	const {
		selectedOrder,
		scannedEPCs,
		connection,
		scanningStatus,
		scannedOrders,
		backLength,
		forwardLength,
		back,
		forward,
		resetScannedOrders,
		setSelectedOrder,
		setScannedOrders,
		setScannedEPCs,
		setScanningStatus
	} = usePageStore()

	const containerRef = useRef<HTMLDivElement>(null)
	const wrapperRef = useRef<HTMLDivElement>(null)

	const { data } = useGetUnscannedEPC({ connection, scanningStatus })

	const originalData = useMemo(() => (Array.isArray(data) ? data : []), [data])

	// Sync scanned result with fetched data from server while scanning is on and previous data is staled
	useDeepCompareEffect(() => {
		if (scanningStatus === 'scanning' && Array.isArray(data) && !isEqual(scannedEPCs, originalData)) {
			const originalOrders = [...new Set(data.map((item) => item.mo_no))]
				.map(
					(order) =>
						({
							orderCode: order,
							totalEPCs: originalData.filter((item) => item.mo_no === order).length
						}) satisfies ScannedOrder
				)
				.sort((a, b) => (a.totalEPCs < b.totalEPCs ? 1 : a.totalEPCs === b.totalEPCs ? 0 : -1))
			setScannedEPCs(originalData)
			resetScannedOrders(originalOrders)
			// Alert if there are more than 3 orders scanned
			if (originalOrders?.length > 3)
				toast('Oops !!!', { description: t('ns_inoutbound:notification.too_many_mono') })
		}
	}, [data, scanningStatus])

	// Filter scanned result
	useDeepCompareEffect(() => {
		if (scanningStatus === 'stopped' || scanningStatus === 'finished') {
			const filteredData = originalData.filter((item) =>
				selectedOrder === 'all'
					? matchWithAllOrders(item, scannedOrders)
					: matchWithCurrentOrder(item, scannedOrders, selectedOrder)
			)
			setScannedEPCs(filteredData)
			setSelectedOrder(selectedOrder || (scannedOrders?.length > 0 ? 'all' : undefined))
		}
	}, [originalData, selectedOrder, scannedOrders])

	// Delete unexpected orders
	const handleDeleteOrder = (selectedOrder: string) => {
		if (scannedOrders?.length === 1) {
			setConfirmDialogOpen(true)
			return
		}
		const filteredOrders = scannedOrders.filter((item) => item?.orderCode !== selectedOrder)
		setScannedOrders(filteredOrders)
		setScannedEPCs((prev) => prev.filter((item) => item.mo_no !== selectedOrder))
		setSelectedOrder(filteredOrders[1]?.orderCode ?? filteredOrders[0]?.orderCode)
	}

	const [virtualItems] = useVirtualList(scannedEPCs, {
		containerTarget: containerRef,
		wrapperTarget: wrapperRef,
		itemHeight: VIRTUAL_ITEM_SIZE,
		overscan: PRERENDERED_ITEMS
	})

	return (
		<Fragment>
			<Div className='flex flex-1 h-full divide-y divide-border flex-col items-stretch rounded-[var(--radius)] border md:order-2 overflow-y-auto scrollbar'>
				{/* Scanning toolbar */}
				<Div className='flex items-center justify-between px-4 py-2 text-center'>
					<Typography
						variant='h6'
						className='relative z-10 inline-flex items-center gap-x-2 text-center text-base px-2'>
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
								<SelectLabel>{t('ns_inoutbound:fields.mo_no')}</SelectLabel>
								<SelectSeparator />
								{Array.isArray(scannedOrders) && scannedOrders.length > 0 ? (
									<Fragment>
										<SelectItem value='all'>All</SelectItem>
										{scannedOrders
											.sort((a, b) => (a.totalEPCs < b.totalEPCs ? 1 : a.totalEPCs === b.totalEPCs ? 0 : -1))
											.map((order, index) => (
												<SelectItem
													key={index}
													value={order.orderCode}
													className='!flex items-center gap-x-2'>
													{order.orderCode} {`(${order.totalEPCs} pairs)`}
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

				{/* Scanned EPCs list */}
				<List ref={containerRef} style={{ height: VIRTUAL_LIST_HEIGHT }}>
					{Array.isArray(scannedEPCs) && scannedEPCs?.length === 0 ? (
						<EmptyList>
							<Icon name='Inbox' stroke='hsl(var(--muted-foreground))' size={32} strokeWidth={1} />
							<Typography color='muted'>Empty</Typography>
						</EmptyList>
					) : (
						<Div ref={wrapperRef}>
							{Array.isArray(scannedEPCs) &&
								virtualItems.map((virtualItem) => {
									return (
										<ListItem
											key={virtualItem.index}
											className={cn('hover:bg-secondary')}
											style={{ height: VIRTUAL_ITEM_SIZE }}>
											<Typography className='font-medium'>{virtualItem.data?.epc_code}</Typography>
											<Typography variant='small' className='text-foreground'>
												{virtualItem.data?.mo_no}
											</Typography>
										</ListItem>
									)
								})}
						</Div>
					)}
				</List>

				{/* Scanned orders list */}
				<Div className='px-4 py-3 flex flex-col'>
					<Div className='flex justify-between items-center gap-x-2 overflow-x-auto scrollbar-none basis-10'>
						<Typography variant='small' className='font-medium whitespace-nowrap'>
							{scannedOrders.length} order(s) found
						</Typography>
						<Div className='flex items-center gap-x-2 overflow-x-auto overflow-y-auto scrollbar-none flex-1 h-full'>
							{typeof scanningStatus !== 'undefined' &&
								Array.isArray(scannedOrders) &&
								scannedOrders.reverse().map((item) => (
									<Badge key={item.orderCode} variant='secondary' className='relative group cursor-default'>
										{item.orderCode}
										{scanningStatus === 'finished' && (
											<BadgeDeleteButton
												onClick={() => {
													handleDeleteOrder(item.orderCode)
												}}>
												<Icon name='X' size={10} />
											</BadgeDeleteButton>
										)}
									</Badge>
								))}
						</Div>
						<Div className='inline-flex items-center gap-x-1'>
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
					<Typography variant='small' color='muted'>
						{t('ns_inoutbound:mo_no_box.caption')}
					</Typography>
				</Div>
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

const List = tw.div`flex max-h-full flex-1 basis-full flex-col items-stretch divide-y divide-border overflow-y-scroll p-2 scrollbar`
const ListItem = tw.div`px-4 py-2 h-10 flex justify-between uppercase transition-all duration-200 rounded border-b last:border-none`
const EmptyList = tw.div`flex basis-full items-center justify-center gap-x-4 min-h-64`
const BadgeDeleteButton = tw.button`size-4 inline-flex items-center justify-center absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 rounded-full bg-secondary text-secondary-foreground group-hover:opacity-100 opacity-0 transition-opacity duration-100`

export default ScannedEPCsList
