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
	console.log(searchParams)
	const { currentPage, selectedOrder, connection, scanningStatus } = usePageContext(
		'currentPage',
		'selectedOrder',
		'connection',
		'scanningStatus'
	)

	return useQuery({
		queryKey: [PM_EPC_LIST_PROVIDE_TAG, connection, currentPage, selectedOrder, searchParams],
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
	const { connection, currentPage, selectedOrder, setCurrentPage, setSelectedOrder } = usePageContext(
		'connection',
		'currentPage',
		'selectedOrder',
		'setCurrentPage',
		'setSelectedOrder'
	)
	const { searchParams } = useQueryParams<PMInboundURLSearch>()
	const invalidateQueries = useInvalidateQueries()

	return useMutation({
		mutationKey: [PM_EPC_LIST_PROVIDE_TAG, connection, currentPage, selectedOrder, searchParams],
		mutationFn: async (payload: PMInboundURLSearch & { selectedOrder: string }) =>
			RFIDService.updatePMStockMovement(connection, payload.process, payload.selectedOrder),
		onSuccess: () => {
			setCurrentPage(DEFAULT_PROPS.currentPage)
			setSelectedOrder(DEFAULT_PROPS.selectedOrder)
			invalidateQueries()
		}
	})
}

export const useDeletePMOrderMutation = () => {
	const { connection, currentPage, selectedOrder, setScannedEpc, setScannedOrders, setCurrentPage, setSelectedOrder } =
		usePageContext(
			'connection',
			'currentPage',
			'selectedOrder',
			'setCurrentPage',
			'setScannedEpc',
			'setScannedOrders',
			'setCurrentPage',
			'setSelectedOrder'
		)
	const queryClient = useQueryClient()
	const { searchParams } = useQueryParams<PMInboundURLSearch>()

	return useMutation({
		mutationKey: [PM_EPC_LIST_PROVIDE_TAG, connection, currentPage, selectedOrder, searchParams],
		mutationFn: async (params: DeletePMOrderParams) => {
			const response = await RFIDService.deleteUnexpectedPMOrder(connection, params)
			return response.metadata // Ensure the correct type is returned
		},
		onSuccess: async () => {
			const { metadata } = await RFIDService.fetchPMData(connection, {
				page: DEFAULT_PROPS.currentPage,
				'mo_no.eq': DEFAULT_PROPS.selectedOrder,
				'producing_process.eq': searchParams.process
			})
			queryClient.setQueryData(
				[PM_EPC_LIST_PROVIDE_TAG, connection, DEFAULT_PROPS.currentPage, DEFAULT_PROPS.selectedOrder, searchParams],
				metadata
			)
			setCurrentPage(DEFAULT_PROPS.currentPage)
			setSelectedOrder(DEFAULT_PROPS.selectedOrder)
			setScannedEpc(metadata?.epcs ?? DEFAULT_PROPS.scannedEpc)
			setScannedOrders(metadata?.orders ?? DEFAULT_PROPS.scannedOrders)
		}
	})
}

const useInvalidateQueries = () => {
	const { currentPage, selectedOrder, connection } = usePageContext(
		'currentPage',
		'selectedOrder',
		'connection',
		'scanningStatus'
	)
	const queryClient = useQueryClient()
	const { searchParams } = useQueryParams()

	return () => {
		queryClient.invalidateQueries({
			queryKey: [PM_EPC_LIST_PROVIDE_TAG, connection, currentPage, selectedOrder, searchParams],
			exact: false,
			type: 'all',
			refetchType: 'all'
		})
	}
}
