import { RequestHeaders } from '@/common/constants/enums'
import { IInboundReport, IMonthlyInventoryReport, IPackingReport } from '@/common/types/entities'
import axiosInstance from '@/configs/axios.config'

export class ReportService {
	static async getInboundReport(tenantId: string, params?: { 'date.eq': string }) {
		return await axiosInstance.get<void, ResponseBody<IInboundReport[]>>('/report/daily-inbound', {
			headers: { [RequestHeaders.TENANT_ID]: tenantId },
			params: params
		})
	}

	static async getOutboundReport(tenantId: string, params?: { 'date.eq': string }) {
		return await axiosInstance.get<void, ResponseBody<IInboundReport[]>>('/report/daily-outbound', {
			headers: { [RequestHeaders.TENANT_ID]: tenantId },
			params: params
		})
	}

	static async getMonthlyInventoryReport(tenantId: string, params: { 'month.eq': string }) {
		return await axiosInstance.get<void, ResponseBody<IMonthlyInventoryReport[]>>(
			'/report/monthly-inventory-report',
			{
				headers: { [RequestHeaders.TENANT_ID]: tenantId },
				params: params
			}
		)
	}

	static async getPackingReport(params: { 'date.eq': string }) {
		return await axiosInstance.get<void, ResponseBody<IPackingReport[]>>('/report/daily-packing-report', {
			headers: { [RequestHeaders.TENANT_ID]: 'tenant-main' },
			params: params
		})
	}

	static async downloadInboundReport(tenantId: string, filter: { 'date.eq': string }) {
		return await axiosInstance.get<void, Blob>('/report/export-daily-inbound', {
			headers: { [RequestHeaders.TENANT_ID]: tenantId },
			params: filter,
			responseType: 'blob'
		})
	}

	static async downloadOutboundReport(tenantId: string, filter: { 'date.eq': string }) {
		return await axiosInstance.get<void, Blob>('/report/export-daily-outbound', {
			headers: { [RequestHeaders.TENANT_ID]: tenantId },
			params: filter,
			responseType: 'blob'
		})
	}

	static async downloadInventoryReport(tenantId: string, filter: { 'month.eq': string }) {
		return await axiosInstance.get<void, Blob>('/report/export-monthly-inventory-report', {
			headers: { [RequestHeaders.TENANT_ID]: tenantId },
			params: filter,
			responseType: 'blob'
		})
	}

	static async downloadPackingWeigtReport(filter: { 'month.eq': string }) {
		return await axiosInstance.get<void, Blob>('/report/export-daily-packing-report', {
			headers: { [RequestHeaders.TENANT_ID]: 'tenant-main' },
			params: filter,
			responseType: 'blob'
		})
	}
}
