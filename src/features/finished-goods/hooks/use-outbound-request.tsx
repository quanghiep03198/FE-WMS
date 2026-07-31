import { StockFlow } from '@features/finished-goods/constants/enums'
import { DeletedFinishedGoodsQueryKey } from '@features/finished-goods/hooks/use-deleted-epc-request'
import type { DeleteScannedEpcsFormValues } from '@features/finished-goods/schemas/delete-epc.schema'
import { FinishedGoodsSharedService } from '@features/finished-goods/services/finished-goods-shared.service'
import { type Register, useMutation, useQuery } from '@tanstack/react-query'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { usePageContext } from '../contexts/finished-goods-outbound/page-context'
import { FinishedGoodsStockService } from '../services/finished-goods-stock.service'

export enum FinishedGoodsOutboundQueryKeys {
	SCANNING_OUTBOUND_EPCS = 'OUTBOUND_EPC'
	// OUTBOUND_EPC_BY_SIZE = 'OUTBOUND_EPC_BY_SIZE'
}

export const useGetScanningOutboundEpcQuery = () => {
	const { currentPage } = usePageContext('currentPage')

	return useQuery({
		queryKey: [FinishedGoodsOutboundQueryKeys.SCANNING_OUTBOUND_EPCS, currentPage],
		queryFn: async () =>
			FinishedGoodsSharedService.getPaginatedScanningEpcs(StockFlow.OUTBOUND, { _page: currentPage }),
		enabled: false,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		select: (response) => response.metadata
	})
}

export const useDeleteEpcMutation = () => {
	const mutationMeta = useMutationMeta()

	mutationMeta.invalidates.push(
		[DeletedFinishedGoodsQueryKey.DELETED_EPCS],
		[DeletedFinishedGoodsQueryKey.DELETED_EPCS_SPECS]
	)

	return useMutation({
		meta: mutationMeta,
		mutationFn: async ({ rescannable, epcs }: DeleteScannedEpcsFormValues) =>
			await FinishedGoodsSharedService.deleteScanningEpcs(epcs, { rescannable: !rescannable })
	})
}

export const useDeleteScanningMoMutation = () => {
	const mutationMeta = useMutationMeta()

	mutationMeta.invalidates.push(
		[DeletedFinishedGoodsQueryKey.DELETED_EPCS],
		[DeletedFinishedGoodsQueryKey.DELETED_EPCS_SPECS]
	)

	return useMutation({
		meta: mutationMeta,
		mutationFn: async ({ commandNumber, rescannable }: { commandNumber: string; rescannable: boolean }) =>
			await FinishedGoodsSharedService.deleteScanningMo(StockFlow.OUTBOUND, commandNumber, {
				rescannable: !rescannable
			})
	})
}

export const useStockOutMutation = (callback: () => unknown) => {
	const toastId = useRef<string | number>(null)
	const { t } = useTranslation()

	const mutationMeta = useMutationMeta()

	return useMutation({
		meta: mutationMeta,
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

const useMutationMeta = (): Register['mutationMeta'] => {
	const { currentPage } = usePageContext('currentPage')

	return {
		invalidates: [[FinishedGoodsOutboundQueryKeys.SCANNING_OUTBOUND_EPCS, { _page: currentPage }]]
	}
}
