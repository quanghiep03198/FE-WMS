import type { DeleteScannedEpcsFormValues } from '@features/finished-goods/schemas/delete-epc.schema'
import { FinishedGoodsStockService } from '@features/finished-goods/services/finished-goods-stock.service'
import { keepPreviousData, type Register, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { FinishedGoodsAction, StockFlow } from '../constants/enums'
import { DEFAULT_PROPS, usePageContext } from '../contexts/finished-goods-inbound/page-context'
import type { StockBalancesPayload } from '../schemas/inoutbound.schema'
import { FinishedGoodsSharedService } from '../services/finished-goods-shared.service'
import { DeletedFinishedGoodsQueryKey } from './use-deleted-epc-request'
import { StockTransactionQueryKey } from './use-stock-transaction-request'

// * API Query Keys
export enum FinishedGoodsInboundQueryKeys {
	SCANNING_INBOUND_EPCS = 'SCANNING_INBOUND_EPCS',
	SCANNING_INBOUND_MO = 'SCANNING_INBOUND_MO'
}

export type FetchEpcQueryKey = [typeof FinishedGoodsInboundQueryKeys.SCANNING_INBOUND_EPCS, number, string]

export const useGetScanningInboundEpcQuery = () => {
	const { selectedDevice, currentPage, selectedOrder, scanningStatus } = usePageContext(
		'selectedDevice',
		'selectedOrder',
		'scanningStatus',
		'currentPage'
	)

	const params = {
		_page: currentPage,
		'mo_no:eq': selectedOrder
	}

	return useQuery({
		queryKey: [FinishedGoodsInboundQueryKeys.SCANNING_INBOUND_EPCS, selectedDevice, params],
		queryFn: async () => {
			return await FinishedGoodsSharedService.getPaginatedScanningEpcs(StockFlow.INBOUND, params, selectedDevice)
		},
		enabled: scanningStatus === 'disconnected' && !!selectedDevice,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		placeholderData: keepPreviousData,
		select: (response) => response.metadata
	})
}

export const useGetScanningInboundMoQuery = () => {
	const queryClient = useQueryClient()
	const { scanningStatus, selectedDevice } = usePageContext('scanningStatus', 'selectedDevice')

	useEffect(() => {
		if (typeof scanningStatus === 'undefined') {
			queryClient.removeQueries({ queryKey: [FinishedGoodsInboundQueryKeys.SCANNING_INBOUND_MO] })
		}
	}, [scanningStatus])

	return useQuery({
		queryKey: [FinishedGoodsInboundQueryKeys.SCANNING_INBOUND_MO, selectedDevice],
		queryFn: async () => await FinishedGoodsSharedService.getScanningMos(StockFlow.INBOUND, selectedDevice),
		enabled: scanningStatus === 'disconnected',
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		select: (response) => response.metadata
	})
}

export const useDeleteEpcMutation = () => {
	const { setSelectedOrder, setCurrentPage } = usePageContext('setSelectedOrder', 'setCurrentPage')

	const mutationMeta = useMutationMeta()

	mutationMeta.invalidates.push(
		['SCANNING_EPCS', StockFlow.INBOUND],
		[DeletedFinishedGoodsQueryKey.DELETED_EPCS],
		[DeletedFinishedGoodsQueryKey.DELETED_EPCS_SPECS]
	)

	return useMutation({
		meta: mutationMeta,
		mutationFn: async ({ rescannable, epcs }: DeleteScannedEpcsFormValues) =>
			await FinishedGoodsSharedService.deleteScanningEpcs(epcs, { rescannable: !rescannable }),
		onSuccess: () => {
			setCurrentPage(null)
			setSelectedOrder(DEFAULT_PROPS.selectedOrder)
		}
	})
}

export const useDeleteScanningMoMutation = () => {
	const { setSelectedOrder, setCurrentPage } = usePageContext('setSelectedOrder', 'setCurrentPage')

	const mutationMeta = useMutationMeta()

	mutationMeta.invalidates.push(
		[DeletedFinishedGoodsQueryKey.DELETED_EPCS],
		[DeletedFinishedGoodsQueryKey.DELETED_EPCS_SPECS]
	)

	return useMutation({
		meta: mutationMeta,
		mutationFn: async ({ commandNumber, rescannable }: { commandNumber: string; rescannable: boolean }) =>
			await FinishedGoodsSharedService.deleteScanningMo(StockFlow.INBOUND, commandNumber, {
				rescannable: !rescannable
			}),
		onSuccess: () => {
			setCurrentPage(null)
			setSelectedOrder(DEFAULT_PROPS.selectedOrder)
		}
	})
}

export const useUpdateStockVariationMutation = () => {
	const { setSelectedOrder, setCurrentPage } = usePageContext(
		'selectedDevice',
		'currentPage',
		'selectedOrder',
		'setSelectedOrder',
		'setCurrentPage'
	)

	const mutationMeta = useMutationMeta()

	const handler = {
		[FinishedGoodsAction.IMPORT]: FinishedGoodsStockService.stockIn,
		[FinishedGoodsAction.EXPORT]: FinishedGoodsStockService.recallFromStock
	}

	mutationMeta.invalidates.push([StockTransactionQueryKey.STOCK_TRANSACTION, StockFlow.INBOUND])

	return useMutation({
		meta: mutationMeta,
		mutationFn: (payload: StockBalancesPayload) => {
			const mutationFn = handler[payload.rfid_status]
			if (typeof mutationFn === 'function') return mutationFn(payload)
		},
		onSuccess: () => {
			setCurrentPage(null)
			setSelectedOrder(DEFAULT_PROPS.selectedOrder)
		}
	})
}

const useMutationMeta = (): Register['mutationMeta'] => {
	const { selectedDevice, currentPage, selectedOrder } = usePageContext(
		'selectedDevice',
		'currentPage',
		'selectedOrder'
	)

	const params = {
		_page: currentPage,
		'mo_no:eq': selectedOrder
	}

	return {
		invalidates: [
			[FinishedGoodsInboundQueryKeys.SCANNING_INBOUND_EPCS, selectedDevice, params],
			[FinishedGoodsInboundQueryKeys.SCANNING_INBOUND_MO, selectedDevice]
		]
	}
}
