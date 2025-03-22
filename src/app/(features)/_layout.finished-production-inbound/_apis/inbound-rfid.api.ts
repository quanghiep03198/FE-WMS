/* eslint-disable @tanstack/query/exhaustive-deps */
import { useAuth } from '@/common/hooks/use-auth'
import { DepartmentService } from '@/services/department.service'
import { RFIDService } from '@/services/rfid.service'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { DEFAULT_PROPS, usePageContext } from '../_contexts/-page-context'
import { InoutboundPayload } from '../_schemas/epc-inoutbound.schema'
import { type ExchangeEpcPayload } from '../_schemas/exchange-epc.schema'
import { SearchCustOrderParams } from '../_types'

// * API Query Keys
export const SHAPING_DEPT_PROVIDE_TAG = 'SHAPING_DEPARTMENT'
export const FP_ORDER_DETAIL_PROVIDE_TAG = 'INBOUND_ORDER_DETAIL'
export const FP_EPC_LIST_PROVIDE_TAG = 'INBOUND_EPC_LIST'

// * Fallback order value if it's null
export const FALLBACK_ORDER_VALUE = 'Unknown'

export type FetchEpcQueryKey = [typeof FP_EPC_LIST_PROVIDE_TAG, number, string]

export const useGetInboundEpcQuery = () => {
	const queryClient = useQueryClient()

	const { currentPage, selectedOrder, scanningStatus } = usePageContext(
		'currentPage',
		'selectedOrder',
		'scanningStatus'
	)

	useEffect(() => {
		if (typeof scanningStatus === 'undefined') {
			queryClient.removeQueries({ queryKey: [FP_ORDER_DETAIL_PROVIDE_TAG] })
		}
	}, [scanningStatus])

	return useQuery({
		queryKey: [FP_EPC_LIST_PROVIDE_TAG],
		queryFn: async () =>
			RFIDService.fetchNextInboundEpc({
				_page: currentPage,
				'mo_no.eq': selectedOrder
			}),
		enabled: scanningStatus === 'disconnected',
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		select: (response) => response.metadata
	})
}

export const useGetInboundOrderDetail = () => {
	const queryClient = useQueryClient()
	const { scanningStatus } = usePageContext('connection', 'scanningStatus')

	useEffect(() => {
		if (typeof scanningStatus === 'undefined') {
			queryClient.removeQueries({ queryKey: [FP_ORDER_DETAIL_PROVIDE_TAG] })
		}
	}, [scanningStatus])

	return useQuery({
		queryKey: [FP_ORDER_DETAIL_PROVIDE_TAG],
		queryFn: async () => await RFIDService.getFPOrderDetail(),
		enabled: scanningStatus === 'disconnected',
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		select: (response) => response.metadata
	})
}

export const useSearchExchangableOrderQuery = (params: SearchCustOrderParams) => {
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
	const { setSelectedOrder, setCurrentPage } = usePageContext('setSelectedOrder', 'setCurrentPage')

	return useMutation({
		mutationFn: async (filters: Record<string, string | number | boolean>) =>
			await RFIDService.deleteScannedInboundEpcs(filters),
		onSuccess: () => {
			setCurrentPage(null)
			setSelectedOrder(DEFAULT_PROPS.selectedOrder)
			invalidateQueries()
		}
	})
}

export const useUpdateStockInMutation = () => {
	const invalidateQueries = useInvalidateQueries()
	const { selectedOrder, setSelectedOrder, setCurrentPage } = usePageContext(
		'selectedOrder',
		'setSelectedOrder',
		'setCurrentPage'
	)

	return useMutation({
		mutationFn: (payload: InoutboundPayload) => {
			return RFIDService.updateFPStockMovement(
				payload.target_tenant || payload.default_tenant,
				selectedOrder,
				payload
			)
		},
		onSuccess: () => {
			setCurrentPage(null)
			setSelectedOrder(DEFAULT_PROPS.selectedOrder)
			invalidateQueries()
		}
	})
}

export const useExchangeEpcMutation = () => {
	const invalidateQueries = useInvalidateQueries()
	const { setSelectedOrder, setCurrentPage } = usePageContext('setSelectedOrder', 'setCurrentPage')

	return useMutation({
		mutationFn: async (payload: ExchangeEpcPayload) => await RFIDService.exchangeEpc(payload),
		onSuccess: () => {
			setCurrentPage(null)
			setSelectedOrder(DEFAULT_PROPS.selectedOrder)
			invalidateQueries()
		}
	})
}

export const useCombineEpcInfoMutation = () => {
	const invalidateQueries = useInvalidateQueries()
	const { setSelectedOrder, setCurrentPage } = usePageContext('connection', 'setSelectedOrder', 'setCurrentPage')

	return useMutation({
		mutationFn: async (payload: ExchangeEpcPayload) => await RFIDService.combineEpcInfor(payload),
		onSuccess: () => {
			setCurrentPage(null)
			setSelectedOrder(DEFAULT_PROPS.selectedOrder)
			invalidateQueries()
		}
	})
}

const useInvalidateQueries = () => {
	const { refetch: refetchScannedEpcs } = useGetInboundEpcQuery()
	const { refetch: refetchOrderDetail } = useGetInboundOrderDetail()
	return () => {
		refetchScannedEpcs()
		refetchOrderDetail()
	}
}
