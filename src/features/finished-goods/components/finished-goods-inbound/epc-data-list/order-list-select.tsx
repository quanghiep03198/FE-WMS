import { usePageContext } from '@/features/finished-goods/contexts/finished-goods-inbound/page-context'
import { useGetScanningInboundEpcQuery } from '@/features/finished-goods/hooks/use-inbound-request'
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
} from '@components/ui'
import { useDeepCompareEffect, usePrevious } from 'ahooks'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

const TOO_MANY_ORDER_TOAST = 'TOO_MANY_ORDERS'

const OrderListSelect: React.FC = () => {
	const { t } = useTranslation()
	const { isLoading } = useGetScanningInboundEpcQuery()
	const { selectedOrder, scannedOrders, scanningStatus, setCurrentPage, setSelectedOrder } = usePageContext(
		'selectedOrder',
		'scannedOrders',
		'scanningStatus',
		'setCurrentPage',
		'setSelectedOrder'
	)
	const previousSelectedOrder = usePrevious(selectedOrder)

	// * Ignore too many orders warning
	const isTooManyOrdersDimssiedRef = useRef<boolean>(false)

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
		<Div className='w-full sm:basis-full'>
			<Select value={selectedOrder} onValueChange={handleChangeOrder}>
				<HoverCard openDelay={50} closeDelay={50}>
					<HoverCardTrigger asChild>
						<SelectTrigger className='flex w-full justify-start gap-x-2 border-0 bg-inherit shadow-none'>
							{selectedOrder !== previousSelectedOrder && isLoading ? (
								<Icon name='LoaderCircle' className='animate-[spin_1.75s_linear_infinite]' />
							) : (
								<Icon name='ListFilter' />
							)}
							<SelectValue placeholder={!selectedOrder && 'Select'} />
						</SelectTrigger>
					</HoverCardTrigger>
					<HoverCardContent
						side='bottom'
						sideOffset={10}
						className='inline-grid w-(--radix-hover-card-trigger-width) auto-cols-auto grid-flow-col gap-x-2 *:text-pretty'>
						<Icon name='Info' className='stroke-active my-0.5' size={18} />
						<Typography variant='small'>{t('ns_inoutbound:description.select_order')}</Typography>
					</HoverCardContent>
				</HoverCard>
				<SelectContent>
					<SelectGroup>
						<SelectItem value='all'>All</SelectItem>
						{scannedOrders.map((item) => {
							const cmdQuantity = item.sizes.reduce((acc, curr) => {
								return acc + curr.count
							}, 0)
							return (
								<SelectItem key={item.mo_no} value={item.mo_no} className='flex! items-center gap-x-2'>
									{item.mo_no} {`(${cmdQuantity} pairs)`}
								</SelectItem>
							)
						})}
					</SelectGroup>
				</SelectContent>
			</Select>
		</Div>
	)
}

export default OrderListSelect
