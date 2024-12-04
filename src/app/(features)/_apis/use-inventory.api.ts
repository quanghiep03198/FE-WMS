import { InventoryService } from '@/services/inventory.service'
import { useQuery } from '@tanstack/react-query'

export const useGetDailyInboundReport = (tenantId: string) => {
	return useQuery({
		queryKey: ['DAILY_INBOUND'],
		queryFn: async () => await InventoryService.getDailyInboundReport(tenantId),
		enabled: !!tenantId,
		refetchOnMount: true,
		select: (response) => response.metadata
	})
}
