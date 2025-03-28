import { RequestHeaders } from '@/common/constants/enums'
import { IInboundReport, IMonthlyInventoryReport, IPackingReport } from '@/common/types/entities'
import axiosInstance from '@/configs/axios.config'
import { AxiosRequestConfig } from 'axios'

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
		return await axiosInstance.get<void, ResponseBody<IMonthlyInventoryReport[]>>('/report/monthly-inventory', {
			headers: { [RequestHeaders.TENANT_ID]: tenantId },
			params: params
		})
	}

	static async updateInventoryReport(tenantId: string, params: AxiosRequestConfig['params'], payload: any) {
		return await axiosInstance.patch('/report/monthly-inventory/update', payload, {
			headers: { [RequestHeaders.TENANT_ID]: tenantId },
			params
		})
	}

	static async getDailyWeighingReport(params: { 'date.eq': string }) {
		return await axiosInstance.get<void, ResponseBody<IPackingReport[]>>('/report/daily-weighing', {
			headers: { [RequestHeaders.TENANT_ID]: 'tenant-main' },
			params: params
		})
	}

	static async downloadInboundReport(tenantId: string, filter: { 'date.eq': string }) {
		return await axiosInstance.get<void, Blob>('/report/daily-inbound/export', {
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

	static async downloadInventoryReport(tenantId: string, filter: { 'month.eq': string }) {
		return await axiosInstance.get<void, Blob>('/report/monthly-inventory/export', {
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
