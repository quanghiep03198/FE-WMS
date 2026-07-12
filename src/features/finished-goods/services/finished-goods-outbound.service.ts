import axiosInstance from '@configs/axios.config'
import type { OutboundFormValues } from '../schemas/inoutbound.schema'
import type { IElectronicProductCode, SearchEpcParams } from '../types'

export class FinishedGoodsOutboundService {
	static async stockout(payload: OutboundFormValues) {
		return await axiosInstance.put<OutboundFormValues, ResponseBody<unknown>>(
			'/finished-goods/outbound/update-stock',
			payload
		)
	}

	static async getScanningEpcs(params: SearchEpcParams) {
		return await axiosInstance.get<unknown, ResponseBody<Record<'epc', string>[]>>(`/rfid/outbound/scanning-epcs`, {
			params
		})
	}

	static async getPaginatedScanningEpcs(params: { _page: number }) {
		return await axiosInstance.get<unknown, ResponseBody<Pagination<IElectronicProductCode>>>(
			`/rfid/outbound/paginated-scanning-epcs`,
			{ params }
		)
	}
}
