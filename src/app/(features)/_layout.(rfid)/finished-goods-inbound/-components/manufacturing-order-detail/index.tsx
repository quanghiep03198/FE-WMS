import { OrderDetailProvider } from '../../-contexts/order-detail-context'
import ExchangeEpcFormDialog from './exchange-epc-form'
import ExchangeOrderFormDialog from './exchange-order-form'
import FillEpcDataFormDialog from './fill-epc-data-form'
import OrderSizeDetailTable from './order-size-table'

const OrderDetails: React.FC = () => {
	return (
		<OrderDetailProvider>
			<OrderSizeDetailTable />
			<FillEpcDataFormDialog />
			<ExchangeEpcFormDialog />
			<ExchangeOrderFormDialog />
		</OrderDetailProvider>
	)
}

export default OrderDetails
