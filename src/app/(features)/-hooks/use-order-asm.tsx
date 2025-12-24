import { OrderService } from '@/services/order.service'
import { useQuery } from '@tanstack/react-query'
import { useGetTenantByFactory } from './use-tenacy-asm'

export enum OrderQueryKeys {
	SEARCH_COMMAND_NUMBER = 'SEARCH_COMMAND_NUMBER',
	SEARCH_PURCHASE_ORDER = 'SEARCH_PURCHASE_ORDER',
	COMMAND_NUMBER_DETAIL = 'COMMAND_NUMBER_DETAIL'
}

export const useSearchCommandNumberQuery = (searchTerm: string, shouldFetch = true) => {
	const { data: currentTenant } = useGetTenantByFactory()

	return useQuery({
		queryKey: [OrderQueryKeys.SEARCH_COMMAND_NUMBER, currentTenant?.id, searchTerm],
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
		queryKey: [OrderQueryKeys.SEARCH_PURCHASE_ORDER, currentTenant?.id, searchTerm, shouldFilterAllBrands],
		queryFn: async () =>
			await OrderService.searchPurchaseOrder(currentTenant?.id, {
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

export const useGetCommandNumberDetailQuery = (commandNumber: string) => {
	return useQuery({
		queryKey: [OrderQueryKeys.COMMAND_NUMBER_DETAIL, commandNumber],
		queryFn: async () => await OrderService.getCommandNumberDetail(commandNumber),
		enabled: !!commandNumber,
		refetchOnMount: true,
		select: (response) => response.metadata
	})
}
