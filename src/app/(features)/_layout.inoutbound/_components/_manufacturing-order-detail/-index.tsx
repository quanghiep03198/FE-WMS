import { OrderDetailProvider } from '../../_contexts/-exchange-form.context'
import ExchangeEpcFormDialog from './-exchange-epc-form'
import OrderSizeDetailTable from './-order-size-table'

const OrderDetails: React.FC = () => {
	return (
		<OrderDetailProvider>
			<OrderSizeDetailTable />
			<ExchangeEpcFormDialog />
		</OrderDetailProvider>
	)
}

export default OrderDetails

/**
 * @deprecated
 * Optimistic update on after exchange EPC
 	const transferedOrder = scannedSizes.find((item) => {
 		return (
 			item.mo_no === data.mo_no && item.mat_code === data.mat_code && item.size_numcode === data.size_numcode
 		)
 	})
 	const receivedOrder = exchangableOrders.find((item) => {
 		return (
 			item.mo_no === data.mo_no_actual &&
 			item.mat_code === data.mat_code &&
 			item.size_numcode === data.size_numcode
 		)
 	})
 	scannedSizes.splice(scannedSizes.indexOf(defaultValues), 1)
 	if (transferedOrder && receivedOrder) {
 		setScannedSizes([
 			...scannedSizes,
 			{ ...transferedOrder, count: transferedOrder.count - data.quantity },
 			{ ...receivedOrder, count: receivedOrder.count + data.quantity }
 		])
 	}
*/
