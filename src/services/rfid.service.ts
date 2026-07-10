import type { SearchEpcParams } from '@/app/(features)/_layout.(rfid)'
import { type RFIDStreamEventData } from '@/app/(features)/_layout.(rfid)'
import type { RFIDDataType } from '@/app/(features)/_layout.(rfid)/-constants'
import type { SearchCustOrderParams } from '@/app/(features)/_layout.(rfid)/finished-goods-inbound'
import type {
	InoutboundPayload,
	OutboundFormValues
} from '@/app/(features)/_layout.(rfid)/finished-goods-inbound/-schemas/epc-inoutbound.schema'
import type {
	ExchangeEpcPayload,
	ExchangeOrderFormValue
} from '@/app/(features)/_layout.(rfid)/finished-goods-inbound/-schemas/exchange-epc.schema'
import type { FilterArchivedEpcParams } from '@/app/(features)/_layout.(rfid)/finished-goods-outbound'
import type {
	CreateRFIDReaderFormValues,
	UpdateRFIDReaderFormValues
} from '@/app/(features)/_layout.rfid-devices-management/-schemas/rfid-device.schema'
import { RequestHeaders } from '@/common/constants/enums'
import type { IArchivedFilterFeature, IElectronicProductCode, IRFIDReaderDevice } from '@/common/types/entities'
import axiosInstance from '@/configs/axios.config'
import { omit, omitBy } from 'lodash-es'

export class RFIDService {
	static async enableDeduplicationInboundEpc(payload: { enabled: boolean }) {
		return await axiosInstance.put<unknown, ResponseBody<number>, { enabled: boolean }>(
			'/rfid/inbound/enable_deduplicate_inbound_epc',
			payload
		)
	}

	// #region Inbound
	static async fetchNextInboundEpc(deviceSerialNumber: string, params: { _page: number; 'mo_no:eq': string }) {
		return await axiosInstance.get<unknown, ResponseBody<Pagination<IElectronicProductCode>>>(
			`/rfid/inbound/fetch-epc`,
			{
				headers: {
					[RequestHeaders.RFID_READER_ID]: deviceSerialNumber
				},
				params: omitBy(params, (value) => !value || value === 'all')
			}
		)
	}

	static async getInboundOrderDetail(deviceSerialNumber: string) {
		return await axiosInstance.get<unknown, ResponseBody<RFIDStreamEventData['orders']>>(
			`/rfid/inbound/manufacturing-order-detail`,
			{
				headers: {
					[RequestHeaders.RFID_READER_ID]: deviceSerialNumber
				}
			}
		)
	}

	static async searchExchangableOrder(params: SearchCustOrderParams) {
		return await axiosInstance.get<unknown, ResponseBody<Record<'mo_no', string>[]>>(
			`/rfid/inbound/search-exchangable-order`,
			{ params }
		)
	}

	static async upsertInboundInventory(payload: InoutboundPayload) {
		return await axiosInstance.put<InoutboundPayload, ResponseBody<unknown>>(`/rfid/inbound/stock-in`, payload)
	}

	static async deleteScannedInboundOrder(commandNumber: string, params: { rescannable: boolean }) {
		return await axiosInstance.delete(`/rfid/inbound/delete-scanned-order/${commandNumber}`, { params })
	}

	static async exchangeEpc(
		deviceSerialNumber: string,
		payload: Omit<ExchangeOrderFormValue, 'maxExchangableQuantity'>
	) {
		return await axiosInstance.patch(`/rfid/inbound/exchange-epc`, payload, {
			headers: {
				[RequestHeaders.RFID_READER_ID]: deviceSerialNumber
			}
		})
	}

	static async upsertEpcInformation(deviceSerialNumber: string, payload: ExchangeEpcPayload) {
		return await axiosInstance.put(`/rfid/inbound/upsert-epc-information`, payload, {
			headers: {
				[RequestHeaders.RFID_READER_ID]: deviceSerialNumber
			}
		})
	}

	// #region Outbound
	static async fetchNextOutboundEpc(params: { _page: number }) {
		return await axiosInstance.get<unknown, ResponseBody<Pagination<IElectronicProductCode>>>(
			`/rfid/outbound/fetch-epc`,
			{ params }
		)
	}

	static async upsertOutboundInventory(payload: OutboundFormValues) {
		return await axiosInstance.put<OutboundFormValues, ResponseBody<unknown>>('/rfid/outbound/update-stock', payload)
	}

	static async getOutboundEpcBySize(params: SearchEpcParams) {
		return await axiosInstance.get<unknown, ResponseBody<Record<'epc', string>[]>>(`/rfid/outbound/get-epc-by-size`, {
			params
		})
	}
	// #endregion

	// #region Shared

	static async getScanningEpcsBySize(stockFlow: 'inbound' | 'outbound', params: SearchEpcParams) {
		return await axiosInstance.get<unknown, ResponseBody<Record<'epc', string>[]>>(
			`/rfid/epcs-by-size/${stockFlow}`,
			{
				params
			}
		)
	}

	static async getDeletedEpcs(type: RFIDDataType, params: Partial<FilterArchivedEpcParams>) {
		return await axiosInstance.get<unknown, ResponseBody<Pagination<IElectronicProductCode & { scanned: boolean }>>>(
			`/rfid/deleted-epcs/${type}`,
			{ params }
		)
	}

	static async deleteScanningEpcs(data: string[], params: { rescannable: boolean }) {
		return await axiosInstance.post(`/rfid/delete-scanning-epcs`, data, { params })
	}

	static async deleteScanningMo(stockFlow: 'inbound' | 'outbound', mo: string, params: { rescannable: boolean }) {
		return await axiosInstance.delete(`/rfid/delete-scanning-mo/${stockFlow}/${mo}`, { params })
	}

	static async getDeletedEpcSepcs() {
		return await axiosInstance.get<unknown, ResponseBody<IArchivedFilterFeature[]>>(`/rfid/deleted-epc-specs`)
	}

	static async restoreDeletedEpcs(payload: Array<string>) {
		return await axiosInstance.patch<Array<string>, ResponseBody<unknown>>(`/rfid/restore-deleted-epcs`, payload)
	}

	// #endregion
	static async getWarehouseRFIDDevices() {
		return await axiosInstance.get<unknown, ResponseBody<IRFIDReaderDevice[]>>(`/rfid/devices`)
	}

	static async createWarehouseRFIDDevice(payload: CreateRFIDReaderFormValues) {
		return await axiosInstance.post<unknown, ResponseBody<unknown>, CreateRFIDReaderFormValues>(
			'/rfid/devices/create',
			payload
		)
	}

	static async updateWarehouseRFIDDevice(payload: UpdateRFIDReaderFormValues) {
		return await axiosInstance.patch<unknown, ResponseBody<unknown>, UpdateRFIDReaderFormValues>(
			`/rfid/devices/update/${payload.device_sn}`,
			omit(payload, ['device_sn'])
		)
	}

	static async deleteWarehouseRFIDDevice(deviceSeriesNumbers: string[]) {
		return await axiosInstance.post<unknown, ResponseBody<unknown>, string[]>(
			`/rfid/devices/delete`,
			deviceSeriesNumbers
		)
	}
}
