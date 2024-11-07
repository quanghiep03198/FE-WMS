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

export class RFIDService {
	static async fetchFPData(connection: string, page: null | number, selectedOrder: string) {
		const params = omitBy({ page: page, filter: selectedOrder }, (value) => !value || value === 'all')
		return await axiosInstance.get<void, ResponseBody<Pagination<IElectronicProductCode>>>(
			'/rfid/fp-inventory/fetch-epc',
			{
				headers: { ['X-Tenant-Id']: connection },
				params
			}
		)
	}
	static async fetchPMData(connection: string, producingProcess: string, page: null | number) {
		return await axiosInstance.get<void, ResponseBody<RfidPmResponseData>>('/rfid/pm-inventory/fetch-epc', {
			headers: { ['X-Tenant-Id']: connection },
			params: {
				page,
				process: producingProcess
			}
		})
	}

	static async getOrderDetail(connection: string) {
		return await axiosInstance.get<void, ResponseBody<Omit<RFIDStreamEventData, 'epcs'>>>(
			'/rfid/fp-inventory/manufacturing-order-detail',
			{ headers: { ['X-Tenant-Id']: connection } }
		)
	}

	static async searchExchangableOrder(connection: string, params: SearchCustOrderParams) {
		return await axiosInstance.get<any, ResponseBody<Record<'mo_no', string>[]>>(
			'/rfid/fp-inventory/search-exchangable-order',
			{
				headers: { ['X-Tenant-Id']: connection },
				params: { target: params.orderTarget, production_code: params.productionCode, search: params.searchTerm }
			}
		)
	}

	static async updateStockMovement(tenant: string, payload: InoutboundPayload) {
		return await axiosInstance.patch<InoutboundPayload, ResponseBody<unknown>>(
			'/rfid/fp-inventory/update-stock',
			payload,
			{
				headers: { ['X-Tenant-Id']: tenant }
			}
		)
	}

	static async updatePMStockMovement(tenant: string, payload: Array<string>) {
		return await axiosInstance.patch(
			'/rfid/pm-inventory/update-stock',
			{ orders: payload },
			{
				headers: { ['X-Tenant-Id']: tenant }
			}
		)
	}

	static async deleteUnexpectedFPOrder(tenant: string, orderCode: string) {
		return await axiosInstance.delete(`/rfid/fp-inventory/delete-unexpected-order/${orderCode}`, {
			headers: { ['X-Tenant-Id']: tenant }
		})
	}

	static async deleteUnexpectedPMOrder(tenant: string, params: { process: string; order: string }) {
		return await axiosInstance.delete<any, ResponseBody<Pick<Pagination<any>, 'totalDocs' | 'totalPages'>>>(
			`/rfid/pm-inventory/delete-unexpected-order`,
			{
				headers: { ['X-Tenant-Id']: tenant },
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
