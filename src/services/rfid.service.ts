import { InOutBoundPayload } from '@/app/(features)/_layout.inoutbound/_components/-inoutbound-form'
import { IElectronicProductCode } from '@/common/types/entities'
import axiosInstance from '@/configs/axios.config'
import { InOutBoundFormValues } from '@/schemas/epc-inoutbound.schema'

export class RFIDService {
	protected static BASE_URL = '/rfid'

	static async getUnscannedEPC() {
		return axiosInstance.get<void, ResponseBody<IElectronicProductCode[]>>('/rfid/read-epc')
	}

	static async updateStockMovement(payload: InOutBoundFormValues & { epc_code: Array<string> }) {
		return axiosInstance.patch<InOutBoundPayload, ResponseBody<any>>('/rfid/update-stock-movement', payload)
	}
}
