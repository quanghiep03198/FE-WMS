import { ReportService } from '@features/report/services/report.service'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { pick } from 'lodash-es'

export enum InboundReportQueryKeys {
	DAILY_INBOUND = 'DAILY_INBOUND'
}

export const useGetInboundReport = (
	tenantId: string,
	params?: { 'auto-refresh': false | number; 'date:eq': string }
) => {
	const queryParams = params?.['date:eq'] ? pick(params, 'date:eq') : { ['date:eq']: format(new Date(), 'yyyy-MM-dd') }

	return useQuery({
		queryKey: [InboundReportQueryKeys.DAILY_INBOUND, tenantId, queryParams],
		queryFn: async () => await ReportService.getInboundReport(tenantId, queryParams),
		enabled: !!tenantId,
		refetchInterval: params['auto-refresh'],
		select: (response) => response.metadata
	})
}
