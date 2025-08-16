// import { CreateDefectiveGoodsFormValues } from '@/app/(features)/_layout.b-grade-goods-inbound/-schemas/defective-goods.schema'
import { IDefectiveGoods } from '@/common/types/entities'
import axiosInstance from '@/configs/axios.config'

export class DefectiveGoodsService {
	static async getDefectiveGoodsList(params: Pick<Pagination<IDefectiveGoods>, 'page' | 'limit'>) {
		return await axiosInstance.get<void, ResponseBody<Pagination<IDefectiveGoods>>>('/defective-goods', {
			params
		})
	}
}
