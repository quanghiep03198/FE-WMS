import type { IAnnuallyInOutboundStatistics } from '@features/dashboard/types'
import { useQuery } from '@tanstack/react-query'
import { StatisticsService } from '../services/statistics.service'

export enum StatisticsQueryKeys {
	MONTHLY_INVENTORY_COMPARISON = 'MONTHLY_INVENTORY_COMPARISON',
	LAST_6_MONTHS_NET_FLOW = 'LAST_6_MONTHS_NET_FLOW',
	ANNUAL_INOUTBOUND_OVERVIEW = 'ANNUAL_INOUTBOUND_OVERVIEW',
	DEFECTIVE_GOODS_INVENTORY_COMPOSITION = 'DEFECTIVE_GOODS_INVENTORY_COMPOSITION',
	ASSEMBLY_PRODUCTIVITY = 'ASSEMBLY_PRODUCTIVITY'
}

const POLLING_INTERVAL = 10_000 // 15 seconds

export const useGetStatisticsQuery = () => {
	return useQuery({
		queryKey: [StatisticsQueryKeys.MONTHLY_INVENTORY_COMPARISON],
		queryFn: () => StatisticsService.getMonthlyInventoryComparison(),
		refetchInterval: POLLING_INTERVAL,
		select: (response) => response.metadata
	})
}

export const useGetAnnualInoutboundOverviewQuery = (year: number) => {
	return useQuery({
		queryKey: [StatisticsQueryKeys.ANNUAL_INOUTBOUND_OVERVIEW, year],
		queryFn: () => StatisticsService.getAnnualInoutboundOverview({ 'year:eq': year }),
		refetchInterval: POLLING_INTERVAL,
		select: (response): IAnnuallyInOutboundStatistics[] => response.metadata ?? []
	})
}

export const useGetDailyAssemblyProductivityQuery = () => {
	return useQuery({
		queryKey: [StatisticsQueryKeys.ASSEMBLY_PRODUCTIVITY],
		queryFn: () => StatisticsService.getAssemblyProductivity(),
		refetchInterval: POLLING_INTERVAL,

		select: (response) => response.metadata
	})
}

export const useGetLastSixMonthsNetFlow = () => {
	return useQuery({
		queryKey: [StatisticsQueryKeys.LAST_6_MONTHS_NET_FLOW],
		queryFn: () => StatisticsService.getLastSixMonthsNetFlow(),
		refetchInterval: POLLING_INTERVAL,
		select: (response) => response.metadata
	})
}

export const useGetDefectiveGoodsInventoryCompositionQuery = () => {
	return useQuery({
		queryKey: [StatisticsQueryKeys.DEFECTIVE_GOODS_INVENTORY_COMPOSITION],
		queryFn: () => StatisticsService.getDefectiveGoodsInventoryComposition(),
		refetchInterval: POLLING_INTERVAL,
		select: (response) => response.metadata
	})
}
