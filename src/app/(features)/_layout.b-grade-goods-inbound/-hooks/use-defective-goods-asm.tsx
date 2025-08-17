import useQueryParams from '@/common/hooks/use-query-params'
import { IDefectiveGoods } from '@/common/types/entities'
import { DefectiveGoodsService } from '@/services/defective-goods.service'
import { useMutation, useQuery } from '@tanstack/react-query'
import { CreateDefectiveGoodsFormValues } from '../-schemas/defective-goods.schema'

export enum DefectiveGoodsQueryKey {
	DEFECTIVE_GOODS = 'DEFECTIVE_GOODS'
}

export const useGetDefectiveGoodsQuery = () => {
	const { searchParams } = useQueryParams<Pick<Pagination<IDefectiveGoods>, 'page' | 'limit'>>({ page: 1, limit: 10 })

	return useQuery({
		queryKey: [DefectiveGoodsQueryKey.DEFECTIVE_GOODS, searchParams],
		queryFn: async () => await DefectiveGoodsService.getDefectiveGoods(searchParams),
		select: (response) => response.metadata
	})
}

export const useCreateDefectiveGoodsMutation = () => {
	const { searchParams } = useQueryParams<Pick<Pagination<IDefectiveGoods>, 'page' | 'limit'>>({ page: 1, limit: 10 })

	return useMutation({
		mutationKey: [DefectiveGoodsQueryKey.DEFECTIVE_GOODS, searchParams],
		mutationFn: async (data: CreateDefectiveGoodsFormValues) => await DefectiveGoodsService.createDefectiveGoods(data)
	})
}
