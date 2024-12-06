import useQueryParams from '@/common/hooks/use-query-params'
import { ReportService } from '@/services/report.service'
import { useQuery } from '@tanstack/react-query'

const INBOUND_REPORT_PROVIDE_TAG = 'INBOUND_REPORT_PROVIDE_TAG'

export const useGetInboundReport = () => {
	const { searchParams } = useQueryParams<{ 'date.eq': string }>()

	return useQuery({
		queryKey: [INBOUND_REPORT_PROVIDE_TAG, searchParams],
		queryFn: () => ReportService.getInboundReport(searchParams),
		select: (response) => response.metadata
	})
}
