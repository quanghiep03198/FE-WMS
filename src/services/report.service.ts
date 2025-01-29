import { RequestHeaders } from '@/common/constants/enums'
import { IInboundReport } from '@/common/types/entities'
import axiosInstance from '@/configs/axios.config'

export class ReportService {
	static async getInboundReport(tenantId: string, params?: { 'date.eq': string }) {
		return await axiosInstance.get<void, ResponseBody<IInboundReport[]>>('/report', {
			headers: { [RequestHeaders.TENANT_ID]: tenantId },
			params: params
		})
	}

	static async downloadInboundReport(tenantId: string, filter: { 'date.eq': string }) {
		return await axiosInstance.get<void, Blob>('/report/export', {
			headers: { [RequestHeaders.TENANT_ID]: tenantId },
			params: filter,
			responseType: 'blob'
		})
	}
}
