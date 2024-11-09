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
	const { currentPage, selectedOrder, connection, scanningStatus } = usePageContext(
		'currentPage',
		'selectedOrder',
		'connection',
		'scanningStatus'
	)
	console.log(selectedOrder)
	return useQuery({
		queryKey: [PM_EPC_LIST_PROVIDE_TAG, connection],
		queryFn: async () => {
			return await RFIDService.fetchPMData(connection, { page: currentPage, process, selected_order: selectedOrder })
		},
		enabled: !!connection && scanningStatus === 'disconnected',
		select: (response) => response.metadata
	})
}

export const useUpdateStockMutation = () => {
	const queryClient = useQueryClient()
	const { connection, setCurrentPage } = usePageContext('connection', 'setCurrentPage')

	return useMutation({
		mutationKey: [PM_EPC_LIST_PROVIDE_TAG, connection],
		mutationFn: async (payload: Array<string>) => RFIDService.updatePMStockMovement(connection, payload),
		onSuccess: () => {
			setCurrentPage(1)
			queryClient.invalidateQueries({ queryKey: [PM_EPC_LIST_PROVIDE_TAG] })
		}
	})
}

export const useDeletePMOrderMutation = () => {
	const queryClient = useQueryClient()
	const { connection, currentPage, setCurrentPage } = usePageContext('connection', 'currentPage', 'setCurrentPage')

	return useMutation({
		mutationKey: [PM_EPC_LIST_PROVIDE_TAG, connection],
		mutationFn: async (params: { process: string; order: string }) => {
			const response = await RFIDService.deleteUnexpectedPMOrder(connection, params)
			return response.metadata // Ensure the correct type is returned
		},
		onSuccess: (data: Pick<Pagination<any>, 'totalDocs' | 'totalPages'>) => {
			setCurrentPage(currentPage > data?.totalPages ? data?.totalPages : currentPage)
			queryClient.invalidateQueries({ queryKey: [PM_EPC_LIST_PROVIDE_TAG] })
		}
	})
}
