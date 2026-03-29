import { InventoryAuditQueryKeys } from '@/app/(features)/_layout.inventory-audit/-hooks/use-inventory-audit-asm'
import { RFIDService } from '@/services/rfid.service'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { usePageContext } from '../-contexts/page-context'
import type { SearchEpcParams } from '../..'
import { ArchiviedDataQueryKeys } from '../../-hooks/use-data-restoration-asm'
import type { DeleteScannedEpcsFormValues } from '../../../-schemas/delete-epc.schema'

export enum RFIDOutboundQueryKeys {
	OUTBOUND_EPC = 'OUTBOUND_EPC',
	OUTBOUND_EPC_BY_SIZE = 'OUTBOUND_EPC_BY_SIZE'
}

export const useGetOutboundEpcQuery = () => {
	const { currentPage } = usePageContext('currentPage')

	return useQuery({
		queryKey: [RFIDOutboundQueryKeys.OUTBOUND_EPC, currentPage],
		queryFn: async () => RFIDService.fetchNextOutboundEpc({ _page: currentPage }),
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
			await RFIDService.deleteScannedOutboundEpcs(epcs, { rescannable: !rescannable }),
		onSettled: invalidateQueries
	})
}

export const useDeleteOrderMutation = () => {
	const { currentPage } = usePageContext('currentPage')

	return useMutation({
		mutationKey: [
			RFIDOutboundQueryKeys.OUTBOUND_EPC,
			RFIDOutboundQueryKeys.OUTBOUND_EPC_BY_SIZE,
			'ARCHIVED_EPCS',
			currentPage
		],
		mutationFn: async ({ commandNumber, rescannable }: { commandNumber: string; rescannable: boolean }) =>
			await RFIDService.deleteScannedOutboundOrder(commandNumber, { rescannable: !rescannable })
	})
}

export const useUpdateStockOutMutation = (callback: () => unknown) => {
	const { currentPage } = usePageContext('currentPage')
	const toastId = useRef<string | number>(null)
	const { t } = useTranslation()
	const invalidateQueries = useInvalidateQueries()

	return useMutation({
		mutationFn: async (payload: any) => await RFIDService.upsertOutboundInventory(payload),
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

export const useGetOutboundEpcsBySize = (
	params: SearchEpcParams,
	options: Pick<Parameter<typeof useQuery<ResponseBody<Array<{ epc: string }>>>>, 'enabled'>
) => {
	return useQuery({
		...options,
		queryKey: [RFIDOutboundQueryKeys.OUTBOUND_EPC_BY_SIZE, params],
		queryFn: async () => await RFIDService.getOutboundEpcBySize(params),
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
						ArchiviedDataQueryKeys.ARCHIVED_EPCS,
						ArchiviedDataQueryKeys.ARCHIVED_EPCS_FEATURES,
						InventoryAuditQueryKeys.INVENTORY_AUDIT
					]
					return invalidateKeys.includes(key as string)
				})
		})
	}
}
