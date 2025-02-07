import { useAuth } from '@/common/hooks/use-auth'
import { DepartmentService } from '@/services/department.service'
import { RFIDService } from '@/services/rfid.service'
import { useMutation, useQuery } from '@tanstack/react-query'
import { DEFAULT_PROPS, usePageContext } from '../_contexts/-page-context'
import { InoutboundPayload } from '../_schemas/epc-inoutbound.schema'
import { type ExchangeEpcPayload } from '../_schemas/exchange-epc.schema'
import { SearchCustOrderParams } from '../_types'

// * API Query Keys
export const SHAPING_DEPT_PROVIDE_TAG = 'SHAPING_DEPARTMENT'
export const FP_ORDER_DETAIL_PROVIDE_TAG = 'ORDER_DETAIL'
export const FP_EPC_LIST_PROVIDE_TAG = 'FP_EPC_LIST'

// * Fallback order value if it's null
export const FALLBACK_ORDER_VALUE = 'Unknown'

export type FetchEpcQueryKey = [typeof FP_EPC_LIST_PROVIDE_TAG, number, string]

export const useGetEpcQuery = () => {
	const { currentPage, selectedOrder, connection } = usePageContext(
		'currentPage',
		'selectedOrder',
		'connection',
		'scanningStatus'
	)

	return useQuery({
		queryKey: [FP_EPC_LIST_PROVIDE_TAG, connection, currentPage, selectedOrder],
		queryFn: async () =>
			RFIDService.fetchFPInventoryData(connection, {
				_page: currentPage,
				'mo_no.eq': selectedOrder
			}),
		enabled: !!connection,
		select: (response) => response.metadata
	})
}

export const useGetOrderDetail = () => {
	const { connection, scanningStatus } = usePageContext('connection', 'scanningStatus')

	return useQuery({
		queryKey: [FP_ORDER_DETAIL_PROVIDE_TAG, connection],
		queryFn: async () => await RFIDService.getFPOrderDetail(connection),
		enabled: !!connection && scanningStatus === 'disconnected',
		select: (response) => response.metadata
	})
}

export const useSearchOrderQuery = (params: SearchCustOrderParams) => {
	const { user } = useAuth()

	return useQuery({
		queryKey: ['EXCHANGABLE_ORDER', user?.company_code, params],
		queryFn: async () => await RFIDService.searchExchangableFPOrder(params),
		enabled: false,
		select: (response) => response.metadata
	})
}

export const useGetShapingProductLineQuery = () => {
	return useQuery({
		queryKey: [SHAPING_DEPT_PROVIDE_TAG],
		queryFn: DepartmentService.getShapingDepartments,
		select: (response) => response.metadata
	})
}

export const useDeleteEpcMutation = () => {
	const invalidateQueries = useInvalidateQueries()
	const { connection, setSelectedOrder, setCurrentPage } = usePageContext(
		'connection',
		'setSelectedOrder',
		'setCurrentPage'
	)

	return useMutation({
		mutationFn: async (filters: Record<string, string | number>) =>
			await RFIDService.deleteScannedEpcs(connection, filters),
		onSuccess: () => {
			setCurrentPage(null)
			setSelectedOrder(DEFAULT_PROPS.selectedOrder)
			invalidateQueries()
		}
	})
}

export const useUpdateStockMutation = () => {
	const invalidateQueries = useInvalidateQueries()
	const { connection, selectedOrder, setSelectedOrder, setCurrentPage } = usePageContext(
		'connection',
		'selectedOrder',
		'setSelectedOrder',
		'setCurrentPage'
	)

	return useMutation({
		mutationFn: (payload: InoutboundPayload) => RFIDService.updateFPStockMovement(connection, selectedOrder, payload),
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
	const { refetch: refetchScannedEpcs } = useGetEpcQuery()
	const { refetch: refetchOrderDetail } = useGetOrderDetail()
	return () => {
		refetchScannedEpcs()
		refetchOrderDetail()
	}
}
