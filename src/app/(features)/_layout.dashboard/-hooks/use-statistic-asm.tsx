import type { IAnnuallyInOutboundStatistics } from '@/features/dashboard/types'
import { StatisticsService } from '@/services/statistics.service'
import { useQuery } from '@tanstack/react-query'
import { useGetTenantByFactory } from '../../../../features/tenancy/hooks/use-tenacy-request'

export enum StatisticsQueryKeys {
	MONTHLY_INVENTORY_COMPARISON = 'MONTHLY_INVENTORY_COMPARISON',
	LAST_6_MONTHS_NET_FLOW = 'LAST_6_MONTHS_NET_FLOW',
	ANNUAL_INOUTBOUND_OVERVIEW = 'ANNUAL_INOUTBOUND_OVERVIEW',
	DEFECTIVE_GOODS_INVENTORY_COMPOSITION = 'DEFECTIVE_GOODS_INVENTORY_COMPOSITION',
	ASSEMBLY_PRODUCTIVITY = 'ASSEMBLY_PRODUCTIVITY'
}

const POLLING_INTERVAL = 10_000 // 15 seconds

export const useGetStatisticsQuery = () => {
	const { data: tenant } = useGetTenantByFactory()

	return useQuery({
		queryKey: [StatisticsQueryKeys.MONTHLY_INVENTORY_COMPARISON, tenant?.id],
		queryFn: () => StatisticsService.getMonthlyInventoryComparison(tenant?.id),
		refetchInterval: POLLING_INTERVAL,
		enabled: !!tenant?.id,
		select: (response) => response.metadata
	})
}

export const useGetAnnualInoutboundOverviewQuery = (year: number) => {
	const { data: tenant } = useGetTenantByFactory()

	return useQuery({
		queryKey: [StatisticsQueryKeys.ANNUAL_INOUTBOUND_OVERVIEW, year, tenant?.id],
		queryFn: () => StatisticsService.getAnnualInoutboundOverview(tenant?.id, { 'year:eq': year }),
		refetchInterval: POLLING_INTERVAL,
		enabled: !!tenant?.id,
		select: (response): IAnnuallyInOutboundStatistics[] => response.metadata
	})
}

export const useGetDailyAssemblyProductivityQuery = () => {
	const { data: tenant } = useGetTenantByFactory()

	return useQuery({
		queryKey: [StatisticsQueryKeys.ASSEMBLY_PRODUCTIVITY, tenant?.id],
		queryFn: () => StatisticsService.getAssemblyProductivity(tenant?.id),
		refetchInterval: POLLING_INTERVAL,
		enabled: !!tenant?.id,
		select: (response) => response.metadata
	})
}

export const useGetLastSixMonthsNetFlow = () => {
	const { data: tenant } = useGetTenantByFactory()

	return useQuery({
		queryKey: [StatisticsQueryKeys.LAST_6_MONTHS_NET_FLOW, tenant?.id],
		queryFn: () => StatisticsService.getLastSixMonthsNetFlow(tenant?.id),
		refetchInterval: POLLING_INTERVAL,
		enabled: !!tenant?.id,
		select: (response) => response.metadata
	})
}

export const useGetDefectiveGoodsInventoryCompositionQuery = () => {
	const { data: tenant } = useGetTenantByFactory()

	return useQuery({
		queryKey: [StatisticsQueryKeys.DEFECTIVE_GOODS_INVENTORY_COMPOSITION, tenant?.id],
		queryFn: () => StatisticsService.getDefectiveGoodsInventoryComposition(tenant?.id),
		refetchInterval: POLLING_INTERVAL,
		enabled: !!tenant?.id,
		select: (response) => response.metadata
	})
}
