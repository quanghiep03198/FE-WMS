import { DepartmentService } from '@/services/department.service'
import { RFIDService } from '@/services/rfid.service'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { pick } from 'lodash'
import { MANUALLY_MUTATE_DATA } from '../_constants/event.const'
import { useListBoxContext } from '../_contexts/-list-box.context'
import { DEFAULT_PROPS, usePageContext } from '../_contexts/-page-context'
import { InoutboundPayload } from '../_schemas/epc-inoutbound.schema'
import { type ExchangeEpcPayload } from '../_schemas/exchange-epc.schema'

// API Query Keys
export const INOUTBOUND_DEPT_PROVIDE_TAG = 'SHAPING_DEPARTMENT'
export const ORDER_DETAIL_PROVIDE_TAG = 'ORDER_DETAIL'
export const EPC_LIST_PROVIDE_TAG = 'EPC_LIST'
// Fallback order value if it's null
export const FALLBACK_ORDER_VALUE = 'Unknown'

export type FetchEpcQueryKey = [typeof EPC_LIST_PROVIDE_TAG, number, string]

export const useManualFetchEpcQuery = () => {
	const { page } = useListBoxContext()
	const { selectedOrder, connection } = usePageContext((state) => pick(state, ['selectedOrder', 'connection']))

	return useQuery({
		queryKey: [EPC_LIST_PROVIDE_TAG, page, selectedOrder],
		queryFn: async () => RFIDService.fetchEpcManually(connection, page, selectedOrder),
		enabled: false,
		refetchOnWindowFocus: false,
		select: (response) => response.metadata
	})
}

export const useSearchExchangableOrderQuery = (orderTarget: string, searchTerm: string) => {
	const { connection } = usePageContext((state) => pick(state, 'connection'))

	return useQuery({
		queryKey: ['EXCHANGABLE_ORDER_PROVIDE_TAG'],
		queryFn: async () => await RFIDService.searchExchangableOrder(connection, orderTarget, searchTerm),
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		enabled: false,
		select: (response) => response.metadata
	})
}

export const useUpdateStockMovementMutation = () => {
	const { connection } = usePageContext((state) => pick(state, 'connection'))

	return useMutation({
		mutationKey: [ORDER_DETAIL_PROVIDE_TAG],
		mutationFn: (payload: InoutboundPayload) => RFIDService.updateStockMovement(connection, payload)
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
	const queryClient = useQueryClient()
	const { connection, setSelectedOrder } = usePageContext((state) => pick(state, ['connection', 'setSelectedOrder']))
	const { setPage } = useListBoxContext()

	return useMutation({
		mutationKey: [ORDER_DETAIL_PROVIDE_TAG],
		mutationFn: async (orderCode: string) => {
			return await RFIDService.deleteUnexpectedOrder(connection, orderCode)
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [ORDER_DETAIL_PROVIDE_TAG] })
			setPage(null)
			setSelectedOrder(DEFAULT_PROPS.selectedOrder)
			window.dispatchEvent(new Event(MANUALLY_MUTATE_DATA))
		}
	})
}

export const useGetOrderDetail = () => {
	const { connection, scanningStatus } = usePageContext((state) => pick(state, ['connection', 'scanningStatus']))

	return useQuery({
		queryKey: [ORDER_DETAIL_PROVIDE_TAG, connection],
		queryFn: async () => await RFIDService.getOrderDetail({ headers: { ['X-Tenant-Id']: connection } }),
		enabled: scanningStatus === 'disconnected',
		select: (response) => response.metadata
	})
}

export const useExchangeEpcMutation = () => {
	const { connection } = usePageContext((state) => pick(state, ['connection']))
	const queryClient = useQueryClient()

	return useMutation({
		mutationKey: [ORDER_DETAIL_PROVIDE_TAG, connection],
		mutationFn: async (payload: ExchangeEpcPayload) => await RFIDService.exchangeEpc(connection, payload),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: [ORDER_DETAIL_PROVIDE_TAG, connection] })
	})
}
