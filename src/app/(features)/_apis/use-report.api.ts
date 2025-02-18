import { ReportService } from '@/services/report.service'
import { useQuery } from '@tanstack/react-query'

const INBOUND_REPORT_PROVIDE_TAG = 'DAILY_INBOUND'
const OUTBOUND_REPORT_PROVIDE_TAG = 'DAILY_OUTBOUND'

export const useGetInboundReport = (tenantId: string, params?: { 'date.eq': string }) => {
	return useQuery({
		queryKey: [INBOUND_REPORT_PROVIDE_TAG, tenantId, params],
		queryFn: async () => await ReportService.getInboundReport(tenantId, params),
		enabled: !!tenantId,
		refetchOnMount: true,
		select: (response) => response.metadata
	})
}

export const useGetOutboundReport = (tenantId: string, params?: { 'date.eq': string }) => {
	return useQuery({
		queryKey: [OUTBOUND_REPORT_PROVIDE_TAG, tenantId, params],
		queryFn: async () => await ReportService.getOutboundReport(tenantId, params),
		enabled: !!tenantId,
		refetchOnMount: true,
		select: (response) => response.metadata
	})
}
