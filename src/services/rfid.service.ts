import { OrderItem, OrderSize } from '@/app/(features)/_layout.inoutbound/_contexts/-page-context'
import { InoutboundPayload } from '@/app/(features)/_layout.inoutbound/_schemas/epc-inoutbound.schema'
import { ExchangeEpcFormValue } from '@/app/(features)/_layout.inoutbound/_schemas/exchange-epc.schema'
import { IElectronicProductCode } from '@/common/types/entities'
import axiosInstance from '@/configs/axios.config'
import { AxiosRequestConfig } from 'axios'
import { omitBy } from 'lodash'

export type RFIDStreamEventData = {
	epcs: Pagination<IElectronicProductCode>
	orders: OrderItem[]
	sizes: OrderSize[]
}

export class RFIDService {
	static async fetchEpcManually(connection: string, page: null | number, selectedOrder: string) {
		const params = omitBy({ page: page, filter: selectedOrder }, (value) => !value || value === 'all')
		console.log('params', params)
		return await axiosInstance.get<void, ResponseBody<Pagination<IElectronicProductCode>>>('/rfid/fetch-next-epc', {
			headers: { ['X-Database-Host']: connection },
			params
		})
	}

	static async getOrderDetail(config: AxiosRequestConfig) {
		return await axiosInstance.get<void, ResponseBody<Omit<RFIDStreamEventData, 'epcs'>>>(
			'/rfid/manufacturing-order-detail',
			config
		)
	}

	static async updateStockMovement(host: string, payload: InoutboundPayload) {
		return await axiosInstance.patch<InoutboundPayload, ResponseBody<unknown>>('/rfid/update-stock', payload, {
			headers: { ['X-Database-Host']: host }
		})
	}

	static async deleteUnexpectedOrder(host: string, orderCode: string) {
		return await axiosInstance.delete(`/rfid/delete-unexpected-order/${orderCode}`, {
			headers: { ['X-Database-Host']: host }
		})
	}

	static async exchangeEpc(host: string, payload: Omit<ExchangeEpcFormValue, 'maxExchangableQuantity'>) {
		return await axiosInstance.patch('/rfid/exchange-epc', payload, {
			headers: { ['X-Database-Host']: host }
		})
	}

	/**
	 * @deprecated
	 */
	static async synchronizeOrderCode(host: string) {
		return await axiosInstance.patch<void, ResponseBody<boolean>>('/rfid/sync-epc-mono', undefined, {
			headers: { ['X-Database-Host']: host }
		})
	}
}
