import { OrderService } from '@features/order/services/order.service'
import { queryOptions, useQuery } from '@tanstack/react-query'
import { useGetTenantByFactory } from '../../tenancy/hooks/use-tenacy-request'

export enum OrderQueryKeys {
	SEARCH_MANUFACTURING_ORDER = 'SEARCH_MANUFACTURING_ORDER',
	SEARCH_PURCHASE_ORDER = 'SEARCH_PURCHASE_ORDER',
	PURCHASE_ORDER_INFO = 'PURCHASE_ORDER_INFO',
	MANUFACTURING_ORDER_INFO = 'MANUFACTURING_ORDER_INFO'
}

export const getPurchaseOrderInfoQueryOptions = (purchaseOrder: string) => {
	return queryOptions({
		queryKey: [OrderQueryKeys.PURCHASE_ORDER_INFO, purchaseOrder],
		queryFn: async () => await OrderService.getPurchaseOrderInfo(purchaseOrder),
		staleTime: Infinity
	})
}

export const useSearchManufacturingOrderQuery = (searchTerm: string, shouldFetch = true) => {
	const { data: currentTenant } = useGetTenantByFactory()

	return useQuery({
		queryKey: [OrderQueryKeys.SEARCH_MANUFACTURING_ORDER, currentTenant?.id, searchTerm],
		queryFn: async () => await OrderService.searchCommandNumber(currentTenant?.id, { q: searchTerm }),
		enabled: shouldFetch && !!currentTenant?.id,
		select: (response) => {
			if (!Array.isArray(response.metadata)) return []
			return response.metadata
		}
	})
}

export const useSearchPurchaseOrderQuery = (searchTerm: string, shouldFetch = true, shouldFilterAllBrands = false) => {
	const { data: currentTenant } = useGetTenantByFactory()

	return useQuery({
		queryKey: [OrderQueryKeys.SEARCH_PURCHASE_ORDER, searchTerm, shouldFilterAllBrands],
		queryFn: async () =>
			await OrderService.searchPurchaseOrder({
				q: searchTerm,
				filter_all_brands: shouldFilterAllBrands
			}),
		enabled: shouldFetch && !!currentTenant?.id,
		select: (response) => {
			if (!Array.isArray(response.metadata)) return []
			return response.metadata.map((item) => ({ ...item, disabled: Boolean(item?.is_completed) }))
		}
	})
}

export const useGetManufacturingOrderQuery = (manufacturingOrder: string) => {
	return useQuery({
		queryKey: [OrderQueryKeys.MANUFACTURING_ORDER_INFO, manufacturingOrder],
		queryFn: async () => await OrderService.getManufacturingOrderDetail(manufacturingOrder),
		enabled: !!manufacturingOrder,
		refetchOnMount: true,
		select: (response) => response.metadata
	})
}
