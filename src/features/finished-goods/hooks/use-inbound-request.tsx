import { FinishedGoodsStockService } from '@/features/finished-goods/services/finished-goods-stock.service'
import type { DeleteScannedEpcsFormValues } from '@features/finished-goods/schemas/delete-epc.schema'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { StockFlow } from '../constants/enums'
import { DEFAULT_PROPS, usePageContext } from '../contexts/finished-goods-inbound/page-context'
import type { InoutboundPayload } from '../schemas/inoutbound.schema'
import { FinishedGoodsSharedService } from '../services/finished-goods-shared.service'
import { DeletedFinishedGoodsQueryKey } from './use-deleted-epc-request'

// * API Query Keys
export enum FinishedGoodsInboundQueryKeys {
	SCANNING_INBOUND_EPCS = 'SCANNING_INBOUND_EPCS',
	SCANNING_INBOUND_MO = 'SCANNING_INBOUND_MO'
}

export type FetchEpcQueryKey = [typeof FinishedGoodsInboundQueryKeys.SCANNING_INBOUND_EPCS, number, string]

export const useGetScanningInboundEpcQuery = () => {
	const queryClient = useQueryClient()

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

	useEffect(() => {
		if (typeof scanningStatus === 'undefined') {
			queryClient.removeQueries({
				predicate: (query) =>
					query.queryKey.some((key) => key === FinishedGoodsInboundQueryKeys.SCANNING_INBOUND_EPCS)
			})
		}
	}, [scanningStatus])

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
	const { selectedDevice, setCurrentPage, setSelectedOrder } = usePageContext(
		'selectedDevice',
		'setCurrentPage',
		'setSelectedOrder'
	)

	return useMutation({
		meta: {
			invalidates: [
				[FinishedGoodsInboundQueryKeys.SCANNING_INBOUND_EPCS, selectedDevice],
				[FinishedGoodsInboundQueryKeys.SCANNING_INBOUND_MO, selectedDevice],
				[DeletedFinishedGoodsQueryKey.DELETED_EPCS],
				[DeletedFinishedGoodsQueryKey.DELETED_EPCS_SPECS]
			]
		},
		mutationFn: async ({ rescannable, epcs }: DeleteScannedEpcsFormValues) =>
			await FinishedGoodsSharedService.deleteScanningEpcs(epcs, { rescannable: !rescannable }),
		onSuccess: () => {
			setCurrentPage(null)
			setSelectedOrder(DEFAULT_PROPS.selectedOrder)
		}
	})
}

export const useDeleteScanningMoMutation = () => {
	const { selectedDevice, setCurrentPage, setSelectedOrder } = usePageContext(
		'selectedDevice',
		'setCurrentPage',
		'setSelectedOrder'
	)

	return useMutation({
		meta: {
			invalidates: [
				[FinishedGoodsInboundQueryKeys.SCANNING_INBOUND_EPCS, selectedDevice],
				[FinishedGoodsInboundQueryKeys.SCANNING_INBOUND_MO, selectedDevice],
				[DeletedFinishedGoodsQueryKey.DELETED_EPCS],
				[DeletedFinishedGoodsQueryKey.DELETED_EPCS_SPECS]
			]
		},
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

export const useUpdateStockInMutation = () => {
	const { selectedDevice, setSelectedOrder, setCurrentPage } = usePageContext(
		'selectedDevice',
		'setSelectedOrder',
		'setCurrentPage'
	)

	return useMutation({
		meta: {
			invalidates: [
				[FinishedGoodsInboundQueryKeys.SCANNING_INBOUND_EPCS, selectedDevice],
				[FinishedGoodsInboundQueryKeys.SCANNING_INBOUND_MO, selectedDevice]
			]
		},
		mutationFn: (payload: InoutboundPayload) => {
			return FinishedGoodsStockService.stockIn(payload)
		},
		onSuccess: () => {
			setCurrentPage(null)
			setSelectedOrder(DEFAULT_PROPS.selectedOrder)
		}
	})
}
