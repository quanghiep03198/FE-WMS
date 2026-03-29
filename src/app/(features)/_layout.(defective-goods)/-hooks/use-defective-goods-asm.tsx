import useQueryParams from '@/common/hooks/use-query-params'
import type { IDefectiveGoods, IDefectiveGoodsInventory } from '@/services/defective-goods.service'
import { DefectiveGoodsService } from '@/services/defective-goods.service'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useSessionStorageState } from 'ahooks'
import { omitBy, pick, pickBy } from 'lodash-es'
import { useCallback } from 'react'
import { useReportPageQueryParams } from '../../-hooks/use-report-page-query-params'
import { useGetTenantByFactory } from '../../-hooks/use-tenacy-asm'
import { RFIDDataType } from '../../_layout.(rfid)/-constants'
import { PERSISTENT_DEFECTIVE_GOODS_SEARCH_TERMS_KEY } from '../defective-goods-epc-combination/-constants'
import {
	type CreateDefectiveGoodsFormValues,
	type DefectiveGoodQueryParams
} from '../defective-goods-epc-combination/-schemas/defective-goods.schema'
import { useFilterQuery } from '../defective-goods-inoutbound/-hooks/use-filter-query'
import {
	type DefectiveGoodsInboundFormValues,
	type DefectiveGoodsOutboundFormValues,
	type InboundOutboundFormValues
} from '../defective-goods-inoutbound/-schemas'

export enum DefectiveGoodsQueryKey {
	DEFECTIVE_GOODS = 'DEFECTIVE_GOODS',
	DEFECTIVE_GOODS_INVENTORY = 'DEFECTIVE_GOODS_INVENTORY',
	DEFECTIVE_GOODS_INOUTBOUND_EPC = 'DEFECTIVE_GOODS_INOUTBOUND_EPC',
	DEFECTIVE_GOODS_INBOUND_REPORT = 'DEFECTIVE_GOODS_INBOUND_REPORT',
	DEFECTIVE_GOODS_OUTBOUND_REPORT = 'DEFECTIVE_GOODS_OUTBOUND_REPORT'
}

const useInvalidateQuery = () => {
	const queryClient = useQueryClient()
	const invalidateQueries = () =>
		queryClient.invalidateQueries({
			predicate: (query) =>
				query.queryKey.some(
					(key) =>
						key === DefectiveGoodsQueryKey.DEFECTIVE_GOODS ||
						key === DefectiveGoodsQueryKey.DEFECTIVE_GOODS_INVENTORY ||
						key === DefectiveGoodsQueryKey.DEFECTIVE_GOODS_INBOUND_REPORT ||
						key === DefectiveGoodsQueryKey.DEFECTIVE_GOODS_OUTBOUND_REPORT ||
						key === DefectiveGoodsQueryKey.DEFECTIVE_GOODS_INOUTBOUND_EPC
				)
		})

	return invalidateQueries
}

export const useGetDefectiveGoodsInventoryQuery = () => {
	const { data: tenant } = useGetTenantByFactory()

	return useQuery({
		queryKey: [DefectiveGoodsQueryKey.DEFECTIVE_GOODS_INVENTORY, tenant?.id],
		queryFn: async () => await DefectiveGoodsService.getDefectiveGoodsInventory(tenant?.id),
		enabled: !!tenant?.id,
		select: (response) => {
			return Array.isArray(response.metadata)
				? response.metadata.map((item: IDefectiveGoodsInventory) => ({
						...item,
						total_qty: item.size_data.reduce((sum, size) => sum + size.qty, 0)
					}))
				: []
		}
	})
}

export const useGetDefectiveGoodsQuery = () => {
	const { searchParams } = useQueryParams<Pick<Pagination<IDefectiveGoods>, 'page'>>({ page: 1 })
	const [searchTerms] = useSessionStorageState<DefectiveGoodQueryParams>(PERSISTENT_DEFECTIVE_GOODS_SEARCH_TERMS_KEY, {
		listenStorageChange: true
	})

	return useQuery({
		queryKey: [DefectiveGoodsQueryKey.DEFECTIVE_GOODS, pickBy({ ...searchParams, ...searchTerms }, (item) => !!item)],
		queryFn: async () =>
			await DefectiveGoodsService.getDefectiveGoods(pickBy({ ...searchParams, ...searchTerms }, (item) => !!item)),
		select: (response) => response.metadata
	})
}

