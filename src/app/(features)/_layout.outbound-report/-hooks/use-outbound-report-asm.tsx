import { ReportService } from '@/services/report.service'
import { useQuery } from '@tanstack/react-query'
import { pick } from 'lodash-es'

export enum OutboundReportQueryKeys {
	DAILY_OUTBOUND = 'DAILY_OUTBOUND'
}

export const useGetOutboundReport = (
	tenantId: string,
	params?: { 'auto-refresh': false | number; 'date.eq': string }
) => {
	return useQuery({
		queryKey: [OutboundReportQueryKeys.DAILY_OUTBOUND, tenantId, pick(params, 'date.eq')],
		queryFn: async () => await ReportService.getOutboundReport(tenantId, pick(params, 'date.eq')),
		enabled: !!tenantId,
		refetchOnMount: true,
		refetchInterval: params['auto-refresh'],
		select: (response) => response.metadata
	})
}
