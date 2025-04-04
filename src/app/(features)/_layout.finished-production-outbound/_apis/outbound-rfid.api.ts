import { RFIDService } from '@/services/rfid.service'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { OUTBOUND_REPORT_PROVIDE_TAG } from '../../_apis/use-report.api'
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

export const useDeleteEpcMutation = () => {
	const { currentPage } = usePageContext('currentPage')

	return useMutation({
		mutationKey: [OUTBOUND_EPC_LIST_PROVIDE_TAG, currentPage],
		mutationFn: async (filters: Record<string, string | number | boolean>) =>
			await RFIDService.deleteScannedOutboundEpcs(filters)
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
