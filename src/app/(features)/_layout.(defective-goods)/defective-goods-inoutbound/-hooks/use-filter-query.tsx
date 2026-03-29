import { RFIDDataType } from '@/app/(features)/_layout.(rfid)/-constants'
import useQueryParams from '@/common/hooks/use-query-params'
import type { IDefectiveGoods } from '@/services/defective-goods.service'

export const useFilterQuery = () => {
	return useQueryParams<Partial<IDefectiveGoods> & { take?: number; action?: RFIDDataType }>({
		action: RFIDDataType.INBOUND
	})
}
