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
