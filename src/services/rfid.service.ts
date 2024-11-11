import { OrderItem, OrderSize } from '@/app/(features)/_layout.finished-production-inoutbound/_contexts/-page-context'
import { InoutboundPayload } from '@/app/(features)/_layout.finished-production-inoutbound/_schemas/epc-inoutbound.schema'
import { ExchangeEpcFormValue } from '@/app/(features)/_layout.finished-production-inoutbound/_schemas/exchange-epc.schema'
import { IElectronicProductCode } from '@/common/types/entities'
import axiosInstance from '@/configs/axios.config'
import { omitBy } from 'lodash'

export type RFIDStreamEventData = {
	epcs: Pagination<IElectronicProductCode>
	orders: OrderItem[]
	sizes: OrderSize[]
	has_invalid_epc: boolean
}

export type RfidPmResponseData = {
	epcs: Pagination<IElectronicProductCode>
	orders: Array<string>
	sizes: Record<string, Array<OrderSize>>
}

export type SearchCustOrderParams = {
	orderTarget: string
	productionCode: string
	sizeNumCode?: string
	searchTerm: string
}

export type FetchEpcParams = {
	process: string
	page: number
	selected_order: string
}

export class RFIDService {
	static async fetchFPData(tenantId: string, page: null | number, selectedOrder: string) {
		const params = omitBy({ page: page, filter: selectedOrder }, (value) => !value || value === 'all')
		return await axiosInstance.get<void, ResponseBody<Pagination<IElectronicProductCode>>>(
			'/rfid/fp-inventory/fetch-epc',
			{
				headers: { ['X-Tenant-Id']: tenantId },
				params
			}
		)
	}
	static async fetchPMData(tenantId: string, params: FetchEpcParams) {
		return await axiosInstance.get<void, ResponseBody<RfidPmResponseData>>('/rfid/pm-inventory/fetch-epc', {
			headers: { ['X-Tenant-Id']: tenantId },
			params: omitBy(params, (value) => !value || value === 'all')
		})
	}

	static async getOrderDetail(tenantId: string) {
		return await axiosInstance.get<void, ResponseBody<Omit<RFIDStreamEventData, 'epcs'>>>(
			'/rfid/fp-inventory/manufacturing-order-detail',
			{ headers: { ['X-Tenant-Id']: tenantId } }
		)
	}

	static async searchExchangableOrder(tenantId: string, params: SearchCustOrderParams) {
		return await axiosInstance.get<any, ResponseBody<Record<'mo_no', string>[]>>(
			'/rfid/fp-inventory/search-exchangable-order',
			{
				headers: { ['X-Tenant-Id']: tenantId },
				params: { target: params.orderTarget, production_code: params.productionCode, search: params.searchTerm }
			}
		)
	}

	static async updateStockMovement(tenantId: string, payload: InoutboundPayload) {
		return await axiosInstance.patch<InoutboundPayload, ResponseBody<unknown>>(
			'/rfid/fp-inventory/update-stock',
			payload,
			{
				headers: { ['X-Tenant-Id']: tenantId }
			}
		)
	}

	static async updatePMStockMovement(tenantId: string, producingProcess, selectedOrder: string) {
		console.log('rfid.service.ts :>> ', tenantId)
		return await axiosInstance.patch(
			`/rfid/pm-inventory/update-stock/${producingProcess}/${selectedOrder}`,
			{},
			{
				headers: { ['X-Tenant-Id']: tenantId }
			}
		)
	}

	static async deleteUnexpectedFPOrder(tenantId: string, orderCode: string) {
		return await axiosInstance.delete(`/rfid/fp-inventory/delete-unexpected-order/${orderCode}`, {
			headers: { ['X-Tenant-Id']: tenantId }
		})
	}

	static async deleteUnexpectedPMOrder(tenantId: string, params: { process: string; order: string }) {
		return await axiosInstance.delete<any, ResponseBody<Pick<Pagination<any>, 'totalDocs' | 'totalPages'>>>(
			`/rfid/pm-inventory/delete-unexpected-order`,
			{
				headers: { ['X-Tenant-Id']: tenantId },
				params
			}
		)
	}

	static async exchangeEpc(tenant: string, payload: Omit<ExchangeEpcFormValue, 'maxExchangableQuantity'>) {
		return await axiosInstance.patch('/rfid/fp-inventory/exchange-epc', payload, {
			headers: { ['X-Tenant-Id']: tenant }
		})
	}

	/**
	 * @deprecated
	 */
	static async synchronizeOrderCode(tenant: string) {
		return await axiosInstance.patch<void, ResponseBody<boolean>>('/rfid/fp-inventory/sync-epc-mono', undefined, {
			headers: { ['X-Tenant-Id']: tenant }
		})
	}
}