export const useCreateDefectiveGoodsMutation = () => {
	const invalidateQueries = useInvalidateQuery()

	return useMutation({
		mutationFn: async (data: CreateDefectiveGoodsFormValues) =>
			await DefectiveGoodsService.createDefectiveGoods(data),
		onSuccess: () => {
			invalidateQueries()
		}
	})
}

export const useUpdateDefectiveGoodsMutation = () => {
	const invalidateQueries = useInvalidateQuery()

	return useMutation({
		mutationFn: async (payload: { id: number; data: CreateDefectiveGoodsFormValues }) =>
			await DefectiveGoodsService.updateDefectiveGoods(payload.id, payload.data),
		onSuccess: () => {
			invalidateQueries()
		}
	})
}

export const useDeleteDefectiveGoodsMutation = () => {
	const invalidateQueries = useInvalidateQuery()

	return useMutation({
		mutationFn: DefectiveGoodsService.deleteDefectiveGoods,
		onSuccess: () => {
			invalidateQueries()
		}
	})
}

export const useDeleteManyDefectiveGoodsMutation = () => {
	const invalidateQueries = useInvalidateQuery()

	return useMutation({
		mutationFn: DefectiveGoodsService.deleteManyDefectiveGoods,
		onSuccess: () => {
			invalidateQueries()
		}
	})
}

export const useGetCanInoutboundEpcQuery = () => {
	const { searchParams } = useFilterQuery()

	const params = omitBy(searchParams, (value) => value === undefined || value === null || value === '')

	return useQuery({
		queryKey: [DefectiveGoodsQueryKey.DEFECTIVE_GOODS_INOUTBOUND_EPC, params],
		queryFn: async () => await DefectiveGoodsService.getCanInoutboundEpc(params),
		select: (response) => response.metadata
	})
}

export const useGetDefectiveGoodsInboundReportQuery = () => {
	const { data: tenant } = useGetTenantByFactory()
	const { searchParams } = useReportPageQueryParams()

	return useQuery({
		queryKey: [DefectiveGoodsQueryKey.DEFECTIVE_GOODS_INBOUND_REPORT, tenant?.id, pick(searchParams, 'date.eq')],
		queryFn: async () => await DefectiveGoodsService.getInboundReport(tenant?.id, pick(searchParams, 'date.eq')),
		enabled: !!tenant?.id,
		refetchInterval: searchParams['auto-refresh'],
		select: (response) => response.metadata
	})
}

export const useGetDefectiveGoodsOutboundReportQuery = () => {
	const { data: tenant } = useGetTenantByFactory()
	const { searchParams } = useReportPageQueryParams()

	return useQuery({
		queryKey: [DefectiveGoodsQueryKey.DEFECTIVE_GOODS_OUTBOUND_REPORT, tenant?.id, pick(searchParams, 'date.eq')],
		queryFn: async () => await DefectiveGoodsService.getOutboundReport(tenant?.id, pick(searchParams, 'date.eq')),
		enabled: !!tenant?.id,
		refetchInterval: searchParams['auto-refresh'],
		select: (response) => response.metadata
	})
}

export const useUpdateDefectiveGoodsStockMutation = () => {
	const { searchParams, removeParam } = useFilterQuery()
	const invalidateQueries = useInvalidateQuery()

	return useMutation({
		mutationFn: async (payload: InboundOutboundFormValues) =>
			searchParams.action === RFIDDataType.INBOUND
				? DefectiveGoodsService.updateInboundStatus(
						payload as Exclude<InboundOutboundFormValues, DefectiveGoodsOutboundFormValues>
					)
				: DefectiveGoodsService.updateOutboundStatus(
						payload as Exclude<InboundOutboundFormValues, DefectiveGoodsInboundFormValues>
					),
		onSuccess: () => {
			for (const key in searchParams) {
				if (key === 'action') continue
				removeParam(key)
			}
			invalidateQueries()
		}
	})
}

export const usePrefetchDefectiveGoodsQuery = () => {
	const [searchTerms] = useSessionStorageState<DefectiveGoodQueryParams>(PERSISTENT_DEFECTIVE_GOODS_SEARCH_TERMS_KEY, {
		listenStorageChange: true
	})
	const queryClient = useQueryClient()

	return useCallback(
		(page: number) => {
			const params = pickBy({ ...searchTerms, page }, (item) => !!item)
			queryClient.prefetchQuery({
				queryKey: [DefectiveGoodsQueryKey.DEFECTIVE_GOODS, params],
				queryFn: async () => await DefectiveGoodsService.getDefectiveGoods(params)
			})
		},
		[searchTerms]
	)
}
