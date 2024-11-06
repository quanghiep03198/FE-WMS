import { OrderDetailProvider } from '../../_contexts/-order-detail-context'
import ExchangeEpcFormDialog from './-exchange-epc-form'
import ExchangeOrderFormDialog from './-exchange-order-form'
import OrderSizeDetailTable from './-order-size-table'

const OrderDetails: React.FC = () => {
	return (
		<OrderDetailProvider>
			<OrderSizeDetailTable />
			<ExchangeEpcFormDialog />
			<ExchangeOrderFormDialog />
		</OrderDetailProvider>
	)
}

export default OrderDetails
