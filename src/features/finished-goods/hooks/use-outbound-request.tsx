import { StockFlow } from '@/features/finished-goods/constants/enums'
import { DeletedFinishedGoodsQueryKey } from '@/features/finished-goods/hooks/use-deleted-epc-request'
import type { DeleteScannedEpcsFormValues } from '@/features/finished-goods/schemas/delete-epc.schema'
import { FinishedGoodsOutboundService } from '@/features/finished-goods/services/finished-goods-outbound.service'
import { FinishedGoodsSharedService } from '@/features/finished-goods/services/finished-goods-shared.service'
import type { SearchEpcParams } from '@/features/finished-goods/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { usePageContext } from '../contexts/finished-goods-outbound/page-context'

export enum RFIDOutboundQueryKeys {
	OUTBOUND_EPC = 'OUTBOUND_EPC',
	OUTBOUND_EPC_BY_SIZE = 'OUTBOUND_EPC_BY_SIZE'
}

export const useGetPaginatedScanningEpcQuery = () => {
	const { currentPage } = usePageContext('currentPage')

	return useQuery({
		queryKey: [RFIDOutboundQueryKeys.OUTBOUND_EPC, currentPage],
		queryFn: async () =>
			FinishedGoodsSharedService.getPaginatedScanningEpcs(StockFlow.OUTBOUND, { _page: currentPage }),
		enabled: false,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		select: (response) => response.metadata
	})
}

export const useDeleteEpcMutation = () => {
	const invalidateQueries = useInvalidateQueries()

	return useMutation({
		mutationFn: async ({ rescannable, epcs }: DeleteScannedEpcsFormValues) =>
			await FinishedGoodsSharedService.deleteScanningEpcs(epcs, { rescannable: !rescannable }),
		onSettled: invalidateQueries
	})
}

export const useDeleteScanningMoMutation = () => {
	const { currentPage } = usePageContext('currentPage')

	return useMutation({
		meta: {
			invalidates: [
				[
					RFIDOutboundQueryKeys.OUTBOUND_EPC,
					RFIDOutboundQueryKeys.OUTBOUND_EPC_BY_SIZE,
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

export const useProcessStockOutMutation = (callback: () => unknown) => {
	const toastId = useRef<string | number>(null)
	const { t } = useTranslation()
	const invalidateQueries = useInvalidateQueries()

	return useMutation({
		mutationFn: async (payload: any) => await FinishedGoodsOutboundService.stockout(payload),
		onMutate: () => {
			toastId.current = toast.loading(t('ns_common:notification.processing_request'))
		},
		onSuccess: () => {
			toast.success(t('ns_common:notification.success'), { id: toastId.current })
			if (typeof callback === 'function') callback()
			invalidateQueries()
		},
		onError: () => {
			toast.error(t('ns_common:notification.error'), { id: toastId.current })
		}
	})
}

export const useGetScanningOutboundEpcs = (
	params: SearchEpcParams,
	options: Pick<Parameter<typeof useQuery<ResponseBody<Array<{ epc: string }>>>>, 'enabled'>
) => {
	return useQuery({
		...options,
		queryKey: [RFIDOutboundQueryKeys.OUTBOUND_EPC_BY_SIZE, params],
		queryFn: async () => await FinishedGoodsSharedService.getScanningEpcs(StockFlow.OUTBOUND, params),
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		select: (response) => (Array.isArray(response.metadata) ? response.metadata : [])
	})
}

const useInvalidateQueries = () => {
	const queryClient = useQueryClient()

	return () => {
		queryClient.invalidateQueries({
			exact: false,
			predicate: (query) =>
				query.queryKey.some((key) => {
					const invalidateKeys: readonly string[] = [
						RFIDOutboundQueryKeys.OUTBOUND_EPC,
						RFIDOutboundQueryKeys.OUTBOUND_EPC_BY_SIZE,
						DeletedFinishedGoodsQueryKey.DELETED_EPCS,
						DeletedFinishedGoodsQueryKey.DELETED_EPCS_SPECS
					]
					return invalidateKeys.includes(key as string)
				})
		})
	}
}
