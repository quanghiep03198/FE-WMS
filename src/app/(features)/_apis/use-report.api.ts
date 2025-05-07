import { ReportService } from '@/services/report.service'
import { useQuery } from '@tanstack/react-query'
import { pick } from 'lodash'

export const INBOUND_REPORT_PROVIDE_TAG = 'DAILY_INBOUND'
export const OUTBOUND_REPORT_PROVIDE_TAG = 'DAILY_OUTBOUND'
export const INVENTORY_REPORT_PROVIDE_TAG = 'MONTHLY_INVENTORY_REPORT'

export const useGetInboundReport = (
	tenantId: string,
	params?: { 'auto-refresh': false | number; 'date.eq': string }
) => {
	return useQuery({
		queryKey: [INBOUND_REPORT_PROVIDE_TAG, tenantId, pick(params, 'date.eq')],
		queryFn: async () => await ReportService.getInboundReport(tenantId, pick(params, 'date.eq')),
		enabled: !!tenantId,
		refetchInterval: params['auto-refresh'],
		select: (response) => response.metadata
	})
}

export const useGetOutboundReport = (
	tenantId: string,
	params?: { 'auto-refresh': false | number; 'date.eq': string }
) => {
	return useQuery({
		queryKey: [OUTBOUND_REPORT_PROVIDE_TAG, tenantId, pick(params, 'date.eq')],
		queryFn: async () => await ReportService.getOutboundReport(tenantId, pick(params, 'date.eq')),
		enabled: !!tenantId,
		refetchOnMount: true,
		refetchInterval: params['auto-refresh'],
		select: (response) => response.metadata
	})
}

export const useGetMonthlyInventoryReport = (tenantId: string, params?: { 'month.eq': string }) => {
	return useQuery({
		queryKey: [INVENTORY_REPORT_PROVIDE_TAG, tenantId, params],
		queryFn: async () => await ReportService.getMonthlyInventoryReport(tenantId, params),
		enabled: !!tenantId,
		refetchOnWindowFocus: false,
		select: (response) => response.metadata
	})
}
