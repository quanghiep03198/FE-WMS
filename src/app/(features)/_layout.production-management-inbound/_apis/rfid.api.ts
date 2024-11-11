import { RFIDService } from '@/services/rfid.service'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { PMInboundSearch } from '..'
import { ProducingProcessSuffix } from '../_constants/index.const'
import { usePageContext } from '../_contexts/-page-context'

// * API Query Keys
export const PM_EPC_LIST_PROVIDE_TAG = 'PM_EPC_LIST'

// * Fallback order value if it's null
export const FALLBACK_ORDER_VALUE = 'Unknown'

export const useGetEpcQuery = (process: ProducingProcessSuffix) => {
	const { currentPage, selectedOrder, connection, scanningStatus } = usePageContext(
		'currentPage',
		'selectedOrder',
		'connection',
		'scanningStatus'
	)
	return useQuery({
		queryKey: [PM_EPC_LIST_PROVIDE_TAG],
		queryFn: async () => {
			return await RFIDService.fetchPMData(connection, { page: currentPage, process, selected_order: selectedOrder })
		},
		enabled: !!connection && scanningStatus === 'disconnected',
		select: (response) => response.metadata
	})
}

export const useUpdateStockMutation = () => {
	const queryClient = useQueryClient()
	const { connection, setCurrentPage, setSelectedOrder } = usePageContext(
		'connection',
		'setCurrentPage',
		'setSelectedOrder'
	)

	return useMutation({
		mutationKey: [PM_EPC_LIST_PROVIDE_TAG],
		mutationFn: async (payload: PMInboundSearch & { selectedOrder: string }) =>
			RFIDService.updatePMStockMovement(connection, payload.process, payload.selectedOrder),
		onSuccess: () => {
			setCurrentPage(1)
			setSelectedOrder('all')
			queryClient.invalidateQueries({ queryKey: [PM_EPC_LIST_PROVIDE_TAG] })
		}
	})
}

export const useDeletePMOrderMutation = () => {
	const queryClient = useQueryClient()
	const { connection, setCurrentPage, setSelectedOrder } = usePageContext(
		'connection',
		'setCurrentPage',
		'setSelectedOrder'
	)

	return useMutation({
		mutationKey: [PM_EPC_LIST_PROVIDE_TAG],
		mutationFn: async (params: { process: string; order: string }) => {
			const response = await RFIDService.deleteUnexpectedPMOrder(connection, params)
			return response.metadata // Ensure the correct type is returned
		},
		onSuccess: (data: Pick<Pagination<any>, 'totalDocs' | 'totalPages'>) => {
			setCurrentPage(1)
			setSelectedOrder('all')
			queryClient.invalidateQueries({ queryKey: [PM_EPC_LIST_PROVIDE_TAG], exact: false })
		}
	})
}
