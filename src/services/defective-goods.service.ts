// import { CreateDefectiveGoodsFormValues } from '@/app/(features)/_layout.b-grade-goods-inbound/-schemas/defective-goods.schema'
import {
	CreateDefectiveGoodsFormValues,
	DefectiveGoodQueryParams,
	UpdateDefectiveGoodsFormValues
} from '@/app/(features)/_layout.(defective-goods)/defective-goods-epc-combination/-schemas/defective-goods.schema'
import {
	DefectiveGoodsInboundFormValues,
	DefectiveGoodsOutboundFormValues
} from '@/app/(features)/_layout.(defective-goods)/defective-goods-inoutbound/-schemas'
import { RequestHeaders } from '@/common/constants/enums'
import { IDefectiveGoods, IDefectiveGoodsInventory } from '@/common/types/entities'
import axiosInstance from '@/configs/axios.config'

export class DefectiveGoodsService {
	static async getDefectiveGoods(params: Partial<DefectiveGoodQueryParams>) {
		return await axiosInstance.get<void, ResponseBody<Pagination<IDefectiveGoods>>>('/defective-goods', {
			params
		})
	}

	static async getDefectiveGoodsInventory(tenantId: string) {
		return await axiosInstance.get<void, ResponseBody<IDefectiveGoodsInventory[]>>('/defective-goods/inventory', {
			headers: {
				[RequestHeaders.TENANT_ID]: tenantId
			}
		})
	}

	static async createDefectiveGoods(payload: CreateDefectiveGoodsFormValues) {
		return await axiosInstance.post<unknown, ResponseBody<unknown>, CreateDefectiveGoodsFormValues>(
			'/defective-goods/create',
			payload
		)
	}

	static async updateDefectiveGoods(id: number, payload: UpdateDefectiveGoodsFormValues) {
		return await axiosInstance.patch(`/defective-goods/update/${id}`, payload)
	}

	static async deleteDefectiveGoods(id: number) {
		return await axiosInstance.delete<void, ResponseBody<unknown>>(`/defective-goods/delete/${id}`)
	}

	static async deleteManyDefectiveGoods(
		payload: { including_ids: number[] | 'all'; excluding_ids: number[] } & DefectiveGoodQueryParams
	) {
		return await axiosInstance.post<
			unknown,
			ResponseBody<unknown>,
			{ including_ids: number[] | 'all'; excluding_ids: number[] } & DefectiveGoodQueryParams
		>(`/defective-goods/delete`, payload)
	}

	static async updateInboundStatus(payload: DefectiveGoodsInboundFormValues) {
		return await axiosInstance.patch<DefectiveGoodsInboundFormValues, ResponseBody<unknown>>(
			'/defective-goods/inbound',
			payload
		)
	}

	static async updateOutboundStatus(payload: DefectiveGoodsOutboundFormValues) {
		return await axiosInstance.patch<DefectiveGoodsOutboundFormValues, ResponseBody<unknown>>(
			'/defective-goods/outbound',
			payload
		)
	}
}
