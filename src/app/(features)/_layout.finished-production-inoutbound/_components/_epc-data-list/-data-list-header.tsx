import { RetriableError } from '@/common/errors'
import {
	Div,
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
	Icon,
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
	Typography
} from '@/components/ui'
import { useAsyncEffect, useDeepCompareEffect, usePrevious } from 'ahooks'
import { uniqBy } from 'lodash'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useGetEpcQuery } from '../../_apis/rfid.api'
import { usePageContext } from '../../_contexts/-page-context'

const TOO_MANY_ORDER_TOAST = 'TOO_MANY_ORDERS'

const ListBoxHeader: React.FC = () => {
	return (
		<Div className='relative flex items-center justify-between bg-table-head p-2'>
			<Typography
				variant='h6'
				className='relative z-10 inline-flex items-center gap-x-2 px-2 text-center text-lg sm:text-base md:text-base'>
				<Icon name='ScanBarcode' size={20} />
				EPC Data
			</Typography>
			<OrderListSelect />
		</Div>
	)
}

const OrderListSelect: React.FC = () => {
	const { t } = useTranslation()
	const { isLoading, refetch: manualFetchEpc } = useGetEpcQuery()
	const {
		scannedEpc,
		selectedOrder,
		scannedOrders,
		scanningStatus,
		connection,
		setScannedEpc,
		setCurrentPage,
		setSelectedOrder
	} = usePageContext(
		'scannedEpc',
		'selectedOrder',
		'scannedOrders',
		'scanningStatus',
		'connection',
		'setScannedEpc',
		'setCurrentPage',
		'setSelectedOrder'
	)
	const previousSelectedOrder = usePrevious(selectedOrder)

	// * Ignore too many orders warning
	const isTooManyOrdersDimssiedRef = useRef<boolean>(false)

	// * On selected order changes and manual fetch epc query is not running
	useAsyncEffect(async () => {
		if (!connection || !scanningStatus) return
		try {
			const { data: metadata } = await manualFetchEpc()
			const previousFilteredEpc = scannedEpc?.data.filter((e) => e.mo_no === selectedOrder)
			const nextFilteredEpc = metadata?.data ?? []
			setScannedEpc({
				...metadata,
				data: uniqBy([...previousFilteredEpc, ...nextFilteredEpc], 'epc')
			})
		} catch {
			throw new RetriableError()
		}
	}, [selectedOrder])

	// * On too many order found
	useDeepCompareEffect(() => {
		if (!isTooManyOrdersDimssiedRef.current && scannedOrders?.length > 3 && scanningStatus === 'connected')
			toast.warning('Oops !!!', {
				id: TOO_MANY_ORDER_TOAST,
				description: t('ns_inoutbound:notification.too_many_mono'),
				icon: <Icon name='TriangleAlert' className='stroke-destructive' />,
				action: {
					label: t('ns_common:actions.dismiss'),
					type: 'button',
					onClick: () => {
						toast.dismiss(TOO_MANY_ORDER_TOAST)
						isTooManyOrdersDimssiedRef.current = true
					}
				}
			})
		else toast.dismiss(TOO_MANY_ORDER_TOAST)
	}, [scannedOrders, isTooManyOrdersDimssiedRef, scanningStatus])

	const handleChangeOrder = (value: string) => {
		setSelectedOrder(value)
		setCurrentPage(null)
	}

	return (
		<Div className='w-full basis-1/2'>
			<Select value={selectedOrder} onValueChange={handleChangeOrder}>
				<HoverCard openDelay={50} closeDelay={50}>
					<HoverCardTrigger>
						<SelectTrigger className='flex w-full justify-start gap-x-2 bg-background'>
							{selectedOrder !== previousSelectedOrder && isLoading ? (
								<Icon name='LoaderCircle' className='animate-[spin_1.75s_linear_infinite]' />
							) : (
								<Icon name='ListFilter' />
							)}
							<SelectValue placeholder={!selectedOrder && 'Select'} />
						</SelectTrigger>
					</HoverCardTrigger>
					<HoverCardContent side='top'>
						<Typography variant='small'>{t('ns_inoutbound:description.select_order')}</Typography>
					</HoverCardContent>
				</HoverCard>
				<SelectContent>
					<SelectGroup>
						<SelectItem value='all'>All</SelectItem>
						{scannedOrders.map((item) => (
							<SelectItem key={item.mo_no} value={item.mo_no} className='!flex items-center gap-x-2'>
								{item.mo_no}{' '}
								{`(${item.sizes.reduce((acc, curr) => {
									return acc + curr.count
								}, 0)} pairs)`}
							</SelectItem>
						))}
					</SelectGroup>
				</SelectContent>
			</Select>
		</Div>
	)
}

export default ListBoxHeader
