import axiosInstance from '@/configs/axios.config'
import type { InoutboundPayload } from '@/features/finished-goods/schemas/inoutbound.schema'
import type { OutboundFormValues } from '../schemas/outbound.schema'

export class FinishedGoodsStockService {
	static async stockIn(payload: InoutboundPayload) {
		return await axiosInstance.put<InoutboundPayload, ResponseBody<unknown>>(`/finished-goods/stock-in`, payload)
	}

	static async stockOut(payload: OutboundFormValues) {
		return await axiosInstance.put<OutboundFormValues, ResponseBody<unknown>>('/finished-goods/update-stock', payload)
	}
}
