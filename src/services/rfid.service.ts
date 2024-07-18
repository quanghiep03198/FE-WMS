import { InoutboundFormValues } from '@/app/(features)/_layout.inoutbound/_schemas/-epc-inoutbound.schema'
import { IElectronicProductCode } from '@/common/types/entities'
import axiosInstance from '@/configs/axios.config'

type InOutBoundPayload = InoutboundFormValues & { epc_code: Array<string>; host: string }

export class RFIDService {
	static async getUnscannedEpc(host: string) {
		return await axiosInstance.get<void, ResponseBody<IElectronicProductCode[]>>(`/rfid/read-epc/${host}`)
	}

	static async updateStockMovement(payload: InOutBoundPayload) {
		return await axiosInstance.patch<InOutBoundPayload, ResponseBody<null>>('/rfid/update-stock-movement', payload)
	}

	static async getDatabaseCompatibility() {
		return await axiosInstance.get<void, ResponseBody<string[]>>('/rfid/database-compatibility')
	}

	static async syncEpcOrderCode() {
		return await axiosInstance.patch<void, ResponseBody<boolean>>('/rfid/sync-epc-mono')
	}
}
