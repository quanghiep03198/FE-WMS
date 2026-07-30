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
		io.on('exchange_mo:success', onSuccess)
		io.on('exchange_mo:error', onError)

		return () => {
			io.off('exchange_mo:success', onSuccess)
			io.off('exchange_mo:error', onError)
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
