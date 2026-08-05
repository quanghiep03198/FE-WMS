import axiosInstance from '@configs/axios.config'
import type { StockVariationPayload } from '../schemas/inoutbound.schema'
import type { OutboundFormValues } from '../schemas/outbound.schema'

export class FinishedGoodsStockService {
	static async stockIn(payload: StockVariationPayload) {
		return await axiosInstance.put<StockVariationPayload, ResponseBody<unknown>>(`/finished-goods/stock-in`, payload)
	}

	static async stockOut(payload: OutboundFormValues) {
		return await axiosInstance.put<OutboundFormValues, ResponseBody<unknown>>('/finished-goods/stock-out', payload)
	}

	static async recallFromStock(payload: StockVariationPayload) {
		return await axiosInstance.put<StockVariationPayload, ResponseBody<unknown>>(`/finished-goods/recall`, payload)
	}
}
