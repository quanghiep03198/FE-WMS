import { InventoryService } from '@/services/inventory.service'
import { useQuery } from '@tanstack/react-query'
import { isEmpty } from 'lodash'

export enum ProductionInventoryQueryKeys {
	PRODUCTION_INVENTORY = 'PRODUCTION_INVENTORY'
}

export const useGetProductionInventoryQuery = (
	tenantId: string,
	searchParams: Record<'brand_name' | 'shoes_style' | 'color', string>
) => {
	return useQuery({
		queryKey: [ProductionInventoryQueryKeys.PRODUCTION_INVENTORY, tenantId, searchParams],
		queryFn: () => InventoryService.getProductionInventoryReport(tenantId, searchParams),
		enabled: tenantId && !isEmpty(searchParams),
		select: (response) => response.metadata
	})
}
