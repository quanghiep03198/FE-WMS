import { ReportService } from '@/services/report.service'
import { useQuery } from '@tanstack/react-query'
import { pick } from 'lodash-es'

export enum InboundReportQueryKeys {
	DAILY_INBOUND = 'DAILY_INBOUND'
}

export const useGetInboundReport = (
	tenantId: string,
	params?: { 'auto-refresh': false | number; 'date.eq': string }
) => {
	return useQuery({
		queryKey: [InboundReportQueryKeys.DAILY_INBOUND, tenantId, pick(params, 'date.eq')],
		queryFn: async () => await ReportService.getInboundReport(tenantId, pick(params, 'date.eq')),
		enabled: !!tenantId,
		refetchInterval: params['auto-refresh'],
		select: (response) => response.metadata
	})
}
