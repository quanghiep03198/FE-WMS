import { useSessionStorageState } from 'ahooks'
import type { DefectiveGoodQueryParams } from '../schemas/defective-goods.schema'

export const useSearchDefectiveGoods = () => {
	return useSessionStorageState<Partial<DefectiveGoodQueryParams>>('defectiveGoodsSearchTerms', {
		listenStorageChange: true,
		defaultValue: {}
	})
}
