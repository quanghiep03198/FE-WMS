import { InventoryService } from '@/services/inventory.service'
import { useQuery } from '@tanstack/react-query'
import { isEmpty } from 'lodash'

export const useGetProductionInventoryQuery = (
	tenantId: string,
	searchParams: Record<'shoes_style' | 'color', string>
) => {
	return useQuery({
		queryKey: ['PRODUCTION_INVENTORY', tenantId, searchParams],
		queryFn: () => InventoryService.getProductionInventoryReport(tenantId, searchParams),
		enabled: tenantId && !isEmpty(searchParams),
		select: (response) => response.metadata
	})
}
