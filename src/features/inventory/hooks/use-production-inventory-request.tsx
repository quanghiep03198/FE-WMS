import { InventoryService } from '@/features/inventory/services/inventory.service'
import useQueryParams from '@hooks/use-query-params'
import { useQuery } from '@tanstack/react-query'
import { isEmpty } from 'lodash-es'
import { useGetTenantByFactory } from '../../tenancy/hooks/use-tenacy-request'

export enum ProductionInventoryQueryKeys {
	PRODUCTION_INVENTORY = 'PRODUCTION_INVENTORY'
}

export const useGetProductionInventoryQuery = () => {
	const { data: tenant } = useGetTenantByFactory()
	const tenantId = tenant?.id

	const { searchParams } = useQueryParams<Record<'brand_name' | 'shoes_style' | 'color', string>>()

	return useQuery({
		queryKey: [ProductionInventoryQueryKeys.PRODUCTION_INVENTORY, tenantId, searchParams],
		queryFn: () => InventoryService.getProductionInventoryReport(tenantId, searchParams),
		enabled: tenantId && !isEmpty(searchParams),
		select: (response) => response.metadata
	})
}
