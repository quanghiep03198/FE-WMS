import useQueryParams from '@/common/hooks/use-query-params'
import { RFIDService } from '@/services/rfid.service'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { DEFAULT_PROPS, usePageContext } from '../_contexts/-page-context'
import { PMInboundURLSearch } from '../_schemas/pm-inbound.schema'
import { DeletePMOrderParams } from '../_types'

// * API Query Keys
export const PM_EPC_LIST_PROVIDE_TAG = 'PM_EPC_LIST'

// * Fallback order value if it's null
export const FALLBACK_ORDER_VALUE = 'Unknown'

export const useGetEpcQuery = () => {
	const { searchParams } = useQueryParams<PMInboundURLSearch>()
	const { currentPage, selectedOrder, connection, scanningStatus } = usePageContext(
		'currentPage',
		'selectedOrder',
		'connection',
		'scanningStatus'
	)

	return useQuery({
		queryKey: [PM_EPC_LIST_PROVIDE_TAG, connection, searchParams],
		queryFn: async () => {
			return await RFIDService.fetchPMData(connection, {
				page: currentPage,
				'producing_process.eq': searchParams.process,
				'mo_no.eq': selectedOrder
			})
		},
		enabled: !!connection && scanningStatus === 'disconnected',
		select: (response) => response.metadata
	})
}

export const useUpdateStockMutation = () => {
	const { connection, setCurrentPage, setSelectedOrder } = usePageContext(
		'connection',
		'setCurrentPage',
		'setSelectedOrder'
	)
	const { searchParams } = useQueryParams<PMInboundURLSearch>()

	return useMutation({
		mutationKey: [PM_EPC_LIST_PROVIDE_TAG, connection, searchParams],
		mutationFn: async (payload: PMInboundURLSearch & { selectedOrder: string }) =>
			RFIDService.updatePMStockMovement(connection, payload.process, payload.selectedOrder),
		onSuccess: () => {
			setSelectedOrder(DEFAULT_PROPS.selectedOrder)
			setCurrentPage(DEFAULT_PROPS.currentPage)
		}
	})
}

export const useDeletePMOrderMutation = () => {
	const { connection } = usePageContext('connection')
	const invalidateQuery = useInvalidateQuery()
	const { searchParams } = useQueryParams<PMInboundURLSearch>()

	return useMutation({
		mutationKey: [PM_EPC_LIST_PROVIDE_TAG, connection, searchParams],
		mutationFn: async (params: DeletePMOrderParams) => {
			const response = await RFIDService.deleteUnexpectedPMOrder(connection, params)
			return response.metadata // Ensure the correct type is returned
		},
		onSuccess: invalidateQuery
	})
}

const useInvalidateQuery = () => {
	const { connection, setCurrentPage, setSelectedOrder } = usePageContext(
		'connection',
		'setCurrentPage',
		'setSelectedOrder'
	)
	const queryClient = useQueryClient()
	const { searchParams } = useQueryParams()

	return async () => {
		setCurrentPage(null)
		setSelectedOrder(DEFAULT_PROPS.selectedOrder)
		queryClient.invalidateQueries({
			queryKey: [PM_EPC_LIST_PROVIDE_TAG, connection, searchParams],
			exact: false,
			type: 'all',
			refetchType: 'all'
		})
	}
}
