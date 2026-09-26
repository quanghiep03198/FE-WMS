import { OrderService } from '@features/order/services/order.service'
import { useQuery } from '@tanstack/react-query'

export enum OrderQueryKeys {
	SEARCH_MANUFACTURING_ORDER = 'SEARCH_MANUFACTURING_ORDER',
	SEARCH_PURCHASE_ORDER = 'SEARCH_PURCHASE_ORDER',
	PURCHASE_ORDER_INFO = 'PURCHASE_ORDER_INFO',
	MANUFACTURING_ORDER_INFO = 'MANUFACTURING_ORDER_INFO'
}

export const useSearchManufacturingOrderQuery = (searchTerm: string, shouldFetch = true) => {
	return useQuery({
		queryKey: [OrderQueryKeys.SEARCH_MANUFACTURING_ORDER, searchTerm],
		queryFn: async () => await OrderService.searchManufacturingOrder({ q: searchTerm }),
		enabled: shouldFetch,
		select: (response) => {
			if (!Array.isArray(response.metadata)) return []
			return response.metadata
		}
	})
}

export const useSearchPurchaseOrderQuery = (searchTerm: string, shouldFetch = true, shouldFilterAllBrands = false) => {
	return useQuery({
		queryKey: [OrderQueryKeys.SEARCH_PURCHASE_ORDER, searchTerm, shouldFilterAllBrands],
		queryFn: async () =>
			await OrderService.searchPurchaseOrder({
				q: searchTerm,
				filter_all_brands: shouldFilterAllBrands
			}),
		enabled: shouldFetch,
		select: (response) => {
			if (!Array.isArray(response.metadata)) return []
			return response.metadata.map((item) => ({ ...item, disabled: Boolean(item?.is_completed) }))
		}
	})
}

export const useGetManufacturingOrderQuery = (manufacturingOrder: string) => {
	return useQuery({
		queryKey: [OrderQueryKeys.MANUFACTURING_ORDER_INFO, manufacturingOrder],
		queryFn: async () => await OrderService.getOneManufacturingOrder(manufacturingOrder),
		enabled: !!manufacturingOrder,
		refetchOnMount: true,
		select: (response) => response.metadata
	})
}
