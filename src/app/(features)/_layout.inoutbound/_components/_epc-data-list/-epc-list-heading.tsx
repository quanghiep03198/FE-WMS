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
import { Fragment } from 'react'
import { UNKNOWN_ORDER } from '../../_apis/rfid.api'
import { usePageContext } from '../../_contexts/-page-context'

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

export default EPCListHeading
