import type { IDefectiveGoods } from '@/features/defective-goods/services/defective-goods.service'
import { StockFlow } from '@/features/finished-goods/constants/enums'
import useQueryParams from '@hooks/use-query-params'

export const useFilterQuery = () => {
	return useQueryParams<Partial<IDefectiveGoods> & { take?: number; action?: StockFlow }>({
		action: StockFlow.INBOUND
	})
}
