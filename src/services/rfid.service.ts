import { OrderItem, OrderSize } from '@/app/(features)/_layout.inoutbound/_contexts/-page-context'
import {
	InboundFormValues,
	OutboundFormValues
} from '@/app/(features)/_layout.inoutbound/_schemas/epc-inoutbound.schema'
import { ExchangeEpcFormValue } from '@/app/(features)/_layout.inoutbound/_schemas/exchange-epc.schema'
import { IDepartment, IElectronicProductCode } from '@/common/types/entities'
import axiosInstance from '@/configs/axios.config'
import { AxiosRequestConfig } from 'axios'

type InoutboundPayload = (InboundFormValues | OutboundFormValues) & { mo_no: string; host: string }

export class RFIDService {
	static async getScannedEPC(config: AxiosRequestConfig): Promise<
		ResponseBody<{
			datalist: IElectronicProductCode[]
			orderList: OrderItem[]
			sizing: OrderSize[]
		}>
	> {
		return await axiosInstance.get(`/rfid/read-epc`, config)
	}

	static async updateStockMovement(payload: InoutboundPayload) {
		return await axiosInstance.patch<InoutboundPayload, ResponseBody<null>>('/rfid/update-stock', payload, {
			headers: { ['X-Database-Host']: payload.host }
		})
	}

	static async getDatabaseCompatibility() {
		return await axiosInstance.get<void, ResponseBody<string[]>>('/rfid/database-compatibility')
	}

	static async getShapingProductLine() {
		return await axiosInstance.get<void, ResponseBody<IDepartment[]>>('/department/shaping-product-line')
	}

	static async synchronizeOrderCode(host: string) {
		return await axiosInstance.patch<void, ResponseBody<boolean>>('/rfid/sync-epc-mono', undefined, {
			headers: { ['X-Database-Host']: host }
		})
	}

	static async deleteUnexpectedOrder(host: string, orderCode: string) {
		return await axiosInstance.delete(`/rfid/delete-unexpected-order/${orderCode}`, {
			headers: { ['X-Database-Host']: host }
		})
	}

	static async getCustOrderList(host: string, searchTerm: string) {
		return await axiosInstance.get<any, ResponseBody<string[]>>('/rfid/cust-mono', {
			params: { search: searchTerm },
			headers: { ['X-Database-Host']: host }
		})
	}

	static async updateInventoryOrderCode(host: string, orderCode: string, payload: any) {
		return await axiosInstance.patch(`/rfid/inventory-order/update/${orderCode}`, payload, {
			headers: { ['X-Database-Host']: host }
		})
	}

	static async exchangeEpc(host: string, payload: Omit<ExchangeEpcFormValue, 'maxExchangableQuantity'>) {
		return await axiosInstance.patch('/rfid/exchange-epc', payload, {
			headers: { ['X-Database-Host']: host }
		})
	}
}
