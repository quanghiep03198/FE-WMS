import useQueryParams from '@/hooks/use-query-params'
import { RFIDDataType } from '../../_layout.(rfid)/-constants'
import InboundHistoryTable from './inbound-history-table'
import OutboundHistoryTable from './outbound-history-table'

const DataSection: React.FC = () => {
	const { searchParams } = useQueryParams<{ order: string; type: RFIDDataType }>()
	if (searchParams.type === RFIDDataType.INBOUND) return <InboundHistoryTable />
	else if (searchParams.type === RFIDDataType.OUTBOUND) return <OutboundHistoryTable />
	else return null
}

export default DataSection
