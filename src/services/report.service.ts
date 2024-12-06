import { RequestHeaders } from '@/common/constants/enums'
import { IDailyInboundReport, IInboundReport } from '@/common/types/entities'
import axiosInstance from '@/configs/axios.config'

export class ReportService {
	static async getInboundReport(filter: { 'date.eq': string }) {
		return await axiosInstance.get<void, ResponseBody<IInboundReport[]>>('/report', {
			params: filter
		})
	}

	static async getDailyInboundReport(tenantId: string) {
		return await axiosInstance.get<void, ResponseBody<IDailyInboundReport[]>>('/report/daily-inbound-report', {
			headers: {
				[RequestHeaders.TENANT_ID]: tenantId
			}
		})
	}

	static async downloadInboundReport(filter: { 'date.eq': string }) {
		return await axiosInstance.get<void, Blob>('/report/export', {
			params: filter,
			responseType: 'blob'
		})
	}
}
