import { RFIDService } from '@/services/rfid.service'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ProducingProcessSuffix } from '../_constants/index.const'
import { usePageContext } from '../_contexts/-page-context'

// * API Query Keys
export const PM_EPC_LIST_PROVIDE_TAG = 'PM_EPC_LIST'

// * Fallback order value if it's null
export const FALLBACK_ORDER_VALUE = 'Unknown'

export type FetchEpcQueryKey = [typeof PM_EPC_LIST_PROVIDE_TAG, number, string]

export const useGetEpcQuery = (process: ProducingProcessSuffix) => {
	const { currentPage, connection, scanningStatus } = usePageContext('currentPage', 'connection', 'scanningStatus')

	return useQuery({
		queryKey: [PM_EPC_LIST_PROVIDE_TAG, connection],
		queryFn: async () => RFIDService.fetchPMData(connection, process, currentPage),
		enabled: !!connection && scanningStatus === 'disconnected',
		select: (response) => response.metadata
	})
}

export const useUpdateStockMutation = () => {
	const queryClient = useQueryClient()
	const { connection } = usePageContext('connection')

	return useMutation({
		mutationKey: [PM_EPC_LIST_PROVIDE_TAG, connection],
		mutationFn: async (payload: Array<string>) => RFIDService.updatePMStockMovement(connection, payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [PM_EPC_LIST_PROVIDE_TAG] })
		}
	})
}

export const useDeletePMOrderMutation = () => {
	const queryClient = useQueryClient()
	const { connection } = usePageContext('connection')

	return useMutation({
		mutationKey: [PM_EPC_LIST_PROVIDE_TAG, connection],
		mutationFn: async (orderCode: string) => RFIDService.deleteUnexpectedPMOrder(connection, orderCode),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [PM_EPC_LIST_PROVIDE_TAG] })
		}
	})
}
