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
import { usePrevious } from 'ahooks'
import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { FALLBACK_ORDER_VALUE, useGetEpcQuery } from '../../_apis/rfid.api'
import { usePageContext } from '../../_contexts/-page-context'

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
	const { isLoading } = useGetEpcQuery()
	const { selectedOrder, scannedOrders, setCurrentPage, setSelectedOrder } = usePageContext(
		'selectedOrder',
		'scannedOrders',
		'setCurrentPage',
		'setSelectedOrder'
	)
	const previousSelectedOrder = usePrevious(selectedOrder)

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
						{Array.isArray(scannedOrders) && scannedOrders.length > 0 && (
							<Fragment>
								{Array.isArray(scannedOrders) &&
									scannedOrders.map((order, index) => (
										<SelectItem
											key={index}
											value={order.mo_no ?? FALLBACK_ORDER_VALUE}
											className='!flex items-center gap-x-2'>
											{order.mo_no ?? FALLBACK_ORDER_VALUE} {`(${order.count} pairs)`}
										</SelectItem>
									))}
							</Fragment>
						)}
					</SelectGroup>
				</SelectContent>
			</Select>
		</Div>
	)
}

export default ListBoxHeader
