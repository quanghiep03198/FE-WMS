import { IAnnuallyInOutboundStatistics } from '@/common/types/entities'
import { StatisticsService } from '@/services/statistics.service'
import { useQuery } from '@tanstack/react-query'
import { useGetTenantByFactory } from '../../-hooks/use-tenacy-asm'

export enum StatisticsQueryKeys {
	MONTHLY_INVENTORY_COMPARISON = 'MONTHLY_INVENTORY_COMPARISON',
	MONTHLY_DEFECTIVE_COMPARISON = 'MONTHLY_DEFECTIVE_COMPARISON',
	ANNUAL_INOUTBOUND_OVERVIEW = 'ANNUAL_INOUTBOUND_OVERVIEW',
	ASSEMBLY_PRODUCTIVITY = 'ASSEMBLY_PRODUCTIVITY'
}

export const useGetStatisticsQuery = () => {
	const { data: tenant } = useGetTenantByFactory()

	return useQuery({
		queryKey: [StatisticsQueryKeys.MONTHLY_INVENTORY_COMPARISON, tenant?.id],
		queryFn: () => StatisticsService.getMonthlyInventoryComparison(tenant?.id),
		refetchInterval: 5000,
		enabled: !!tenant?.id,
		select: (response) => response.metadata
	})
}

export const useGetAnnualInoutboundOverviewQuery = () => {
	const { data: tenant } = useGetTenantByFactory()

	return useQuery({
		queryKey: [StatisticsQueryKeys.ANNUAL_INOUTBOUND_OVERVIEW, tenant?.id],
		queryFn: () => StatisticsService.getAnnualInoutboundOverview(tenant?.id),
		refetchInterval: 15_000,
		enabled: !!tenant?.id,
		select: (response): IAnnuallyInOutboundStatistics[] => response.metadata
	})
}

export const useGetDailyAssemblyProductivityQuery = () => {
	const { data: tenant } = useGetTenantByFactory()

	return useQuery({
		queryKey: [StatisticsQueryKeys.ASSEMBLY_PRODUCTIVITY, tenant?.id],
		queryFn: () => StatisticsService.getAssemblyProductivity(tenant?.id),
		select: (response) => response.metadata
	})
}
