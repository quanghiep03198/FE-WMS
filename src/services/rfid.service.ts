import { IDatabaseCompatibility, IElectronicProductCode } from '@/common/types/entities'
import axiosInstance from '@/configs/axios.config'
import { InOutBoundFormValues } from '@/schemas/epc-inoutbound.schema'

type InOutBoundPayload = InOutBoundFormValues & { epc_code: Array<string>; connection: string }

export class RFIDService {
	static async getUnscannedEPC() {
		return axiosInstance.get<void, ResponseBody<IElectronicProductCode[]>>('/rfid/read-epc')
	}

	static async updateStockMovement(payload: InOutBoundPayload) {
		return axiosInstance.patch<InOutBoundPayload, ResponseBody<null>>('/rfid/update-stock-movement', payload)
	}

	static async getDatabaseCompatibility() {
		return axiosInstance.get<void, ResponseBody<IDatabaseCompatibility[]>>('/rfid/database-compatibility')
	}
}
