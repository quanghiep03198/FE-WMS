import { OrderService } from '@/services/order.service'
import { useQuery } from '@tanstack/react-query'

export const useSearchCommandNumberQuery = (searchTerm: string) => {
	return useQuery({
		queryKey: ['SEARCH_COMMAND_NUMBER', searchTerm],
		queryFn: async () => await OrderService.searchCommandNumber({ q: searchTerm }),
		select: (response) => {
			if (!Array.isArray(response.metadata)) return []
			return response.metadata
		}
	})
}

export const useSearchPurchaseOrderQuery = (searchTerm: string) => {
	return useQuery({
		queryKey: ['SEARCH_PURCHASE_ORDER', searchTerm],
		queryFn: async () => await OrderService.searchPurchaseOrder({ q: searchTerm }),
		select: (response) => {
			if (!Array.isArray(response.metadata)) return []
			return response.metadata
		}
	})
}

export const useGetCommandNumberDetailQuery = (commandNumber: string) => {
	return useQuery({
		queryKey: ['COMMAND_NUMBER_DETAIL', commandNumber],
		queryFn: async () => await OrderService.getCommandNumberDetail(commandNumber),
		enabled: !!commandNumber,
		refetchOnMount: true,
		select: (response) => response.metadata
	})
}
