import { keepPreviousData, useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query'
import { omitBy, uniqBy } from 'lodash-es'
import type { StockFlow } from '../constants/enums'
import { FinishedGoodsSharedService } from '../services/finished-goods-shared.service'
import type { SearchFormValues } from './use-persistent-filter-state'

export enum DeletedFinishedGoodsQueryKey {
	DELETED_EPCS = 'DELETED_FINISHED_GOODS_EPCS',
	DELETED_EPCS_SPECS = 'DELETED_FINISHED_GOODS_SPECS'
}

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
				(value) => value === undefined || value === null || (typeof value === 'string' && value === '')
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

export const useRestoreDeletedEpcsMutation = () => {
	return useMutation({
		meta: {
			invalidates: [[DeletedFinishedGoodsQueryKey.DELETED_EPCS, DeletedFinishedGoodsQueryKey.DELETED_EPCS_SPECS]]
		},
		mutationFn: async (epcs: Array<string>) => await FinishedGoodsSharedService.restoreDeletedEpcs(epcs)
	})
}
