import { IElectronicProductCode } from '@/common/types/entities'
import { RFIDService } from '@/services/rfid.service'
import { keepPreviousData, useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { omitBy, uniqBy } from 'lodash'
import { RFIDDataType } from '../-constants'
import { FilterArchivedEpcParams } from '../finished-goods-outbound'

export const useGetArchivedEpcQuery = (type: RFIDDataType, params) => {
	return useInfiniteQuery({
		queryKey: ['ARCHIVED_EPCS', type, params],
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
					'scanned.eq': params.scanned,
					'scannable.eq': params.scannable
				},
				(value) => value === undefined || value === null || (typeof value === 'string' && value === '')
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

export const useGetArchivedEpcFeatureQuery = (type: RFIDDataType) => {
	return useQuery({
		queryKey: ['ARCHIVED_EPCS_FEATURES', type],
		queryFn: async () => await RFIDService.getArchivedEpcFeatures(type),
		refetchOnMount: 'always',
		select: (response) => response.metadata
	})
}

export const useRestoreEpcMutation = (type: RFIDDataType) => {
	const invalidateQueries = useInvalidateQueries(type)

	return useMutation({
		mutationKey: ['OUTBOUND_EPC_LIST', 'OUTBOUND_EPC_BY_SIZE', 'ARCHIVED_EPCS'],
		mutationFn: async (epcs: Array<IElectronicProductCode>) => await RFIDService.restoreArchivedEpcs(type, epcs),
		onSettled: invalidateQueries
	})
}

const useInvalidateQueries = (type: RFIDDataType) => {
	const queryClient = useQueryClient()

	return () => {
		queryClient.invalidateQueries({
			predicate: (query) =>
				query.queryKey.some((key) => {
					const shouldInvalidateKeys = ['ARCHIVED_EPCS', 'ARCHIVED_EPCS_FEATURES']
					const potentialInvalidateKeys =
						type === RFIDDataType.INBOUND
							? ['INBOUND_ORDER_DETAIL', 'INBOUND_EPC_LIST']
							: ['OUTBOUND_EPC_LIST', 'OUTBOUND_EPC_BY_SIZE']

					return [...shouldInvalidateKeys, ...potentialInvalidateKeys].includes(key as string)
				})
		})
	}
}
