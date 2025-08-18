import useQueryParams from '@/common/hooks/use-query-params'
import { IDefectiveGoods } from '@/common/types/entities'
import { DefectiveGoodsService } from '@/services/defective-goods.service'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CreateDefectiveGoodsFormValues } from '../-schemas/defective-goods.schema'

export enum DefectiveGoodsQueryKey {
	DEFECTIVE_GOODS = 'DEFECTIVE_GOODS'
}

export const useGetDefectiveGoodsQuery = () => {
	const { searchParams } = useQueryParams<Pick<Pagination<IDefectiveGoods>, 'page'>>({ page: 1 })

	return useQuery({
		queryKey: [DefectiveGoodsQueryKey.DEFECTIVE_GOODS, searchParams.page],
		queryFn: async () => await DefectiveGoodsService.getDefectiveGoods(searchParams.page),
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
		mutationFn: async (payload: { id: string; data: CreateDefectiveGoodsFormValues }) =>
			await DefectiveGoodsService.updateDefectiveGoods(payload.id, payload.data),
		onSuccess: () => {
			invalidateQueries()
		}
	})
}

export const useDeleteDefectiveGoodsMutation = () => {
	const invalidateQueries = useInvalidateQuery()

	return useMutation({
		mutationFn: async (id: string) => await DefectiveGoodsService.deleteDefectiveGoods(id),
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
