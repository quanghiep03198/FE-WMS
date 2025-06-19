import { IElectronicProductCode } from '@/common/types/entities'
import { RFIDService } from '@/services/rfid.service'
import { keepPreviousData, useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { omitBy, uniqBy } from 'lodash'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { FilterArchivedEpcParams } from '..'
import { usePageContext } from '../-contexts/page-context'
import { SearchEpcParams } from '../..'
import { OUTBOUND_REPORT_PROVIDE_TAG } from '../../../-hooks/use-report'
import { DeleteScannedEpcsFormValues } from '../../../-schemas/delete-epc.schema'

export const useGetOutboundEpcQuery = () => {
	const { currentPage } = usePageContext('currentPage')

	return useQuery({
		queryKey: ['OUTBOUND_EPC_LIST', currentPage],
		queryFn: async () => RFIDService.fetchNextOutboundEpc({ _page: currentPage }),
		enabled: false,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		select: (response) => response.metadata
	})
}

export const useGetArchivedEpcQuery = (params) => {
	return useInfiniteQuery({
		queryKey: ['ARCHIVED_EPCS', params],
		queryFn: async ({ pageParam }) => {
			const filterQueries = omitBy<Partial<FilterArchivedEpcParams>>(
				{
					_page: pageParam,
					_limit: params.limit ?? 100,
					q: params.searchTerm,
					'shoes_style.eq': params.shoes_style,
					'color_sn.eq': params.color_sn,
					'mo_no.eq': params.mo_no,
					'size_numcode.eq': params.size_numcode,
					'scanned.eq': params.scanned
				},
				(value) => value === undefined || value === null || (typeof value === 'string' && value === '')
			)
			return await RFIDService.getArchivedEpcs(filterQueries)
		},
		initialPageParam: 1,
		refetchOnMount: true,
		getNextPageParam: (lastPage) => {
			return lastPage.metadata?.nextPage
		},
		placeholderData: keepPreviousData,
		select: (response) => {
			const data = response.pages.flatMap((page) => {
				if (!Array.isArray(page.metadata.data)) return []
				else return page.metadata.data
			})
			return uniqBy(data, (item) => item.epc)
		}
	})
}

export const useGetArchivedEpcFeatureQuery = () => {
	return useQuery({
		queryKey: ['ARCHIVED_EPCS_FEATURES'],
		queryFn: async () => await RFIDService.getArchivedEpcFeatures(),
		refetchOnMount: 'always',
		select: (response) => response.metadata
	})
}

export const useRestoreEpcMutation = () => {
	const invalidateQueries = useInvalidateQueries()

	return useMutation({
		mutationKey: ['OUTBOUND_EPC_LIST', 'OUTBOUND_EPC_BY_SIZE', 'ARCHIVED_EPCS'],
		mutationFn: async (epcs: Array<IElectronicProductCode>) => await RFIDService.restoreArchivedEpcs(epcs),
		onSettled: invalidateQueries
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
		mutationKey: ['OUTBOUND_EPC_LIST', 'OUTBOUND_EPC_BY_SIZE', 'ARCHIVED_EPCS', currentPage],
		mutationFn: async ({ commandNumber, rescannable }: { commandNumber: string; rescannable: boolean }) =>
			await RFIDService.deleteScannedOutboundOrder(commandNumber, { rescannable: !rescannable })
	})
}

export const useUpdateStockOutMutation = (callback: () => unknown) => {
	const { currentPage } = usePageContext('currentPage')
	const toastId = useRef<string | number>(null)
	const { t } = useTranslation()

	return useMutation({
		mutationKey: ['OUTBOUND_EPC_LIST', OUTBOUND_REPORT_PROVIDE_TAG, currentPage],
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

const useInvalidateQueries = () => {
	const queryClient = useQueryClient()

	return () => {
		queryClient.invalidateQueries({
			predicate: (query) =>
				query.queryKey.some((key) =>
					['OUTBOUND_EPC_LIST', 'OUTBOUND_EPC_BY_SIZE', 'ARCHIVED_EPCS', 'ARCHIVED_EPCS_FEATURES'].includes(
						key as string
					)
				)
		})
	}
}
