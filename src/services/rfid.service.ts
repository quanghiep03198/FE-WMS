import { InoutboundPayload } from '@/app/(features)/_layout.finished-production-inoutbound/_schemas/epc-inoutbound.schema'
import { ExchangeEpcFormValue } from '@/app/(features)/_layout.finished-production-inoutbound/_schemas/exchange-epc.schema'
import { FetchFPEpcParams, SearchCustOrderParams } from '@/app/(features)/_layout.finished-production-inoutbound/_types'
import { DeletePMOrderParams, FetchPMEpcParams } from '@/app/(features)/_layout.production-management-inbound/_types'
import { RFIDStreamEventData } from '@/app/_shared/_types/rfid'
import { IElectronicProductCode } from '@/common/types/entities'
import axiosInstance from '@/configs/axios.config'
import { omitBy } from 'lodash'

export class RFIDService {
	protected static readonly TENANCY_REQ_HEADER = 'X-Tenant-Id' // * Tenant ID request header to determine which database to use
	protected static readonly FP_BASE_URL = '/rfid/fp-inventory' // * Finished Production Inventory base API URL
	protected static readonly PM_BASE_URL = '/rfid/pm-inventory' // * Production Management Inventory base API URL

	// #region [RFID] Finished Production APIs
	static async fetchFPData(tenantId: string, params: FetchFPEpcParams) {
		return await axiosInstance.get<void, ResponseBody<Pagination<IElectronicProductCode>>>(
			`${this.FP_BASE_URL}/fetch-epc`,
			{
				headers: { [this.TENANCY_REQ_HEADER]: tenantId },
				params: omitBy(params, (value) => !value || value === 'all')
			}
		)
	}

	static async getFPOrderDetail(tenantId: string) {
		return await axiosInstance.get<void, ResponseBody<RFIDStreamEventData['orders']>>(
			`${this.FP_BASE_URL}/manufacturing-order-detail`,
			{ headers: { [this.TENANCY_REQ_HEADER]: tenantId } }
		)
	}

	static async searchExchangableFPOrder(params: SearchCustOrderParams) {
		return await axiosInstance.get<any, ResponseBody<Record<'mo_no', string>[]>>(
			`${this.FP_BASE_URL}/search-exchangable-order`,
			{ params }
		)
	}

	static async updateFPStockMovement(tenantId: string, payload: InoutboundPayload) {
		return await axiosInstance.patch<InoutboundPayload, ResponseBody<unknown>>(
			`${this.FP_BASE_URL}/update-stock`,
			payload,
			{
				headers: { [this.TENANCY_REQ_HEADER]: tenantId }
			}
		)
	}

	static async deleteUnexpectedFPOrder(tenantId: string, orderCode: string) {
		return await axiosInstance.delete(`${this.FP_BASE_URL}/delete-unexpected-order/${orderCode}`, {
			headers: { [this.TENANCY_REQ_HEADER]: tenantId }
		})
	}

	static async exchangeEpc(tenant: string, payload: Omit<ExchangeEpcFormValue, 'maxExchangableQuantity'>) {
		return await axiosInstance.patch(`${this.FP_BASE_URL}/exchange-epc`, payload, {
			headers: { [this.TENANCY_REQ_HEADER]: tenant }
		})
	}
	// #endregion

	// #region [RFID] Production Management APIs
	static async fetchPMData(tenantId: string, params: FetchPMEpcParams) {
		return await axiosInstance.get<void, ResponseBody<RFIDStreamEventData>>(`${this.PM_BASE_URL}/fetch-epc`, {
			headers: { [this.TENANCY_REQ_HEADER]: tenantId },
			params: omitBy(params, (value) => !value || value === 'all')
		})
	}

	static async updatePMStockMovement(tenantId: string, producingProcess, selectedOrder: string) {
		return await axiosInstance.patch(
			`${this.PM_BASE_URL}/update-stock/${producingProcess}/${selectedOrder}`,
			{},
			{
				headers: { [this.TENANCY_REQ_HEADER]: tenantId }
			}
		)
	}

	static async deleteUnexpectedPMOrder(tenantId: string, params: DeletePMOrderParams) {
		return await axiosInstance.delete<any, ResponseBody<{ affected: number }>>(
			`${this.PM_BASE_URL}/delete-unexpected-order`,
			{
				headers: { [this.TENANCY_REQ_HEADER]: tenantId },
				params
			}
		)
	}
	// #endregion
}
