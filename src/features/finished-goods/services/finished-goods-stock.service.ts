import axiosInstance from '@configs/axios.config'
import type { StockFlow } from '../constants/enums'
import type { StockBalancesPayload } from '../schemas/inoutbound.schema'
import type { OutboundFormValues } from '../schemas/outbound.schema'
import type { IStockTransaction } from '../types'

export class FinishedGoodsStockService {
	static async stockIn(payload: StockBalancesPayload) {
		return await axiosInstance.put<StockBalancesPayload, ResponseBody<unknown>>(`/finished-goods/stock-in`, payload)
	}

	static async stockOut(payload: OutboundFormValues) {
		return await axiosInstance.put<OutboundFormValues, ResponseBody<unknown>>('/finished-goods/stock-out', payload)
	}

	static async recallFromStock(payload: StockBalancesPayload) {
		return await axiosInstance.put<StockBalancesPayload, ResponseBody<unknown>>(`/finished-goods/recall`, payload)
	}

	static async getCurrentStockTransaction(stockFlow: StockFlow) {
		return await axiosInstance.get<void, ResponseBody<Array<IStockTransaction<typeof stockFlow>>>>(
			`/finished-goods/transactions/${stockFlow}`
		)
	}

	static async rollbackStockTx(stockFlow: StockFlow, transactionId: string) {
		return await axiosInstance.delete<void, ResponseBody<unknown>>(
			`/finished-goods/transactions/${stockFlow}/${transactionId}`
		)
	}
}
