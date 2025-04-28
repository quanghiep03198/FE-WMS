/* eslint-disable @tanstack/query/exhaustive-deps */
import useAuth from '@/common/hooks/use-auth'
import { DepartmentService } from '@/services/department.service'
import { RFIDService } from '@/services/rfid.service'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { omit } from 'lodash'
import { useEffect } from 'react'
import { INBOUND_REPORT_PROVIDE_TAG } from '../../_apis/use-report.api'
import { DeleteScannedEpcsFormValues } from '../../_schemas/delete-epc.schema'
import { SearchEpcParams } from '../../_types/rfid'
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
		queryFn: async () => await RFIDService.getInboundOrderDetail(),
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
		queryFn: async () => await RFIDService.searchExchangableOrder(params),
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
	const { setCurrentPage, setSelectedOrder } = usePageContext('currentPage', 'setCurrentPage', 'setSelectedOrder')
	const invalidateQueries = useInvalidateQueries()

	return useMutation({
		mutationFn: async ({ rescannable, epcs }: DeleteScannedEpcsFormValues) =>
			await RFIDService.deleteScannedInboundEpcs(epcs, { rescannable: !rescannable }),
		onSuccess: () => {
			setCurrentPage(null)
			setSelectedOrder(DEFAULT_PROPS.selectedOrder)
			invalidateQueries()
		}
	})
}

export const useDeleteOrderMutation = () => {
	const { setCurrentPage, setSelectedOrder } = usePageContext('currentPage', 'setCurrentPage', 'setSelectedOrder')
	const invalidateQueries = useInvalidateQueries()

	return useMutation({
		mutationFn: async ({ commandNumber, rescannable }: { commandNumber: string; rescannable: boolean }) =>
			await RFIDService.deleteScannedInboundOrder(commandNumber, { rescannable: !rescannable }),
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
		mutationKey: [INBOUND_REPORT_PROVIDE_TAG],
		mutationFn: (payload: InoutboundPayload) => {
			return RFIDService.upsertInboundInventory(
				payload.target_tenant || payload.default_tenant,
				selectedOrder,
				omit(payload, ['default_tenant', 'target_tenant'])
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
	const queryClient = useQueryClient()

	return () => {
		refetchScannedEpcs()
		refetchOrderDetail()
		queryClient.invalidateQueries({ queryKey: ['INBOUND_EPC_BY_SIZE'], exact: false })
	}
}

export const useGetInboundEpcsBySize = (
	params: SearchEpcParams,
	options: Pick<Parameter<typeof useQuery<ResponseBody<Array<{ epc: string }>>>>, 'enabled'>
) => {
	return useQuery({
		...options,
		queryKey: ['INBOUND_EPC_BY_SIZE', params],
		queryFn: async () => await RFIDService.getInboundEpcBySize(params),
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		select: (response) => (Array.isArray(response.metadata) ? response.metadata : [])
	})
}
