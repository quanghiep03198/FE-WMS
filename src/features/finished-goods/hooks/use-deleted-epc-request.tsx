import { keepPreviousData, useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { omitBy, uniqBy } from 'lodash-es'
import { StockFlow } from '../constants/enums'
import { FinishedGoodsSharedService } from '../services/finished-goods-shared.service'
import { RFIDInboundQueryKeys } from './use-inbound-request'
import { RFIDOutboundQueryKeys } from './use-outbound-request'
import type { SearchFormValues } from './use-persistent-filter-state'

export enum DeletedFinishedGoodsQueryKey {
	DELETED_EPCS = 'DELETED_EPCS',
	DELETED_EPCS_SPECS = 'DELETED_EPCS_FEATURES'
}

type InvalidateQueryKeys = DeletedFinishedGoodsQueryKey | RFIDInboundQueryKeys | RFIDOutboundQueryKeys

export const useGetDeletedEpcQuery = (type: StockFlow, params: SearchFormValues & { limit: number }) => {
	return useInfiniteQuery({
		queryKey: [DeletedFinishedGoodsQueryKey.DELETED_EPCS, type, params],
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
			return await FinishedGoodsSharedService.getDeletedEpcs(type, filterQueries)
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

export const useGetDeletedEpcSpecsQuery = () => {
	return useQuery({
		queryKey: [DeletedFinishedGoodsQueryKey.DELETED_EPCS_SPECS],
		queryFn: async () => await FinishedGoodsSharedService.getDeletedEpcSepcs(),
		refetchOnMount: 'always',
		select: (response) => response.metadata
	})
}

export const useRestoreDeletedEpcsMutation = (stockFlow: StockFlow) => {
	const invalidateQueries = useInvalidateQueries(stockFlow)

	return useMutation({
		mutationFn: async (epcs: Array<string>) => await FinishedGoodsSharedService.restoreDeletedEpcs(epcs),
		onSettled: invalidateQueries
	})
}

const useInvalidateQueries = (type: StockFlow) => {
	const queryClient = useQueryClient()

	return () => {
		queryClient.invalidateQueries({
			predicate: (query) =>
				query.queryKey.some((key) => {
					const shouldInvalidateKeys = Object.values(DeletedFinishedGoodsQueryKey)
					const potentialInvalidateKeys =
						type === StockFlow.INBOUND
							? [RFIDInboundQueryKeys.INBOUND_EPC, RFIDInboundQueryKeys.INBOUND_ORDER_DETAIL]
							: [RFIDOutboundQueryKeys.OUTBOUND_EPC, RFIDOutboundQueryKeys.OUTBOUND_EPC_BY_SIZE]

					return [...shouldInvalidateKeys, ...potentialInvalidateKeys].includes(key as InvalidateQueryKeys)
				})
		})
	}
}
