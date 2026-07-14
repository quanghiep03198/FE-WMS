import { StockFlow } from '@/features/finished-goods/constants/enums'
import { DeletedFinishedGoodsQueryKey } from '@/features/finished-goods/hooks/use-deleted-epc-request'
import type { DeleteScannedEpcsFormValues } from '@/features/finished-goods/schemas/delete-epc.schema'
import { FinishedGoodsSharedService } from '@/features/finished-goods/services/finished-goods-shared.service'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { usePageContext } from '../contexts/finished-goods-outbound/page-context'
import { FinishedGoodsStockService } from '../services/finished-goods-stock.service'

export enum FinishedGoodsOutboundQueryKeys {
	OUTBOUND_EPC = 'OUTBOUND_EPC',
	OUTBOUND_EPC_BY_SIZE = 'OUTBOUND_EPC_BY_SIZE'
}

export const useGetScanningOutboundEpcQuery = () => {
	const { currentPage } = usePageContext('currentPage')

	return useQuery({
		queryKey: [FinishedGoodsOutboundQueryKeys.OUTBOUND_EPC, currentPage],
		queryFn: async () =>
			FinishedGoodsSharedService.getPaginatedScanningEpcs(StockFlow.OUTBOUND, { _page: currentPage }),
		enabled: false,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		select: (response) => response.metadata
	})
}

export const useDeleteEpcMutation = () => {
	return useMutation({
		meta: {
			invalidates: [
				[
					FinishedGoodsOutboundQueryKeys.OUTBOUND_EPC,
					FinishedGoodsOutboundQueryKeys.OUTBOUND_EPC_BY_SIZE,
					DeletedFinishedGoodsQueryKey.DELETED_EPCS,
					DeletedFinishedGoodsQueryKey.DELETED_EPCS_SPECS
				]
			]
		},
		mutationFn: async ({ rescannable, epcs }: DeleteScannedEpcsFormValues) =>
			await FinishedGoodsSharedService.deleteScanningEpcs(epcs, { rescannable: !rescannable })
	})
}

export const useDeleteScanningMoMutation = () => {
	const { currentPage } = usePageContext('currentPage')

	return useMutation({
		meta: {
			invalidates: [
				[
					FinishedGoodsOutboundQueryKeys.OUTBOUND_EPC,
					FinishedGoodsOutboundQueryKeys.OUTBOUND_EPC_BY_SIZE,
					DeletedFinishedGoodsQueryKey.DELETED_EPCS,
					DeletedFinishedGoodsQueryKey.DELETED_EPCS_SPECS,
					currentPage
				]
			]
		},
		mutationFn: async ({ commandNumber, rescannable }: { commandNumber: string; rescannable: boolean }) =>
			await FinishedGoodsSharedService.deleteScanningMo(StockFlow.OUTBOUND, commandNumber, {
				rescannable: !rescannable
			})
	})
}

export const useStockOutMutation = (callback: () => unknown) => {
	const toastId = useRef<string | number>(null)
	const { t } = useTranslation()

	return useMutation({
		meta: {
			invalidates: [
				[FinishedGoodsOutboundQueryKeys.OUTBOUND_EPC, FinishedGoodsOutboundQueryKeys.OUTBOUND_EPC_BY_SIZE]
			]
		},
		mutationFn: async (payload: any) => await FinishedGoodsStockService.stockOut(payload),
		onMutate: () => {
			toastId.current = toast.loading(t('ns_common:notification.processing_request'))
		},
		onSuccess: () => {
			toast.success(t('ns_common:notification.success'), { id: toastId.current })
			if (typeof callback === 'function') callback()
		},
		onError: () => {
			toast.error(t('ns_common:notification.error'), { id: toastId.current })
		}
	})
}
