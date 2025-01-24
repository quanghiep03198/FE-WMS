import { ReportService } from '@/services/report.service'
import { useQuery } from '@tanstack/react-query'

const INBOUND_REPORT_PROVIDE_TAG = 'INBOUND_REPORT_PROVIDE_TAG'

export const useGetInboundReport = (tenantId: string, params: { 'date.eq': string }) => {
	return useQuery({
		queryKey: [INBOUND_REPORT_PROVIDE_TAG, params, tenantId],
		queryFn: () => ReportService.getInboundReport(tenantId, params),
		enabled: !!tenantId,
		select: (response) => response.metadata
	})
}
