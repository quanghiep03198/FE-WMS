import { ScannedOrder, ScannedOrderSizing } from '@/app/(features)/_layout.inoutbound/_contexts/-page-context'
import {
	InboundFormValues,
	OutboundFormValues
} from '@/app/(features)/_layout.inoutbound/_schemas/epc-inoutbound.schema'
import { IDepartment, IElectronicProductCode } from '@/common/types/entities'
import axiosInstance from '@/configs/axios.config'
import { AxiosRequestConfig } from 'axios'

type InOutBoundPayload = (InboundFormValues | OutboundFormValues) & { mo_no: string; host: string }

export class RFIDService {
	static async getScannedEPC(
		host: string,
		config: AxiosRequestConfig
	): Promise<
		ResponseBody<{
			datalist: IElectronicProductCode[]
			orderList: ScannedOrder[]
			sizing: ScannedOrderSizing[]
		}>
	> {
		return await axiosInstance.get(`/rfid/read-epc/${host}`, config)
	}

	static async updateStockMovement(payload: InOutBoundPayload) {
		return await axiosInstance.patch<InOutBoundPayload, ResponseBody<null>>('/rfid/update-stock-movement', payload)
	}

	static async getDatabaseCompatibility() {
		return await axiosInstance.get<void, ResponseBody<string[]>>('/rfid/database-compatibility')
	}

	static async getInoutboundDept() {
		return await axiosInstance.get<void, ResponseBody<IDepartment[]>>('/rfid/inoutbound-dept')
	}

	static async synchronizeOrderCode() {
		return await axiosInstance.patch<void, ResponseBody<boolean>>('/rfid/sync-epc-mono')
	}
}
