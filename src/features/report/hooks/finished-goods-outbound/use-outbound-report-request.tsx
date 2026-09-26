import { ReportService } from '@features/report/services/report.service'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { pick } from 'lodash-es'

export enum OutboundReportQueryKeys {
	DAILY_OUTBOUND = 'DAILY_OUTBOUND'
}

export const useGetOutboundReport = (params?: { 'auto-refresh': false | number; 'date:eq': string }) => {
	const queryParams =
		params && 'date:eq' in params ? pick(params, 'date:eq') : { ['date:eq']: format(new Date(), 'yyyy-MM-dd') }

	return useQuery({
		queryKey: [OutboundReportQueryKeys.DAILY_OUTBOUND, queryParams],
		queryFn: async () => await ReportService.getOutboundReport(queryParams),
		refetchOnMount: true,
		refetchInterval: params && 'auto-refresh' in params ? params['auto-refresh'] : false,
		select: (response) => response.metadata
	})
}
