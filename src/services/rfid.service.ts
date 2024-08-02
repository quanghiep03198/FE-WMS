import { ScannedOrder, ScannedOrderSizing } from '@/app/(features)/_layout.inoutbound/_contexts/-page-context'
import {
	InboundFormValues,
	OutboundFormValues
} from '@/app/(features)/_layout.inoutbound/_schemas/epc-inoutbound.schema'
import { IDepartment, IElectronicProductCode } from '@/common/types/entities'
import axiosInstance from '@/configs/axios.config'

type InOutBoundPayload = (InboundFormValues | OutboundFormValues) & { mo_no: string; host: string }

export class RFIDService {
	static async getScannedEPC(host: string) {
		return await axiosInstance.get<
			void,
			ResponseBody<{
				datalist: IElectronicProductCode[]
				orderList: ScannedOrder[]
				sizing: ScannedOrderSizing[]
			}>
		>(`/rfid/read-epc/${host}`)
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

	static async syncEpcOrderCode() {
		return await axiosInstance.patch<void, ResponseBody<boolean>>('/rfid/sync-epc-mono')
	}
}
