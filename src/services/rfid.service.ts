import { EpcCombinationFormValues } from '@/app/(features)/_layout.finished-production-inbound/_schemas/epc-combination.schema'
import {
	InoutboundPayload,
	OutboundFormValues
} from '@/app/(features)/_layout.finished-production-inbound/_schemas/epc-inoutbound.schema'
import { ExchangeEpcFormValue } from '@/app/(features)/_layout.finished-production-inbound/_schemas/exchange-epc.schema'
import { FetchFPEpcParams, SearchCustOrderParams } from '@/app/(features)/_layout.finished-production-inbound/_types'
import { type RFIDStreamEventData } from '@/app/(features)/_types/rfid'
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

	static async deleteScannedInboundEpcs(filters: Record<string, string | number | boolean>) {
		return await axiosInstance.delete(`/rfid/inbound/delete-scanned-epcs`, {
			params: filters
		})
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

	static async deleteScannedOutboundEpcs(filters: Record<string, string | number | boolean>) {
		return await axiosInstance.delete(`/rfid/outbound/delete-scanned-epcs`, {
			params: filters
		})
	}

	// #endregion
	static async getWarehouseRFIDDevices() {
		return await axiosInstance.get<unknown, ResponseBody<Record<string, string>[]>>(`/rfid/devices`)
	}
}
