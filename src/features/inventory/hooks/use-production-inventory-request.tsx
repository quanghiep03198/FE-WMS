import { InventoryService } from '@features/inventory/services/inventory.service'
import useQueryParams from '@hooks/use-query-params'
import { useQuery } from '@tanstack/react-query'
import { isEmpty } from 'lodash-es'

export enum ProductionInventoryQueryKeys {
	PRODUCTION_INVENTORY = 'PRODUCTION_INVENTORY'
}

export const useGetProductionInventoryQuery = () => {
	const { searchParams } = useQueryParams<Record<'brand_name' | 'shoes_style' | 'color', string>>()

	return useQuery({
		queryKey: [ProductionInventoryQueryKeys.PRODUCTION_INVENTORY, searchParams],
		queryFn: () => InventoryService.getProductionInventoryReport(searchParams),
		enabled: !isEmpty(searchParams),
		select: (response) => response.metadata
	})
}
