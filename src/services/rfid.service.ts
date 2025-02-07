import { InoutboundPayload } from '@/app/(features)/_layout.finished-production-inoutbound/_schemas/epc-inoutbound.schema'
import { ExchangeEpcFormValue } from '@/app/(features)/_layout.finished-production-inoutbound/_schemas/exchange-epc.schema'
import {
	FetchFPEpcParams,
	RFIDStreamEventData,
	SearchCustOrderParams
} from '@/app/(features)/_layout.finished-production-inoutbound/_types'
import { RequestHeaders } from '@/common/constants/enums'
import { IElectronicProductCode } from '@/common/types/entities'
import axiosInstance from '@/configs/axios.config'
import { omitBy } from 'lodash'

export class RFIDService {
	// #region [RFID] Finished Production APIs
	static async fetchFPInventoryData(tenantId: string, params: FetchFPEpcParams) {
		return await axiosInstance.get<void, ResponseBody<Pagination<IElectronicProductCode>>>(`/rfid/fetch-epc`, {
			headers: { [RequestHeaders.TENANT_ID]: tenantId },
			params: omitBy(params, (value) => !value || value === 'all')
		})
	}

	static async getFPOrderDetail(tenantId: string) {
		return await axiosInstance.get<void, ResponseBody<RFIDStreamEventData['orders']>>(
			`/rfid/manufacturing-order-detail`,
			{ headers: { [RequestHeaders.TENANT_ID]: tenantId } }
		)
	}

	static async searchExchangableFPOrder(params: SearchCustOrderParams) {
		return await axiosInstance.get<any, ResponseBody<Record<'mo_no', string>[]>>(`/rfid/search-exchangable-order`, {
			params
		})
	}

	static async updateFPStockMovement(tenantId: string, orderCode: string, payload: InoutboundPayload) {
		return await axiosInstance.put<InoutboundPayload, ResponseBody<unknown>>(
			`/rfid/update-stock/${orderCode}`,
			payload,
			{
				headers: { [RequestHeaders.TENANT_ID]: tenantId }
			}
		)
	}

	static async deleteScannedEpcs(tenantId: string, filters: Record<string, string | number>) {
		return await axiosInstance.delete(`/rfid/delete-scanned-epcs`, {
			headers: { [RequestHeaders.TENANT_ID]: tenantId },
			params: filters
		})
	}

	static async exchangeEpc(tenantId: string, payload: Omit<ExchangeEpcFormValue, 'maxExchangableQuantity'>) {
		return await axiosInstance.patch(`/rfid/exchange-epc`, payload, {
			headers: { [RequestHeaders.TENANT_ID]: tenantId }
		})
	}
}
