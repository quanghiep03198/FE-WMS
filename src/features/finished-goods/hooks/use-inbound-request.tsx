import { InboundReportQueryKeys } from '@/app/(features)/_layout.inbound-report/-hooks/use-inbound-report-asm'
import { InventoryAuditQueryKeys } from '@/app/(features)/_layout.inventory-audit/-hooks/use-inventory-audit-asm'
import type { DeleteScannedEpcsFormValues } from '@features/finished-goods/schemas/delete-epc.schema'
import { FinishedGoodsInboundService } from '@features/finished-goods/services/finished-goods-inbound.service'
import type { SearchCustOrderParams } from '@features/finished-goods/types'
import useAuth from '@hooks/use-auth'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { StockFlow } from '../constants/enums'
import { DEFAULT_PROPS, usePageContext } from '../contexts/finished-goods-inbound/page-contenxt'
import type { ExchangeEpcPayload, ExchangeOrderFormValue } from '../schemas/exchange-epc.schema'
import type { InoutboundPayload } from '../schemas/inoutbound.schema'
import { FinishedGoodsSharedService } from '../services/finished-goods-shared.service'

// * API Query Keys
export enum RFIDInboundQueryKeys {
	EXCHANGABLE_ORDER = 'EXCHANGABLE_ORDER',
	INBOUND_EPC = 'INBOUND_EPC',
	INBOUND_ORDER_DETAIL = 'SCANNING_MANUFACTURING_ORDERS'
}

export type FetchEpcQueryKey = [typeof RFIDInboundQueryKeys.INBOUND_EPC, number, string]

export const useGetPaginatedScanningInboundEpcQuery = () => {
	const queryClient = useQueryClient()

	const { selectedDevice, currentPage, selectedOrder, scanningStatus } = usePageContext(
		'selectedDevice',
		'selectedOrder',
		'scanningStatus',
		'currentPage'
	)

	useEffect(() => {
		if (typeof scanningStatus === 'undefined') {
			queryClient.removeQueries({ queryKey: [RFIDInboundQueryKeys.INBOUND_EPC] })
		}
	}, [scanningStatus])

	const params = {
		_page: currentPage,
		'mo_no:eq': selectedOrder
	}

	return useQuery({
		queryKey: [RFIDInboundQueryKeys.INBOUND_EPC, selectedDevice, params],
		queryFn: async () =>
			FinishedGoodsSharedService.getPaginatedScanningEpcs(StockFlow.INBOUND, params, selectedDevice),
		enabled: scanningStatus === 'disconnected' && !!selectedDevice,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		placeholderData: keepPreviousData,
		select: (response) => response.metadata
	})
}

export const useGetInboundOrderDetail = () => {
	const queryClient = useQueryClient()
	const { scanningStatus, selectedDevice } = usePageContext('scanningStatus', 'selectedDevice')

	useEffect(() => {
		if (typeof scanningStatus === 'undefined') {
			queryClient.removeQueries({ queryKey: [RFIDInboundQueryKeys.INBOUND_ORDER_DETAIL] })
		}
	}, [scanningStatus])

	return useQuery({
		queryKey: [RFIDInboundQueryKeys.INBOUND_ORDER_DETAIL, StockFlow.INBOUND, selectedDevice],
		queryFn: async () => await FinishedGoodsSharedService.getScanningMos(StockFlow.INBOUND, selectedDevice),
		enabled: scanningStatus === 'disconnected',
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		select: (response) => response.metadata
	})
}

export const useSearchExchangableOrderQuery = (params: SearchCustOrderParams) => {
	const { user } = useAuth()

	return useQuery({
		queryKey: ['EXCHANGABLE_ORDER', user?.current_factory_code, params],
		queryFn: async () => await FinishedGoodsSharedService.searchExchangableMo(params),
		enabled: false,
		select: (response) => response.metadata
	})
}

