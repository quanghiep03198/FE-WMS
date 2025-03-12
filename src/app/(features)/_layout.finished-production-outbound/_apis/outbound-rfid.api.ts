import { RFIDService } from '@/services/rfid.service'
import { useMutation, useQuery } from '@tanstack/react-query'
import { usePageContext } from '../_contexts/-page-context'

export const OUTBOUND_EPC_LIST_PROVIDE_TAG = 'OUTBOUND_EPC_LIST'

export const useGetOutboundEpcQuery = () => {
	const { currentPage } = usePageContext()

	return useQuery({
		queryKey: [OUTBOUND_EPC_LIST_PROVIDE_TAG, currentPage],
		queryFn: async () => RFIDService.fetchNextOutboundEpc({ _page: currentPage }),
		enabled: false,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		select: (response) => response.metadata
	})
}

export const useDeleteEpcMutation = () => {
	const { currentPage } = usePageContext()

	return useMutation({
		mutationKey: [OUTBOUND_EPC_LIST_PROVIDE_TAG, currentPage],
		mutationFn: async (filters: Record<string, string | number | boolean>) =>
			await RFIDService.deleteScannedOutboundEpcs(filters)
	})
}

export const useUpdateStockOutMutation = () => {
	const { currentPage } = usePageContext()

	return useMutation({
		mutationKey: [OUTBOUND_EPC_LIST_PROVIDE_TAG, currentPage],
		mutationFn: async (payload: any) => await RFIDService.updateFPStockOut(payload)
	})
}
