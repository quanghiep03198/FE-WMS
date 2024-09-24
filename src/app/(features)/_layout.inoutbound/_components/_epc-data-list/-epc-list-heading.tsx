import {
	Div,
	Icon,
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
	Typography
} from '@/components/ui'
import { useEventListener } from 'ahooks'
import { pick } from 'lodash'
import { Fragment } from 'react'
import { UNKNOWN_ORDER } from '../../_apis/rfid.api'
import { useListBoxContext } from '../../_contexts/-list-box.context'
import { usePageContext } from '../../_contexts/-page-context'

const EpcListHeading: React.FC = () => {
	const { selectedOrder, scannedOrders, setScannedOrders, setSelectedOrder, reset } = usePageContext((state) =>
		pick(state, ['selectedOrder', 'scannedOrders', 'setScannedOrders', 'setSelectedOrder', 'reset'])
	)

	const { loading, setPage } = useListBoxContext()

	useEventListener('INOUTBOUND_SUBMISSION', (e: CustomEvent<string>) => {
		const filteredOrders = scannedOrders.filter((item) => item.mo_no !== e.detail)
		if (filteredOrders.length > 0) {
			setSelectedOrder(filteredOrders[0]?.mo_no)
			setScannedOrders(filteredOrders)
		} else {
			reset()
		}
	})

	const handleChangeOrder = (value: string) => {
		setSelectedOrder(value)
		setPage(1)
	}

	return (
		<Div className='flex h-fit items-center justify-between px-4 py-2 text-center'>
			<Typography variant='h6' className='relative z-10 inline-flex items-center gap-x-2 px-2 text-center text-base'>
				<Icon name='ScanBarcode' size={20} />
				EPC Data
			</Typography>
			<Select
				// disabled={scanningStatus === 'connected' || typeof scanningStatus === 'undefined'} // Disable selecting connection while scanning
				value={selectedOrder}
				onValueChange={handleChangeOrder}>
				<SelectTrigger className='flex basis-52 justify-start gap-x-2'>
					{loading ? (
						<Icon name='LoaderCircle' className='animate-[spin_1.75s_linear_infinite]' />
					) : (
						<Icon name='ListFilter' />
					)}
					<SelectValue placeholder={!selectedOrder && 'Select'} />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						<SelectItem value='all'>All</SelectItem>
						{Array.isArray(scannedOrders) && scannedOrders.length > 0 && (
							<Fragment>
								{Array.isArray(scannedOrders) &&
									scannedOrders.map((order, index) => (
										<SelectItem key={index} value={order.mo_no} className='!flex items-center gap-x-2'>
											{order.mo_no ?? UNKNOWN_ORDER} {`(${order.count} pairs)`}
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

export default EpcListHeading
