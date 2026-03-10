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
import { useDeepCompareEffect, usePrevious } from 'ahooks'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { usePageContext } from '../../-contexts/page-context'
import { useGetInboundEpcQuery } from '../../-hooks/use-rfid-inbound-asm'

const TOO_MANY_ORDER_TOAST = 'TOO_MANY_ORDERS'

const ListBoxHeader: React.FC = () => {
	return (
		<Div className='relative flex h-[var(--list-header-height)] items-center justify-between'>
			<OrderListSelect />
		</Div>
	)
}

const OrderListSelect: React.FC = () => {
	const { t } = useTranslation()
	const { isLoading } = useGetInboundEpcQuery()
	const { selectedOrder, scannedOrders, scanningStatus, setCurrentPage, setSelectedOrder, setCurrentFactoryProduce } =
		usePageContext(
			'selectedOrder',
			'scannedOrders',
			'scanningStatus',
			'setCurrentPage',
			'setSelectedOrder',
			'setCurrentFactoryProduce'
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
		setCurrentFactoryProduce(scannedOrders.find((item) => item.mo_no === value)?.factory_code_produce)
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
						side='top'
						sideOffset={10}
						className='w-[var(--radix-hover-card-trigger-width)] *:text-pretty'>
						<Typography variant='small' className='inline-flex items-center gap-x-2'>
							<Icon name='Info' className='stroke-active' /> {t('ns_inoutbound:description.select_order')}
						</Typography>
					</HoverCardContent>
				</HoverCard>
				<SelectContent sideOffset={4}>
					<SelectGroup>
						<SelectItem value='all'>All</SelectItem>
						{scannedOrders.map((item) => {
							const cmdQuantity = item.sizes.reduce((acc, curr) => {
								return acc + curr.count
							}, 0)
							return (
								<SelectItem key={item.mo_no} value={item.mo_no} className='!flex items-center gap-x-2'>
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

export default ListBoxHeader
