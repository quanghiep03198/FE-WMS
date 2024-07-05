import { IElectronicProductCode } from '@/common/types/entities'
import axiosInstance from '@/configs/axios.config'
import { InOutBoundFormValues } from '@/schemas/epc-inoutbound.schema'

type InOutBoundPayload = InOutBoundFormValues & { epc_code: Array<string>; host: string }

export class RFIDService {
	static async getUnscannedEPC(host: string) {
		return axiosInstance.get<void, ResponseBody<IElectronicProductCode[]>>(`/rfid/read-epc/${host}`)
	}

	static async updateStockMovement(payload: InOutBoundPayload) {
		return axiosInstance.patch<InOutBoundPayload, ResponseBody<null>>('/rfid/update-stock-movement', payload)
	}

	static async getDatabaseCompatibility() {
		return axiosInstance.get<void, ResponseBody<string[]>>('/rfid/database-compatibility')
	}
}
