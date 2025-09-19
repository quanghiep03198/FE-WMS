import useQueryParams from '@/common/hooks/use-query-params'
import { IDefectiveGoods } from '@/common/types/entities'
import { DefectiveGoodsService } from '@/services/defective-goods.service'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useSessionStorageState } from 'ahooks'
import { pickBy } from 'lodash'
import { useCallback } from 'react'
import {
	CreateDefectiveGoodsFormValues,
	DefectiveGoodQueryParams
} from '../defective-goods-epc-combination/-schemas/defective-goods.schema'

export enum DefectiveGoodsQueryKey {
	DEFECTIVE_GOODS = 'DEFECTIVE_GOODS'
}

export const useGetDefectiveGoodsQuery = () => {
	const { searchParams } = useQueryParams<Pick<Pagination<IDefectiveGoods>, 'page'>>({ page: 1 })
	const [searchTerms] = useSessionStorageState<DefectiveGoodQueryParams>('defectiveGoodsSearchTerms', {
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

const useInvalidateQuery = () => {
	const queryClient = useQueryClient()
	const invalidateQueries = () =>
		queryClient.invalidateQueries({
			predicate: (query) => query.queryKey.some((key) => key === DefectiveGoodsQueryKey.DEFECTIVE_GOODS)
		})

	return invalidateQueries
}

export const usePrefetchDefectiveGoodsQuery = () =>
	useCallback((page) => {
		const { searchParams } = useQueryParams<Pick<Pagination<IDefectiveGoods>, 'page'>>({ page: 1 })
		const queryClient = useQueryClient()

		const params = pickBy({ ...searchParams, page }, (item) => !!item) as {
			page: number
		}
		queryClient.prefetchQuery({
			queryKey: [DefectiveGoodsQueryKey.DEFECTIVE_GOODS, params],
			queryFn: async () => await DefectiveGoodsService.getDefectiveGoods(params)
		})
	}, [])
