import useQueryParams from '@/common/hooks/use-query-params'
import { IDefectiveGoods } from '@/common/types/entities'
import { DefectiveGoodsService } from '@/services/defective-goods.service'
import { useQuery } from '@tanstack/react-query'

export enum DefectiveGoodsQueryKey {
	DEFECTIVE_GOODS = 'DEFECTIVE_GOODS'
}

export const useGetDefectiveGoodsQuery = () => {
	const { searchParams } = useQueryParams<Pick<Pagination<IDefectiveGoods>, 'page' | 'limit'>>({ page: 1, limit: 10 })

	return useQuery({
		queryKey: [DefectiveGoodsQueryKey.DEFECTIVE_GOODS, searchParams],
		queryFn: async () => await DefectiveGoodsService.getDefectiveGoodsList(searchParams)
	})
}
