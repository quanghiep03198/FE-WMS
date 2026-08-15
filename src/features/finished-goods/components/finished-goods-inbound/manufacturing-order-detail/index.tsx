import { OrderDetailProvider } from '../../../contexts/finished-goods-inbound/order-detail-context'
import ExchangeEpcFormDialog from './exchange-epc-form'
import ExchangeOrderFormDialog from './exchange-order-form'
import FillEpcDataFormDialog from './fill-epc-data-form'
import OrderDetailTable from './order-detail-table'

const OrderDetails: React.FC = () => {
	return (
		<OrderDetailProvider>
			<OrderDetailTable />
			<FillEpcDataFormDialog />
			<ExchangeEpcFormDialog />
			<ExchangeOrderFormDialog />
		</OrderDetailProvider>
	)
}

export default OrderDetails
