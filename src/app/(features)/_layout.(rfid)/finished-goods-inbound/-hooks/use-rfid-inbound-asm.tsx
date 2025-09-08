/* eslint-disable @tanstack/query/exhaustive-deps */
import { InboundReportQueryKeys } from '@/app/(features)/_layout.inbound-report/-hooks/use-inbound-report-asm'
import useAuth from '@/common/hooks/use-auth'
import { RFIDService } from '@/services/rfid.service'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { omit } from 'lodash'
import { useEffect } from 'react'
import { SearchCustOrderParams } from '..'
import { DEFAULT_PROPS, usePageContext } from '../-contexts/page-context'
import { InoutboundPayload } from '../-schemas/epc-inoutbound.schema'
import { type ExchangeEpcPayload } from '../-schemas/exchange-epc.schema'
import { SearchEpcParams } from '../..'
import { DeleteScannedEpcsFormValues } from '../../../-schemas/delete-epc.schema'

// * API Query Keys
export enum RFIDInboundQueryKeys {
	EXCHANGABLE_ORDER = 'EXCHANGABLE_ORDER',
	INBOUND_EPC = 'INBOUND_EPC',
	INBOUND_ORDER_DETAIL = 'INBOUND_ORDER_DETAIL'
}

export type FetchEpcQueryKey = [typeof RFIDInboundQueryKeys.INBOUND_EPC, number, string]

export const useGetInboundEpcQuery = () => {
	const queryClient = useQueryClient()

	const { currentPage, selectedOrder, scanningStatus } = usePageContext(
		'currentPage',
		'selectedOrder',
		'scanningStatus'
	)

	useEffect(() => {
		if (typeof scanningStatus === 'undefined') {
			queryClient.removeQueries({ queryKey: [RFIDInboundQueryKeys.INBOUND_EPC] })
		}
	}, [scanningStatus])

	return useQuery({
		queryKey: [RFIDInboundQueryKeys.INBOUND_EPC],
		queryFn: async () =>
			RFIDService.fetchNextInboundEpc({
				_page: currentPage,
				'mo_no.eq': selectedOrder
			}),
		enabled: scanningStatus === 'disconnected',
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		placeholderData: keepPreviousData,
		select: (response) => response.metadata
	})
}

export const useGetInboundOrderDetail = () => {
	const queryClient = useQueryClient()
	const { scanningStatus } = usePageContext('connection', 'scanningStatus')

	useEffect(() => {
		if (typeof scanningStatus === 'undefined') {
			queryClient.removeQueries({ queryKey: [RFIDInboundQueryKeys.INBOUND_ORDER_DETAIL] })
		}
	}, [scanningStatus])

	return useQuery({
		queryKey: [RFIDInboundQueryKeys.INBOUND_ORDER_DETAIL],
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
		mutationKey: [InboundReportQueryKeys.DAILY_INBOUND],
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

export const useUpsertEpcInfoMutation = () => {
	const invalidateQueries = useInvalidateQueries()
	const { setSelectedOrder, setCurrentPage } = usePageContext('connection', 'setSelectedOrder', 'setCurrentPage')

	return useMutation({
		mutationFn: async (payload: ExchangeEpcPayload) => await RFIDService.upsertEpcInformation(payload),
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
		queryClient.invalidateQueries({
			predicate: (query) => {
				return query.queryKey.some((key) => {
					const invalidateKeys: readonly string[] = [
						RFIDInboundQueryKeys.INBOUND_ORDER_DETAIL,
						RFIDInboundQueryKeys.INBOUND_EPC,
						'ARCHIVED_EPCS',
						'ARCHIVED_EPCS_FEATURES'
					]

					return invalidateKeys.includes(key as string)
				})
			}
		})
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
