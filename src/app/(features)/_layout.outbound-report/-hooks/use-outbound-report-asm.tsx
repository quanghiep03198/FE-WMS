import { ReportService } from '@/services/report.service'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { pick } from 'lodash-es'

export enum OutboundReportQueryKeys {
	DAILY_OUTBOUND = 'DAILY_OUTBOUND'
}

export const useGetOutboundReport = (
	tenantId: string,
	params?: { 'auto-refresh': false | number; 'date:eq': string }
) => {
	const queryParams = params?.['date:eq'] ? pick(params, 'date:eq') : { ['date:eq']: format(new Date(), 'yyyy-MM-dd') }

	return useQuery({
		queryKey: [OutboundReportQueryKeys.DAILY_OUTBOUND, tenantId, queryParams],
		queryFn: async () => await ReportService.getOutboundReport(tenantId, queryParams),
		enabled: !!tenantId,
		refetchOnMount: true,
		refetchInterval: params['auto-refresh'],
		select: (response) => response.metadata
	})
}
