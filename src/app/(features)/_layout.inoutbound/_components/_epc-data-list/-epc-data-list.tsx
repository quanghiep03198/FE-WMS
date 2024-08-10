import { cn } from '@/common/utils/cn'
import { Div, Icon, Typography } from '@/components/ui'
import { useDeepCompareEffect, useVirtualList } from 'ahooks'
import { useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import tw from 'tailwind-styled-components'
import { useGetScannedEPCQuery } from '../../_apis/rfid.api'
import { usePageContext } from '../../_contexts/-page-context'

const matchWithAllOrders = (item, orderList) => {
	return orderList?.some((order) => item.mo_no === order.mo_no)
}

const matchWithCurrentOrder = (item, orderList, currentOrder) => {
	return item.mo_no === currentOrder && orderList.some((order) => item.mo_no === order.mo_no)
}

const VIRTUAL_ITEM_SIZE = 40
const VIRTUAL_LIST_HEIGHT = 384
const PRERENDERED_ITEMS = 5

const EPCDatalist: React.FC = () => {
	const { t } = useTranslation()
	const {
		selectedOrder,
		scannedEPCs,
		connection,
		scanningStatus,
		scannedOrders,
		setScannedOrders,
		setSelectedOrder,
		setScannedOrderSizing,
		setScannedEPCs
	} = usePageContext()

	const { data } = useGetScannedEPCQuery({ connection, scanningStatus })
	const originalData = useMemo(() => (Array.isArray(data?.datalist) ? data.datalist : []), [data?.datalist])

	// Sync scanned result with fetched data from server while scanning is on and previous data is staled
	useDeepCompareEffect(() => {
		if (scanningStatus === 'scanning') {
			setScannedEPCs(originalData)
			setScannedOrders(data?.orderList ?? [])
			setScannedOrderSizing(data?.sizing ?? [])
			// Alert if there are more than 3 orders scanned
			if (data?.orderList?.length > 3)
				toast.warning('Oops !!!', {
					description: t('ns_inoutbound:notification.too_many_mono'),
					icon: <Icon name='TriangleAlert' className='stroke-destructive' />,
					closeButton: true
				})
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

const List = tw.div`flex max-h-full flex-1 basis-full flex-col items-stretch divide-y divide-border overflow-y-scroll p-2 scrollbar`
const ListItem = tw.div`px-4 py-2 h-10 flex justify-between uppercase transition-all duration-200 rounded border-b last:border-none whitespace-nowrap`
const EmptyList = tw.div`flex basis-full items-center justify-center gap-x-4 min-h-64`

export default EPCDatalist
