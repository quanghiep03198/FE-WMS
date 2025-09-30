import { SearchEpcParams, type RFIDStreamEventData } from '@/app/(features)/_layout.(rfid)'
import { RFIDDataType } from '@/app/(features)/_layout.(rfid)/-constants'
import { SearchCustOrderParams } from '@/app/(features)/_layout.(rfid)/finished-goods-inbound'
import {
	InoutboundPayload,
	OutboundFormValues
} from '@/app/(features)/_layout.(rfid)/finished-goods-inbound/-schemas/epc-inoutbound.schema'
import {
	ExchangeEpcFormValue,
	ExchangeEpcPayload
} from '@/app/(features)/_layout.(rfid)/finished-goods-inbound/-schemas/exchange-epc.schema'
import { FilterArchivedEpcParams } from '@/app/(features)/_layout.(rfid)/finished-goods-outbound'
import {
	CreateRFIDReaderFormValues,
	UpdateRFIDReaderFormValues
} from '@/app/(features)/_layout.rfid-devices-management/-schemas/rfid-device.schema'
import { RequestHeaders } from '@/common/constants/enums'
import { IArchivedFilterFeature, IElectronicProductCode } from '@/common/types/entities'
import axiosInstance from '@/configs/axios.config'
import { omit, omitBy } from 'lodash'

export class RFIDService {
	// #region Inbound
	static async fetchNextInboundEpc(params: { _page: number; 'mo_no.eq': string }) {
		return await axiosInstance.get<unknown, ResponseBody<Pagination<IElectronicProductCode>>>(
			`/rfid/inbound/fetch-epc`,
			{
				params: omitBy(params, (value) => !value || value === 'all')
			}
		)
	}

	static async getInboundOrderDetail() {
		return await axiosInstance.get<unknown, ResponseBody<RFIDStreamEventData['orders']>>(
			`/rfid/inbound/manufacturing-order-detail`
		)
	}

	static async getInboundEpcBySize(params: SearchEpcParams) {
		return await axiosInstance.get<unknown, ResponseBody<Record<'epc', string>[]>>(`/rfid/inbound/get-epc-by-size`, {
			params
		})
	}

	static async searchExchangableOrder(params: SearchCustOrderParams) {
		return await axiosInstance.get<unknown, ResponseBody<Record<'mo_no', string>[]>>(
			`/rfid/inbound/search-exchangable-order`,
			{ params }
		)
	}

	static async upsertInboundInventory(
		tenantId: string,
		orderCode: string,
		payload: Omit<InoutboundPayload, 'default_tenant' | 'target_tenant'>
	) {
		return await axiosInstance.put<InoutboundPayload, ResponseBody<unknown>>(
			`/rfid/inbound/update-stock/${orderCode}`,
			payload,
			{
				headers: { [RequestHeaders.TENANT_ID]: tenantId }
			}
		)
	}

	static async deleteScannedInboundEpcs(data: string[], params: { rescannable: boolean }) {
		return await axiosInstance.post(`/rfid/inbound/delete-scanned-epcs`, data, { params })
	}

	static async deleteScannedInboundOrder(commandNumber: string, params: { rescannable: boolean }) {
		return await axiosInstance.delete(`/rfid/inbound/delete-scanned-order/${commandNumber}`, { params })
	}

	static async exchangeEpc(payload: Omit<ExchangeEpcFormValue, 'maxExchangableQuantity'>) {
		return await axiosInstance.patch(`/rfid/inbound/exchange-epc`, payload, {})
	}

	static async upsertEpcInformation(payload: ExchangeEpcPayload) {
		return await axiosInstance.put(`/rfid/inbound/upsert-epc-information`, payload, {})
	}

	static async getDeletedEpcs(params) {
		return await axiosInstance.get('/rfid/inbound/deleted-epcs', { params })
	}

	static async restoreDeleted(params) {
		return await axiosInstance.get('/rfid/inbound/deleted-epcs', { params })
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

	static async deleteScannedOutboundEpcs(data: string[], params: { rescannable: boolean }) {
		return await axiosInstance.post(`/rfid/outbound/delete-scanned-epcs`, data, { params })
	}

	static async deleteScannedOutboundOrder(commandNumber: string, params: { rescannable: boolean }) {
		return await axiosInstance.delete(`/rfid/outbound/delete-scanned-order/${commandNumber}`, { params })
	}

	static async getOutboundEpcBySize(params: SearchEpcParams) {
		return await axiosInstance.get<unknown, ResponseBody<Record<'epc', string>[]>>(`/rfid/outbound/get-epc-by-size`, {
			params
		})
	}
	// #endregion

	// #region Shared
	static async getArchivedEpcs(type: RFIDDataType, params: Partial<FilterArchivedEpcParams>) {
		return await axiosInstance.get<unknown, ResponseBody<Pagination<IElectronicProductCode & { scanned: boolean }>>>(
			`/rfid/archived-epcs/${type}`,
			{ params }
		)
	}

	static async getArchivedEpcFeatures(type: RFIDDataType) {
		return await axiosInstance.get<unknown, ResponseBody<IArchivedFilterFeature[]>>(
			`/rfid/archived-epc-features/${type}`
		)
	}
	static async restoreArchivedEpcs(type: RFIDDataType, payload: Array<IElectronicProductCode>) {
		return await axiosInstance.patch<Array<string>, ResponseBody<unknown>>(
			`/rfid/restore-archived-epcs/${type}`,
			payload
		)
	}

	// #endregion
	static async getWarehouseRFIDDevices() {
		return await axiosInstance.get<unknown, ResponseBody<Record<string, string>[]>>(`/rfid/devices`)
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
