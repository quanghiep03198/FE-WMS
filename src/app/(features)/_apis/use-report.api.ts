import { ReportService } from '@/services/report.service'
import { useQuery } from '@tanstack/react-query'
import { pick } from 'lodash'
import { UrlQueryParams } from '../_layout.inbound-report/_components/-report-datalist'

const INBOUND_REPORT_PROVIDE_TAG = 'DAILY_INBOUND'
const OUTBOUND_REPORT_PROVIDE_TAG = 'DAILY_OUTBOUND'
const INVENTORY_REPORT_PROVIDE_TAG = 'MONTHLY_INVENTORY_REPORT'

export const useGetInboundReport = (tenantId: string, params?: UrlQueryParams) => {
	return useQuery({
		queryKey: [INBOUND_REPORT_PROVIDE_TAG, tenantId, pick(params, 'date.eq')],
		queryFn: async () => await ReportService.getInboundReport(tenantId, pick(params, 'date.eq')),
		enabled: !!tenantId,
		refetchInterval: params['auto-refresh'],
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

export const useGetMonthlyInventoryReport = (tenantId: string, params?: { 'month.eq': string }) => {
	return useQuery({
		queryKey: [INVENTORY_REPORT_PROVIDE_TAG, tenantId, pick(params, 'date.eq')],
		queryFn: async () => await ReportService.getMonthlyInventoryReport(tenantId, pick(params, 'month.eq')),
		enabled: !!tenantId,
		refetchOnMount: true,
		refetchInterval: params['auto-refresh'],
		select: (response) => response.metadata
	})
}
