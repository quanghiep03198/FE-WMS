import { ReportService } from '@/services/report.service'
import { useQuery } from '@tanstack/react-query'

export const useGetDailyInboundReport = (tenantId: string) => {
	return useQuery({
		queryKey: ['DAILY_INBOUND'],
		queryFn: async () => await ReportService.getDailyInboundReport(tenantId),
		enabled: !!tenantId,
		refetchOnMount: true,
		select: (response) => response.metadata
	})
}
