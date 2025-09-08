// import { CreateDefectiveGoodsFormValues } from '@/app/(features)/_layout.b-grade-goods-inbound/-schemas/defective-goods.schema'
import {
	CreateDefectiveGoodsFormValues,
	UpdateDefectiveGoodsFormValues
} from '@/app/(features)/_layout.(defective-goods)/defective-goods-epc-combination/-schemas/defective-goods.schema'
import { IDefectiveGoods } from '@/common/types/entities'
import axiosInstance from '@/configs/axios.config'

export class DefectiveGoodsService {
	static async getDefectiveGoods(params: { page: number; q?: string }) {
		return await axiosInstance.get<void, ResponseBody<Pagination<IDefectiveGoods>>>('/defective-goods', {
			params
		})
	}

	static async createDefectiveGoods(payload: CreateDefectiveGoodsFormValues) {
		return await axiosInstance.post<unknown, ResponseBody<unknown>, CreateDefectiveGoodsFormValues>(
			'/defective-goods/create',
			payload
		)
	}

	static async updateDefectiveGoods(id: string, payload: UpdateDefectiveGoodsFormValues) {
		return await axiosInstance.patch(`/defective-goods/update/${id}`, payload)
	}

	static async deleteDefectiveGoods(id: string) {
		return await axiosInstance.delete<void, ResponseBody<unknown>>(`/defective-goods/delete/${id}`)
	}
}
