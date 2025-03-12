import { EpcCombinationFormValues } from '@/app/(features)/_layout.finished-production-inbound/_schemas/epc-combination.schema'
import { InoutboundPayload } from '@/app/(features)/_layout.finished-production-inbound/_schemas/epc-inoutbound.schema'
import { ExchangeEpcFormValue } from '@/app/(features)/_layout.finished-production-inbound/_schemas/exchange-epc.schema'
import { FetchFPEpcParams, SearchCustOrderParams } from '@/app/(features)/_layout.finished-production-inbound/_types'
import { type RFIDStreamEventData } from '@/app/(features)/_types/rfid'
import { RequestHeaders } from '@/common/constants/enums'
import { IElectronicProductCode } from '@/common/types/entities'
import axiosInstance from '@/configs/axios.config'
import { omitBy } from 'lodash'

export class RFIDService {
	// #region [RFID] Finished Production APIs
	static async fetchNextInboundEpc(tenantId: string, params: FetchFPEpcParams) {
		return await axiosInstance.get<unknown, ResponseBody<Pagination<IElectronicProductCode>>>(
			`/rfid/inbound/fetch-epc`,
			{
				headers: { [RequestHeaders.TENANT_ID]: tenantId },
				params: omitBy(params, (value) => !value || value === 'all')
			}
		)
	}

	static async getFPOrderDetail(tenantId: string) {
		return await axiosInstance.get<unknown, ResponseBody<RFIDStreamEventData['orders']>>(
			`/rfid/inbound/manufacturing-order-detail`,
			{ headers: { [RequestHeaders.TENANT_ID]: tenantId } }
		)
	}

	static async searchExchangableFPOrder(tenantId: string, params: SearchCustOrderParams) {
		return await axiosInstance.get<unknown, ResponseBody<Record<'mo_no', string>[]>>(
			`/rfid/search-exchangable-order`,
			{
				headers: { [RequestHeaders.TENANT_ID]: tenantId },
				params
			}
		)
	}

	static async updateFPStockMovement(tenantId: string, orderCode: string, payload: InoutboundPayload) {
		return await axiosInstance.put<InoutboundPayload, ResponseBody<unknown>>(
			`/rfid/inbound/update-stock/${orderCode}`,
			payload,
			{
				headers: { [RequestHeaders.TENANT_ID]: tenantId }
			}
		)
	}

	static async updateFPStockOut(payload: InoutboundPayload) {
		return await axiosInstance.put<InoutboundPayload, ResponseBody<unknown>>(
			'/rfid/outbound/update-stock-out',
			payload
		)
	}

	static async deleteScannedInboundEpcs(tenantId: string, filters: Record<string, string | number | boolean>) {
		return await axiosInstance.delete(`/rfid/inbound/delete-scanned-epcs`, {
			headers: { [RequestHeaders.TENANT_ID]: tenantId },
			params: filters
		})
	}

	static async exchangeEpc(tenantId: string, payload: Omit<ExchangeEpcFormValue, 'maxExchangableQuantity'>) {
		return await axiosInstance.patch(`/rfid/inbound/exchange-epc`, payload, {
			headers: { [RequestHeaders.TENANT_ID]: tenantId }
		})
	}

	static async combineEpcInfor(tenantId: string, payload: EpcCombinationFormValues) {
		return await axiosInstance.put(`/rfid/inbound/exchange-epc-by-size`, payload, {
			headers: { [RequestHeaders.TENANT_ID]: tenantId }
		})
	}

	// #region Outbound
	static async fetchNextOutboundEpc(params: { _page: number }) {
		return await axiosInstance.get<unknown, ResponseBody<Pagination<IElectronicProductCode>>>(
			`/rfid/outbound/fetch-epc`,
			{
				params
			}
		)
	}

	static async deleteScannedOutboundEpcs(filters: Record<string, string | number | boolean>) {
		return await axiosInstance.delete(`/rfid/outbound/delete-scanned-epcs`, {
			params: filters
		})
	}
}
