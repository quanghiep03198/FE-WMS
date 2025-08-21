import { RequestHeaders } from '@/common/constants/enums'
import { IInboundReport, IOutboundReport, IPackingReport } from '@/common/types/entities'
import axiosInstance from '@/configs/axios.config'

export class ReportService {
	static async getInboundReport(tenantId: string, params?: { 'date.eq': string }) {
		return await axiosInstance.get<void, ResponseBody<IInboundReport[]>>('/report/daily-inbound', {
			headers: { [RequestHeaders.TENANT_ID]: tenantId },
			params: params
		})
	}

	static async getOutboundReport(tenantId: string, params?: { 'date.eq': string }) {
		return await axiosInstance.get<void, ResponseBody<IOutboundReport[]>>('/report/daily-outbound', {
			headers: { [RequestHeaders.TENANT_ID]: tenantId },
			params: params
		})
	}

	static async getDailyWeighingReport(params: { 'date.eq': string }) {
		return await axiosInstance.get<void, ResponseBody<IPackingReport[]>>('/report/daily-weighing', {
			headers: { [RequestHeaders.TENANT_ID]: 'tenant-main' },
			params: params
		})
	}

	static async downloadInboundReport(
		reportType: 'daily-productivity' | 'shaping-department-productivity',
		tenantId: string,
		filter: { 'date.eq': string }
	) {
		return await axiosInstance.get<void, Blob>(`/report/daily-inbound/export/${reportType}`, {
			headers: { [RequestHeaders.TENANT_ID]: tenantId },
			params: filter,
			responseType: 'blob'
		})
	}

	static async downloadOutboundReport(tenantId: string, filter: { 'date.eq': string }) {
		return await axiosInstance.get<void, Blob>('/report/daily-outbound/export', {
			headers: { [RequestHeaders.TENANT_ID]: tenantId },
			params: filter,
			responseType: 'blob'
		})
	}

	static async downloadWeighingReport(filter: { 'date.eq': string }) {
		return await axiosInstance.get<void, Blob>('/report/daily-weighing/export', {
			headers: { [RequestHeaders.TENANT_ID]: 'tenant-main' },
			params: filter,
			responseType: 'blob'
		})
	}
}
