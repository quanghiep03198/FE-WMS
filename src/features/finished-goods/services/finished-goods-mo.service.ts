import { RequestHeaders } from '@common/constants/enums'
import axiosInstance from '@configs/axios.config'
import type { ExchangeEpcPayload, ExchangeOrderFormValue } from '../schemas/exchange-epc.schema'
import type { SearchCustOrderParams } from '../types'

export class FinishedGoodsMoService {
	static async searchExchangableMo(params: SearchCustOrderParams) {
		return await axiosInstance.get<unknown, ResponseBody<Record<'mo_no', string>[]>>(
			`/finished-goods/search-exchangable-order`,
			{ params }
		)
	}

	static async exchangeManufacturingOrder(
		deviceSerialNumber: string,
		payload: Omit<ExchangeOrderFormValue, 'maxExchangableQuantity'>
	) {
		return await axiosInstance.patch(`/finished-goods/exchange-manufacturing-order`, payload, {
			headers: {
				[RequestHeaders.RFID_READER_ID]: deviceSerialNumber
			}
		})
	}

	static async upsertEpcsMatch(deviceSerialNumber: string, payload: ExchangeEpcPayload) {
		return await axiosInstance.put(`/finished-goods/upsert-epcs-match`, payload, {
			headers: {
				[RequestHeaders.RFID_READER_ID]: deviceSerialNumber
			}
		})
	}
}
