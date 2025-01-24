import { ReportService } from '@/services/report.service'
import { useQuery } from '@tanstack/react-query'

export const useGetInboundReport = (tenantId: string, params?: { 'date.eq': string }) => {
	return useQuery({
		queryKey: ['DAILY_INBOUND', tenantId, params],
		queryFn: async () => await ReportService.getInboundReport(tenantId, params),
		enabled: !!tenantId,
		refetchOnMount: true,
		select: (response) => response.metadata
	})
}
