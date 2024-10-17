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
import { pick } from 'lodash'
import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { FALLBACK_ORDER_VALUE } from '../../_apis/rfid.api'
import { useListBoxContext } from '../../_contexts/-list-box-context'
import { usePageContext } from '../../_contexts/-page-context'

const ListBoxHeader: React.FC = () => {
	return (
		<Div className='flex items-center justify-between p-2'>
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
	const { loading, setPage } = useListBoxContext()
	const { selectedOrder, scannedOrders, setScannedOrders, setSelectedOrder, reset } = usePageContext((state) =>
		pick(state, ['selectedOrder', 'scannedOrders', 'setScannedOrders', 'setSelectedOrder', 'reset'])
	)

	const handleChangeOrder = (value: string) => {
		setSelectedOrder(value)
		setPage(1)
	}

	return (
		<Select value={selectedOrder} onValueChange={handleChangeOrder}>
			<HoverCard openDelay={50} closeDelay={50}>
				<HoverCardTrigger asChild className='w-full basis-1/2'>
					<SelectTrigger className='flex justify-start gap-x-2'>
						{loading ? (
							<Icon name='LoaderCircle' className='animate-[spin_1.75s_linear_infinite]' />
						) : (
							<Icon name='ListFilter' />
						)}
						<SelectValue placeholder={!selectedOrder && 'Select'} />
					</SelectTrigger>
				</HoverCardTrigger>
				<HoverCardContent asChild sideOffset={8} side='top'>
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
	)
}

export default ListBoxHeader
