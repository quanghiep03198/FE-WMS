// import { CreateDefectiveGoodsFormValues } from '@/app/(features)/_layout.b-grade-goods-inbound/-schemas/defective-goods.schema'
import {
	CreateDefectiveGoodsFormValues,
	UpdateDefectiveGoodsFormValues
} from '@/app/(features)/_layout.b-grade-goods-inbound/-schemas/defective-goods.schema'
import { IDefectiveGoods } from '@/common/types/entities'
import axiosInstance from '@/configs/axios.config'

export class DefectiveGoodsService {
	static async getDefectiveGoods(page: number) {
		return await axiosInstance.get<void, ResponseBody<Pagination<IDefectiveGoods>>>('/defective-goods', {
			params: { page }
		})
	}

	static async createDefectiveGoods(payload: CreateDefectiveGoodsFormValues) {
		return await axiosInstance.post<unknown, ResponseBody<unknown>, CreateDefectiveGoodsFormValues>(
			'/defective-goods/create',
			payload
		)
	}

	static async updateDefectiveGoods(id: string, payload: UpdateDefectiveGoodsFormValues) {}

	static async deleteDefectiveGoods(id: string) {
		return await axiosInstance.delete<void, ResponseBody<unknown>>(`/defective-goods/delete/${id}`)
	}
}
