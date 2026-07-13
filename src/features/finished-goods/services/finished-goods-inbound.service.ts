import axiosInstance from '@/configs/axios.config'
import type { InoutboundPayload } from '@/features/finished-goods/schemas/inoutbound.schema'
import { RequestHeaders } from '@common/constants/enums'
import { omitBy } from 'lodash-es'
import type { IElectronicProductCode } from '../types'

export class FinishedGoodsInboundService {
	static async enableDeduplicationInboundEpc(payload: { enabled: boolean }) {
		return await axiosInstance.put<unknown, ResponseBody<number>, { enabled: boolean }>(
			'/rfid/inbound/enable_deduplicate_inbound_epc',
			payload
		)
	}

	static async getScanningEpcs(deviceSerialNumber: string, params: { _page: number; 'mo_no:eq': string }) {
		return await axiosInstance.get<unknown, ResponseBody<Pagination<IElectronicProductCode>>>(
			`/rfid/inbound/paginated-scanning-epcs`,
			{
				headers: {
					[RequestHeaders.RFID_READER_ID]: deviceSerialNumber
				},
				params: omitBy(params, (value) => !value || value === 'all')
			}
		)
	}

	static async processStockIn(payload: InoutboundPayload) {
		return await axiosInstance.put<InoutboundPayload, ResponseBody<unknown>>(
			`/finished-goods/inbound/stock-in`,
			payload
		)
	}
}
