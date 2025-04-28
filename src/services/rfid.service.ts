import { EpcCombinationFormValues } from '@/app/(features)/_layout.finished-production-inbound/_schemas/epc-combination.schema'
import {
	InoutboundPayload,
	OutboundFormValues
} from '@/app/(features)/_layout.finished-production-inbound/_schemas/epc-inoutbound.schema'
import { ExchangeEpcFormValue } from '@/app/(features)/_layout.finished-production-inbound/_schemas/exchange-epc.schema'
import { FetchFPEpcParams, SearchCustOrderParams } from '@/app/(features)/_layout.finished-production-inbound/_types'
import { SearchEpcParams, type RFIDStreamEventData } from '@/app/(features)/_types/rfid'
import { RequestHeaders } from '@/common/constants/enums'
import { IElectronicProductCode } from '@/common/types/entities'
import axiosInstance from '@/configs/axios.config'
import { omitBy } from 'lodash'

export class RFIDService {
	// #region Inbound
	static async fetchNextInboundEpc(params: FetchFPEpcParams) {
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

	static async upsertInboundInventory(tenantId: string, orderCode: string, payload: InoutboundPayload) {
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

	static async combineEpcInfor(payload: EpcCombinationFormValues) {
		return await axiosInstance.put(`/rfid/inbound/exchange-epc-by-size`, payload, {})
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
	static async getWarehouseRFIDDevices() {
		return await axiosInstance.get<unknown, ResponseBody<Record<string, string>[]>>(`/rfid/devices`)
	}
}
