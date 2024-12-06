import { IInboundReport } from '@/common/types/entities'
import axiosInstance from '@/configs/axios.config'

export class ReportService {
	static async getInboundReport(filter: { 'date.eq': string }) {
		return await axiosInstance.get<void, ResponseBody<IInboundReport[]>>('/report', {
			params: filter
		})
	}

	static async downloadInboundReport(filter: { 'date.eq': string }) {
		return await axiosInstance.get<void, Blob>('/report/export', {
			params: filter,
			responseType: 'blob'
		})
	}
}
