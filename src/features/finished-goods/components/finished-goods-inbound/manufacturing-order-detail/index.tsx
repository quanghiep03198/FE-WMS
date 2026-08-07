import { useEffectOnce } from '@hooks/use-effect-once'
import { useSocketContext } from '@stores/socket.store'
import { toast } from 'sonner'
import { OrderDetailProvider } from '../../../contexts/finished-goods-inbound/order-detail-context'
import ExchangeEpcFormDialog from './exchange-epc-form'
import ExchangeOrderFormDialog from './exchange-order-form'
import FillEpcDataFormDialog from './fill-epc-data-form'
import OrderDetailTable from './order-detail-table'

const OrderDetails: React.FC = () => {
	const { io } = useSocketContext('io')

	useEffectOnce(() => {
		const onSuccess = (message: string) => toast.success(message)
		const onError = (message: string) => toast.error(message)
		io.on('finished_goods:upserted_epcs_match:success', onSuccess)
		io.on('finished_goods:upserted_epcs_match:failed', onError)

		return () => {
			io.off('finished_goods:upserted_epcs_match:success', onSuccess)
			io.off('finished_goods:upserted_epcs_match:failed', onError)
		}
	})

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
