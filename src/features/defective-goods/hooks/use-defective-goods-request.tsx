import { DefectiveGoodsService } from '@features/defective-goods/services/defective-goods.service'
import { StockFlow } from '@features/finished-goods/constants/enums'
import useQueryParams from '@hooks/use-query-params'
import { keepPreviousData, useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { isEmpty, isNil, omitBy, pick, pickBy } from 'lodash-es'
import { useCallback } from 'react'
import { useReportPageQueryParams } from '../../report/hooks/use-report-page-query-params'
import {
	type DefectiveGoodsInboundFormValues,
	type DefectiveGoodsOutboundFormValues,
	type InboundOutboundFormValues
} from '../schemas/defective-goods-inoutbound.schema'
import {
	type CreateDefectiveGoodsFormValues,
	type UpdateDefectiveGoodsFormValues
} from '../schemas/defective-goods.schema'
import type { IDefectiveGoods, IDefectiveGoodsInventory } from '../types'
import { useFilterQuery } from './use-filter-query'
import { useSearchDefectiveGoods } from './use-search-defective-goods'

export enum DefectiveGoodsQueryKey {
	DEFECTIVE_GOODS = 'DEFECTIVE_GOODS',
	DEFECTIVE_GOODS_INVENTORY = 'DEFECTIVE_GOODS_INVENTORY',
	DEFECTIVE_GOODS_INOUTBOUND_EPC = 'DEFECTIVE_GOODS_INOUTBOUND_EPC',
	DEFECTIVE_GOODS_INBOUND_REPORT = 'DEFECTIVE_GOODS_INBOUND_REPORT',
	DEFECTIVE_GOODS_OUTBOUND_REPORT = 'DEFECTIVE_GOODS_OUTBOUND_REPORT'
}

export const useGetDefectiveGoodsInventoryQuery = () => {
	return useQuery({
		queryKey: [DefectiveGoodsQueryKey.DEFECTIVE_GOODS_INVENTORY],
		queryFn: async () => await DefectiveGoodsService.getDefectiveGoodsInventory(),
		select: (response) => {
			return Array.isArray(response.metadata)
				? response.metadata.map((item: IDefectiveGoodsInventory) => ({
						...item,
						total_qty: item.size_ledger.reduce((sum, size) => sum + size.qty, 0)
					}))
				: []
		}
	})
}

export const getDefectiveGoodsQueryOptions = (params: Record<string, any>) => ({
	queryKey: [DefectiveGoodsQueryKey.DEFECTIVE_GOODS, pickBy(params, (item) => !!item)],
	queryFn: async () => await DefectiveGoodsService.getDefectiveGoods(pickBy(params, (item) => !!item)),
	placeholderData: keepPreviousData,
	select: (response) => response.metadata
})

export const useGetDefectiveGoodsQuery = () => {
	const { searchParams: page } = useQueryParams<Pick<Pagination<IDefectiveGoods>, 'page'>, number>(
		{ page: 1 },
		{ select: (params) => params.page ?? 1 }
	)
	const [searchTerms] = useSearchDefectiveGoods()

	return useQuery(getDefectiveGoodsQueryOptions({ page, ...searchTerms }))
}

export const useCreateDefectiveGoodsMutation = () => {
	return useMutation({
		meta: { invalidates: [[DefectiveGoodsQueryKey.DEFECTIVE_GOODS]] },
		mutationFn: async (data: CreateDefectiveGoodsFormValues) => await DefectiveGoodsService.createDefectiveGoods(data)
	})
}

export const useUpdateDefectiveGoodsMutation = () => {
	return useMutation({
		meta: { invalidates: [[DefectiveGoodsQueryKey.DEFECTIVE_GOODS]] },
		mutationFn: async (payload: { id: string; data: UpdateDefectiveGoodsFormValues }) =>
			await DefectiveGoodsService.updateDefectiveGoods(payload.id, payload.data)
	})
}

export const useDeleteDefectiveGoodsMutation = () => {
	return useMutation({
		meta: { invalidates: [[DefectiveGoodsQueryKey.DEFECTIVE_GOODS]] },
		mutationFn: DefectiveGoodsService.deleteDefectiveGoods
	})
}

export const useDeleteManyDefectiveGoodsMutation = () => {
	return useMutation({
		meta: { invalidates: [[DefectiveGoodsQueryKey.DEFECTIVE_GOODS]] },
		mutationFn: DefectiveGoodsService.deleteManyDefectiveGoods
	})
}

type TEpcPageParam = {
	cursor?: string
	direction: 'next' | 'prev'
	page: number
}

export const useGetCanInoutboundEpcQuery = () => {
	const { searchParams } = useFilterQuery()

	const params = omitBy(searchParams, (value) => value === undefined || value === null || value === '')

	return useInfiniteQuery({
		queryKey: [DefectiveGoodsQueryKey.DEFECTIVE_GOODS_INOUTBOUND_EPC, params],
		queryFn: async ({ pageParam }) => {
			return await DefectiveGoodsService.getCanInoutboundEpc({ ...params, ...pageParam })
		},
		enabled: !!searchParams.action,
		initialPageParam: { direction: 'next', page: 1 } as TEpcPageParam,
		getNextPageParam: ({ metadata }): TEpcPageParam | undefined => {
			return metadata.hasNextPage && metadata.nextCursor
				? { cursor: metadata.nextCursor, direction: 'next', page: metadata.nextPage ?? metadata.page + 1 }
				: undefined
		},
		select: (data) => ({
			docs: data.pages.flatMap((page) => page.metadata.data),
			totalDocs: data.pages.at(0)?.metadata.totalDocs ?? 0
		})
	})
}

export const useGetDefectiveGoodsInboundReportQuery = () => {
	const { searchParams } = useReportPageQueryParams()

	return useQuery({
		queryKey: [DefectiveGoodsQueryKey.DEFECTIVE_GOODS_INBOUND_REPORT, pick(searchParams, 'date:eq')],
		queryFn: async () => await DefectiveGoodsService.getInboundReport(pick(searchParams, 'date:eq')),
		refetchInterval: searchParams['auto-refresh'],
		select: (response) => (Array.isArray(response.metadata) ? response.metadata : [])
	})
}

export const useGetDefectiveGoodsOutboundReportQuery = () => {
	const { searchParams } = useReportPageQueryParams()

	return useQuery({
		queryKey: [DefectiveGoodsQueryKey.DEFECTIVE_GOODS_OUTBOUND_REPORT, pick(searchParams, 'date:eq')],
		queryFn: async () => await DefectiveGoodsService.getOutboundReport(pick(searchParams, 'date:eq')),
		refetchInterval: searchParams['auto-refresh'],
		select: (response) => response.metadata
	})
}

export const useUpdateDefectiveGoodsStockMutation = () => {
	const { searchParams, removeParam } = useFilterQuery()
	const params = omitBy(searchParams, (value) => isNil(value) || isEmpty(value))

	return useMutation({
		meta: { invalidates: [[DefectiveGoodsQueryKey.DEFECTIVE_GOODS_INOUTBOUND_EPC, pick(params, 'action')]] },
		mutationFn: async (payload: InboundOutboundFormValues) =>
			searchParams.action === StockFlow.INBOUND
				? DefectiveGoodsService.stockIn(
						payload as Exclude<InboundOutboundFormValues, DefectiveGoodsOutboundFormValues>,
						searchParams
					)
				: DefectiveGoodsService.stockOut(
						payload as Exclude<InboundOutboundFormValues, DefectiveGoodsInboundFormValues>,
						searchParams
					),
		onSuccess: () => {
			for (const key in searchParams) {
				if (key === 'action') continue
				removeParam(key)
			}
		}
	})
}

export const usePrefetchDefectiveGoodsQuery = () => {
	const [searchTerms] = useSearchDefectiveGoods()
	const queryClient = useQueryClient()

	return useCallback(
		(page: number) => {
			const params = pickBy({ ...searchTerms, page }, (item) => !!item)
			queryClient.query(getDefectiveGoodsQueryOptions(params))
		},
		[searchTerms]
	)
}
