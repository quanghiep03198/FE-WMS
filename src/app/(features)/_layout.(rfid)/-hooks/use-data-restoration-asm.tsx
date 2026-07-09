import { RFIDService } from '@/services/rfid.service'
import { keepPreviousData, useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { omitBy, uniqBy } from 'lodash-es'
import { RFIDDataType } from '../-constants'
import { RFIDInboundQueryKeys } from '../finished-goods-inbound/-hooks/use-rfid-inbound-asm'
import { RFIDOutboundQueryKeys } from '../finished-goods-outbound/-hooks/use-rfid-outbound-asm'
import type { SearchFormValues } from './use-persistent-filter-state'

export enum ArchiviedDataQueryKeys {
	ARCHIVED_EPCS = 'ARCHIVED_EPCS',
	ARCHIVED_EPCS_FEATURES = 'ARCHIVED_EPCS_FEATURES'
}

type InvalidateQueryKeys = ArchiviedDataQueryKeys | RFIDInboundQueryKeys | RFIDOutboundQueryKeys

export const useGetArchivedEpcQuery = (type: RFIDDataType, params: SearchFormValues & { limit: number }) => {
	return useInfiniteQuery({
		queryKey: [ArchiviedDataQueryKeys.ARCHIVED_EPCS, type, params],
		queryFn: async ({ pageParam }) => {
			const filterQueries = omitBy(
				{
					_page: pageParam,
					_limit: params.limit ?? 100,
					q: params.epc,
					'shoes_style:eq': params.shoes_style,
					'color_sn:eq': params.color_sn,
					'mo_no:eq': params.mo_no,
					'size_numcode:eq': params.size_numcode,
					'scanned:eq': params.scanned,
					'scannable:eq': params.scannable
				},
				(value) =>
					value === undefined || value === null || (typeof value === 'string' && (value === '' || value === 'all'))
			)
			return await RFIDService.getArchivedEpcs(type, filterQueries)
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
		queryKey: [ArchiviedDataQueryKeys.ARCHIVED_EPCS_FEATURES],
		queryFn: async () => await RFIDService.getArchivedEpcFeatures(),
		refetchOnMount: 'always',
		select: (response) => response.metadata
	})
}

export const useRestoreEpcMutation = (type: RFIDDataType) => {
	const invalidateQueries = useInvalidateQueries(type)

	return useMutation({
		mutationFn: async (epcs: Array<string>) => await RFIDService.restoreArchivedEpcs(epcs),
		onSettled: invalidateQueries
	})
}

const useInvalidateQueries = (type: RFIDDataType) => {
	const queryClient = useQueryClient()

	return () => {
		queryClient.invalidateQueries({
			predicate: (query) =>
				query.queryKey.some((key) => {
					const shouldInvalidateKeys = Object.values(ArchiviedDataQueryKeys)
					const potentialInvalidateKeys =
						type === RFIDDataType.INBOUND
							? [RFIDInboundQueryKeys.INBOUND_EPC, RFIDInboundQueryKeys.INBOUND_ORDER_DETAIL]
							: [RFIDOutboundQueryKeys.OUTBOUND_EPC, RFIDOutboundQueryKeys.OUTBOUND_EPC_BY_SIZE]

					return [...shouldInvalidateKeys, ...potentialInvalidateKeys].includes(key as InvalidateQueryKeys)
				})
		})
	}
}