export const useDeleteEpcMutation = () => {
	const { setCurrentPage, setSelectedOrder } = usePageContext('currentPage', 'setCurrentPage', 'setSelectedOrder')
	const invalidateQueries = useInvalidateQueries()

	return useMutation({
		mutationFn: async ({ rescannable, epcs }: DeleteScannedEpcsFormValues) =>
			await FinishedGoodsSharedService.deleteScanningEpcs(epcs, { rescannable: !rescannable }),
		onSuccess: () => {
			setCurrentPage(null)
			setSelectedOrder(DEFAULT_PROPS.selectedOrder)
			invalidateQueries()
		}
	})
}

export const useDeleteScanningMoMutation = () => {
	const { setCurrentPage, setSelectedOrder } = usePageContext('currentPage', 'setCurrentPage', 'setSelectedOrder')
	const invalidateQueries = useInvalidateQueries()

	return useMutation({
		meta: { invalidates: [[RFIDInboundQueryKeys.INBOUND_ORDER_DETAIL, RFIDInboundQueryKeys.INBOUND_EPC]] },
		mutationFn: async ({ commandNumber, rescannable }: { commandNumber: string; rescannable: boolean }) =>
			await FinishedGoodsSharedService.deleteScanningMo(StockFlow.INBOUND, commandNumber, {
				rescannable: !rescannable
			}),
		onSuccess: () => {
			setCurrentPage(null)
			setSelectedOrder(DEFAULT_PROPS.selectedOrder)
			invalidateQueries()
		}
	})
}

export const useUpdateStockInMutation = () => {
	const invalidateQueries = useInvalidateQueries(
		InventoryAuditQueryKeys.INVENTORY_AUDIT,
		InboundReportQueryKeys.DAILY_INBOUND
	)
	const { setSelectedOrder, setCurrentPage } = usePageContext('setSelectedOrder', 'setCurrentPage')

	return useMutation({
		mutationKey: [InboundReportQueryKeys.DAILY_INBOUND],
		mutationFn: (payload: InoutboundPayload) => {
			return FinishedGoodsInboundService.processStockIn(payload)
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
	const { selectedDevice, setSelectedOrder, setCurrentPage } = usePageContext(
		'selectedDevice',
		'setSelectedOrder',
		'setCurrentPage'
	)

	return useMutation({
		mutationFn: async (payload: ExchangeOrderFormValue) =>
			await FinishedGoodsSharedService.exchangeManufacturingOrder(selectedDevice, payload),
		onSuccess: () => {
			setCurrentPage(null)
			setSelectedOrder(DEFAULT_PROPS.selectedOrder)
			invalidateQueries()
		}
	})
}

export const useUpsertEpcInfoMutation = () => {
	const invalidateQueries = useInvalidateQueries()
	const { selectedDevice, setSelectedOrder, setCurrentPage } = usePageContext(
		'selectedDevice',
		'setSelectedOrder',
		'setCurrentPage'
	)

	return useMutation({
		mutationFn: async (payload: ExchangeEpcPayload) =>
			await FinishedGoodsSharedService.upsertEpcInformation(selectedDevice, payload),
		onSuccess: () => {
			setCurrentPage(null)
			setSelectedOrder(DEFAULT_PROPS.selectedOrder)
			invalidateQueries()
		}
	})
}

const useInvalidateQueries = (...invalidateQueryKeys: string[]) => {
	const { refetch: refetchScannedEpcs } = useGetPaginatedScanningInboundEpcQuery()
	const { refetch: refetchOrderDetail } = useGetInboundOrderDetail()
	const queryClient = useQueryClient()

	return () => {
		refetchScannedEpcs()
		refetchOrderDetail()
		queryClient.invalidateQueries({
			predicate: (query) => {
				return query.queryKey.some((key) => {
					const invalidateKeys: readonly string[] = [
						...invalidateQueryKeys,
						RFIDInboundQueryKeys.INBOUND_ORDER_DETAIL,
						RFIDInboundQueryKeys.INBOUND_EPC
						// ArchiviedDataQueryKeys.ARCHIVED_EPCS,
						// ArchiviedDataQueryKeys.ARCHIVED_EPCS_FEATURES
					]

					return invalidateKeys.includes(key as string)
				})
			}
		})
	}
}
