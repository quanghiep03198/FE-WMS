import type { IArchivedFilterFeature } from '@/common/types/entities'
import { RequestHeaders } from '@common/constants/enums'
import axiosInstance from '@configs/axios.config'
import type { AxiosRequestConfig } from 'axios'
import { omitBy } from 'lodash-es'
import type { StockFlow } from '../constants/enums'
import type { ExchangeEpcPayload, ExchangeOrderFormValue } from '../schemas/exchange-epc.schema'
import type {
	FilterDeletedEpcParams,
	IElectronicProductCode,
	OrderItem,
	SearchCustOrderParams,
	SearchEpcParams
} from '../types'

export class FinishedGoodsSharedService {
	static async searchExchangableMo(params: SearchCustOrderParams) {
		return await axiosInstance.get<unknown, ResponseBody<Record<'mo_no', string>[]>>(
			`/rfid/inbound/search-exchangable-order`,
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

	static async upsertEpcInformation(deviceSerialNumber: string, payload: ExchangeEpcPayload) {
		return await axiosInstance.put(`/finished-goods/upsert-epc-information`, payload, {
			headers: {
				[RequestHeaders.RFID_READER_ID]: deviceSerialNumber
			}
		})
	}

	static async getPaginatedScanningEpcs(
		stockFlow: StockFlow,
		params: { _page: number; 'mo_no:eq'?: string },
		deviceSerialNumber?: string
	) {
		const headers: AxiosRequestConfig['headers'] = {}

		if (typeof deviceSerialNumber === 'string' && deviceSerialNumber.length > 0)
			headers[RequestHeaders.RFID_READER_ID] = deviceSerialNumber

		return await axiosInstance.get<unknown, ResponseBody<Pagination<IElectronicProductCode>>>(
			`/rfid/${stockFlow}/paginated-scanning-epcs`,
			{
				params: omitBy(params, (value) => !value || value === 'all'),
				headers
			}
		)
	}

	static async getScanningEpcs(stockFlow: StockFlow, params: SearchEpcParams, deviceSerialNumber?: string) {
		const headers: AxiosRequestConfig['headers'] = {}

		if (typeof deviceSerialNumber === 'string' && deviceSerialNumber.length > 0)
			headers[RequestHeaders.RFID_READER_ID] = deviceSerialNumber

		return await axiosInstance.get<unknown, ResponseBody<Record<'epc', string>[]>>(
			`/rfid/${stockFlow}/scanning-epcs`,
			{
				params,
				headers
			}
		)
	}

	static async getScanningMos(stockFlow: StockFlow, deviceSerialNumber?: string) {
		const headers: AxiosRequestConfig['headers'] = {}

		if (typeof deviceSerialNumber === 'string' && deviceSerialNumber.length > 0)
			headers[RequestHeaders.RFID_READER_ID] = deviceSerialNumber

		return await axiosInstance.get<unknown, ResponseBody<Array<OrderItem>>>(
			`/rfid/${stockFlow}/scanning-manufacturing-orders`,
			{ headers }
		)
	}

	static async getDeletedEpcs(stockFlow: StockFlow, params: Partial<FilterDeletedEpcParams>) {
		return await axiosInstance.get<unknown, ResponseBody<Pagination<IElectronicProductCode & { scanned: boolean }>>>(
			`/rfid/${stockFlow}/deleted-epcs`,
			{ params }
		)
	}

	static async deleteScanningEpcs(data: string[], params: { rescannable: boolean }) {
		return await axiosInstance.post(`/rfid/scanning-epcs/delete`, data, { params })
	}

	static async deleteScanningMo(stockFlow: StockFlow, mo: string, params: { rescannable: boolean }) {
		return await axiosInstance.delete(`/rfid/${stockFlow}/scanning-manufacturing-orders/delete/${mo}`, { params })
	}

	static async getDeletedEpcSepcs() {
		return await axiosInstance.get<unknown, ResponseBody<IArchivedFilterFeature[]>>(`/rfid/deleted-epc-specs`)
	}

	static async restoreDeletedEpcs(payload: Array<string>) {
		return await axiosInstance.patch<Array<string>, ResponseBody<unknown>>(`/rfid/restore-deleted-epcs`, payload)
	}
}
