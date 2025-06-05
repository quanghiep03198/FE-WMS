import { RFIDService } from '@/services/rfid.service'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { OUTBOUND_REPORT_PROVIDE_TAG } from '../../_apis/use-report.api'
import { DeleteScannedEpcsFormValues } from '../../_schemas/delete-epc.schema'
import { SearchEpcParams } from '../../_types/rfid'
import { usePageContext } from '../_contexts/-page-context'

export const OUTBOUND_EPC_LIST_PROVIDE_TAG = 'OUTBOUND_EPC_LIST'

export const useGetOutboundEpcQuery = () => {
	const { currentPage } = usePageContext('currentPage')

	return useQuery({
		queryKey: [OUTBOUND_EPC_LIST_PROVIDE_TAG, currentPage],
		queryFn: async () => RFIDService.fetchNextOutboundEpc({ _page: currentPage }),
		enabled: false,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		select: (response) => response.metadata
	})
}

export const useGetArchivedEpcQuery = () => {
	return useQuery({
		queryKey: ['ARCHIVED_EPCS'],
		queryFn: RFIDService.getArchivedEpcs,
		refetchOnMount: true,
		select: (response) => {
			if (!Array.isArray(response.metadata)) return []
			return response.metadata
		}
	})
}

// export const useRevertArchivedEpc = () => {
// 	return useMutation({
// 		mutationFn: async (epc: string) => await RFIDService.revertArchivedEpc(epc),
// 		onSuccess: () => {
// 			toast.success('Reverted archived EPC successfully')
// 		},
// 		onError: () => {
// 			toast.error('Failed to revert archived EPC')
// 		}
// 	})
// }

export const useDeleteEpcMutation = () => {
	const { currentPage } = usePageContext('currentPage')
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async ({ rescannable, epcs }: DeleteScannedEpcsFormValues) =>
			await RFIDService.deleteScannedOutboundEpcs(epcs, { rescannable: !rescannable }),
		onSettled: async () => {
			queryClient.invalidateQueries({
				queryKey: [OUTBOUND_EPC_LIST_PROVIDE_TAG, currentPage],
				exact: false
			})
			queryClient.invalidateQueries({
				queryKey: ['OUTBOUND_EPC_BY_SIZE', 'ARCHIVED_EPCS'],
				exact: false
			})
		}
	})
}

export const useDeleteOrderMutation = () => {
	const { currentPage } = usePageContext('currentPage')

	return useMutation({
		mutationKey: [OUTBOUND_EPC_LIST_PROVIDE_TAG, 'OUTBOUND_EPC_BY_SIZE', 'ARCHIVED_EPCS', currentPage],
		mutationFn: async ({ commandNumber, rescannable }: { commandNumber: string; rescannable: boolean }) =>
			await RFIDService.deleteScannedOutboundOrder(commandNumber, { rescannable: !rescannable })
	})
}

export const useUpdateStockOutMutation = (callback: () => unknown) => {
	const { currentPage } = usePageContext('currentPage')
	const toastId = useRef<string | number>(null)
	const { t } = useTranslation()

	return useMutation({
		mutationKey: [OUTBOUND_EPC_LIST_PROVIDE_TAG, OUTBOUND_REPORT_PROVIDE_TAG, currentPage],
		mutationFn: async (payload: any) => await RFIDService.upsertOutboundInventory(payload),
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

export const useGetOutboundEpcsBySize = (
	params: SearchEpcParams,
	options: Pick<Parameter<typeof useQuery<ResponseBody<Array<{ epc: string }>>>>, 'enabled'>
) => {
	return useQuery({
		...options,
		queryKey: ['OUTBOUND_EPC_BY_SIZE', params],
		queryFn: async () => await RFIDService.getOutboundEpcBySize(params),
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		select: (response) => (Array.isArray(response.metadata) ? response.metadata : [])
	})
}
