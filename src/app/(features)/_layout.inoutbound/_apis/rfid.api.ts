import { DepartmentService } from '@/services/department.service'
import { RFIDService } from '@/services/rfid.service'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { DEFAULT_PROPS, usePageContext } from '../_contexts/-page-context'
import { InoutboundPayload } from '../_schemas/epc-inoutbound.schema'
import { type ExchangeEpcPayload } from '../_schemas/exchange-epc.schema'

// * API Query Keys
export const INOUTBOUND_DEPT_PROVIDE_TAG = 'SHAPING_DEPARTMENT'
export const ORDER_DETAIL_PROVIDE_TAG = 'ORDER_DETAIL'
export const EPC_LIST_PROVIDE_TAG = 'EPC_LIST'

// * Fallback order value if it's null
export const FALLBACK_ORDER_VALUE = 'Unknown'

export type FetchEpcQueryKey = [typeof EPC_LIST_PROVIDE_TAG, number, string]

export const useGetEpcQuery = () => {
	const { currentPage, selectedOrder, connection, scanningStatus } = usePageContext(
		'currentPage',
		'selectedOrder',
		'connection',
		'scanningStatus'
	)

	return useQuery({
		queryKey: [EPC_LIST_PROVIDE_TAG, connection],
		queryFn: async () => RFIDService.fetchEpcManually(connection, currentPage, selectedOrder),
		enabled: !!connection && scanningStatus === 'disconnected',
		select: (response) => response.metadata
	})
}

export const useGetOrderDetail = () => {
	const { connection, scanningStatus } = usePageContext('connection', 'scanningStatus')

	return useQuery({
		queryKey: [ORDER_DETAIL_PROVIDE_TAG, connection],
		queryFn: async () => await RFIDService.getOrderDetail(connection),
		enabled: !!connection && scanningStatus === 'disconnected',
		select: (response) => response.metadata
	})
}

export const useSearchOrderQuery = (orderTarget: string, searchTerm: string) => {
	const { connection } = usePageContext('connection')

	return useQuery({
		queryKey: ['EXCHANGABLE_ORDER', orderTarget],
		queryFn: async () => await RFIDService.searchExchangableOrder(connection, orderTarget, searchTerm),
		enabled: false,
		select: (response) => response.metadata
	})
}

export const useGetShapingProductLineQuery = () => {
	return useQuery({
		queryKey: [INOUTBOUND_DEPT_PROVIDE_TAG],
		queryFn: DepartmentService.getShapingDepartments,
		select: (response) => response.metadata
	})
}

export const useDeleteOrderMutation = () => {
	const invalidateQueries = useInvalidateQueries()
	const { connection, setSelectedOrder, setCurrentPage } = usePageContext(
		'connection',
		'setSelectedOrder',
		'setCurrentPage'
	)

	return useMutation({
		mutationFn: async (orderCode: string) => {
			return await RFIDService.deleteUnexpectedOrder(connection, orderCode)
		},
		onSuccess: () => {
			setCurrentPage(null)
			setSelectedOrder(DEFAULT_PROPS.selectedOrder)
			invalidateQueries()
		}
	})
}

export const useUpdateStockMutation = () => {
	const invalidateQueries = useInvalidateQueries()
	const { connection, setSelectedOrder, setCurrentPage } = usePageContext(
		'connection',
		'setSelectedOrder',
		'setCurrentPage'
	)

	return useMutation({
		mutationFn: (payload: InoutboundPayload) => RFIDService.updateStockMovement(connection, payload),
		onSuccess: () => {
			setCurrentPage(null)
			setSelectedOrder(DEFAULT_PROPS.selectedOrder)
			invalidateQueries()
		}
	})
}

export const useExchangeEpcMutation = () => {
	const invalidateQueries = useInvalidateQueries()
	const { connection, setSelectedOrder, setCurrentPage } = usePageContext(
		'connection',
		'setSelectedOrder',
		'setCurrentPage'
	)

	return useMutation({
		mutationFn: async (payload: ExchangeEpcPayload) => await RFIDService.exchangeEpc(connection, payload),
		onSuccess: () => {
			setCurrentPage(null)
			setSelectedOrder(DEFAULT_PROPS.selectedOrder)
			invalidateQueries()
		}
	})
}

const useInvalidateQueries = () => {
	const queryClient = useQueryClient()
	const { connection } = usePageContext('connection')

	return () => {
		queryClient.invalidateQueries({
			queryKey: [ORDER_DETAIL_PROVIDE_TAG, connection],
			exact: false,
			type: 'all',
			refetchType: 'all'
		})
		queryClient.invalidateQueries({
			queryKey: [EPC_LIST_PROVIDE_TAG, connection],
			exact: false,
			type: 'all',
			refetchType: 'all'
		})
	}
}
