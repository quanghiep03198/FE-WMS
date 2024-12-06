import { InoutboundPayload } from '@/app/(features)/_layout.finished-production-inoutbound/_schemas/epc-inoutbound.schema'
import { ExchangeEpcFormValue } from '@/app/(features)/_layout.finished-production-inoutbound/_schemas/exchange-epc.schema'
import { FetchFPEpcParams, SearchCustOrderParams } from '@/app/(features)/_layout.finished-production-inoutbound/_types'
import { RFIDStreamEventData } from '@/app/_shared/_types/rfid'
import { RequestHeaders } from '@/common/constants/enums'
import { IElectronicProductCode } from '@/common/types/entities'
import axiosInstance from '@/configs/axios.config'
import { omitBy } from 'lodash'

export class RFIDService {
	// #region [RFID] Finished Production APIs
	static async fetchFPData(tenantId: string, params: FetchFPEpcParams) {
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
		return await axiosInstance.patch<InoutboundPayload, ResponseBody<unknown>>(
			`/rfid/update-stock/${orderCode}`,
			payload,
			{
				headers: { [RequestHeaders.TENANT_ID]: tenantId }
			}
		)
	}

	static async deleteUnexpectedFPOrder(tenantId: string, orderCode: string) {
		return await axiosInstance.delete(`/rfid/delete-unexpected-order/${orderCode}`, {
			headers: { [RequestHeaders.TENANT_ID]: tenantId }
		})
	}

	static async exchangeEpc(tenant: string, payload: Omit<ExchangeEpcFormValue, 'maxExchangableQuantity'>) {
		return await axiosInstance.patch(`/rfid/exchange-epc`, payload, {
			headers: { [RequestHeaders.TENANT_ID]: tenant }
		})
	}
}
