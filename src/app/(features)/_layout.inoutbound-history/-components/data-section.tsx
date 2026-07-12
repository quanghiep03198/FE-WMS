import { StockFlow } from '@/features/finished-goods/constants/enums'
import useQueryParams from '@/hooks/use-query-params'
import InboundHistoryTable from './inbound-history-table'
import OutboundHistoryTable from './outbound-history-table'

const DataSection: React.FC = () => {
	const { searchParams } = useQueryParams<{ order: string; type: StockFlow }>()
	if (searchParams.type === StockFlow.INBOUND) return <InboundHistoryTable />
	else if (searchParams.type === StockFlow.OUTBOUND) return <OutboundHistoryTable />
	else return null
}

export default DataSection
