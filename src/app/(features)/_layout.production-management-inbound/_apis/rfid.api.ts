import useQueryParams from '@/common/hooks/use-query-params'
import { RFIDService } from '@/services/rfid.service'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { PMInboundURLSearch } from '..'
import { ProducingProcessSuffix } from '../_constants/index.const'
import { DEFAULT_PROPS, usePageContext } from '../_contexts/-page-context'

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
		queryKey: [PM_EPC_LIST_PROVIDE_TAG, currentPage, selectedOrder],
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
		mutationFn: async (payload: PMInboundURLSearch & { selectedOrder: string }) =>
			RFIDService.updatePMStockMovement(connection, payload.process, payload.selectedOrder),
		onSuccess: () => {
			setCurrentPage(DEFAULT_PROPS.currentPage)
			setSelectedOrder(DEFAULT_PROPS.selectedOrder)
			queryClient.invalidateQueries({ queryKey: [PM_EPC_LIST_PROVIDE_TAG] })
		}
	})
}

export const useDeletePMOrderMutation = () => {
	const { connection, selectedOrder, setCurrentPage, setSelectedOrder, setScannedEpc, setScannedOrders } =
		usePageContext(
			'connection',
			'selectedOrder',
			'setCurrentPage',
			'setSelectedOrder',
			'setScannedEpc',
			'setScannedOrders'
		)
	const { searchParams } = useQueryParams<PMInboundURLSearch>()

	return useMutation({
		mutationKey: [PM_EPC_LIST_PROVIDE_TAG],
		mutationFn: async (params: { process: string; order: string }) => {
			const response = await RFIDService.deleteUnexpectedPMOrder(connection, params)
			return response.metadata // Ensure the correct type is returned
		},
		onSuccess: async () => {
			setCurrentPage(DEFAULT_PROPS.currentPage)
			if (selectedOrder !== DEFAULT_PROPS.selectedOrder) {
				setSelectedOrder(DEFAULT_PROPS.selectedOrder)
				return
			}

			setSelectedOrder(DEFAULT_PROPS.selectedOrder)
			const { metadata } = await RFIDService.fetchPMData(connection, {
				page: DEFAULT_PROPS.currentPage,
				...searchParams
			})
			setScannedEpc(metadata?.epcs)
			setScannedOrders(metadata?.orders)
		}
	})
}
