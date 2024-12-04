import { RequestHeaders } from '@/common/constants/enums'
import { IDailyInboundReport } from '@/common/types/entities'
import axiosInstance from '@/configs/axios.config'

export class InventoryService {
	static async getDailyInboundReport(tenantId: string) {
		return await axiosInstance.get<void, ResponseBody<IDailyInboundReport[]>>('/inventory/daily-inbound-report', {
			headers: {
				[RequestHeaders.TENANT_ID]: tenantId
			}
		})
	}
}
