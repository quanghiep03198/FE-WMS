import { RequestHeaders } from '@/common/constants/enums'
import { IMonthlyInventoryReport } from '@/common/types/entities'
import axiosInstance from '@/configs/axios.config'
import { AxiosRequestConfig } from 'axios'

export class InventoryService {
	static async getInventoryAuditReport(tenantId: string, params: { 'month.eq': string }) {
		return await axiosInstance.get<void, ResponseBody<IMonthlyInventoryReport[]>>('/inventory/audit', {
			headers: { [RequestHeaders.TENANT_ID]: tenantId },
			params: params
		})
	}

	static async downloadInventoryAuditReport(tenantId: string, filter: { 'month.eq': string }) {
		return await axiosInstance.get<void, Blob>('/inventory/audit/export', {
			headers: { [RequestHeaders.TENANT_ID]: tenantId },
			params: filter,
			responseType: 'blob'
		})
	}

	static async updateInventoryAuditReport(
		tenantId: string,
		signal: AbortSignal,
		params: AxiosRequestConfig['params'],
		payload: any
	) {
		return await axiosInstance.patch('/inventory/audit/update', payload, {
			headers: { [RequestHeaders.TENANT_ID]: tenantId },
			signal,
			params
		})
	}

	static async getProductionInventoryReport(params: Record<'shoes_style' | 'color', string>) {
		return await axiosInstance.get<void, ResponseBody<Record<'size' | 'inbound' | 'outbound', any[]>>>(
			'/inventory/production',
			{ params }
		)
	}

	static async getProductionInventoryFeatures(tenantId: string) {
		return await axiosInstance.get<void, ResponseBody<Record<'shoes_style' | 'color', string>[]>>(
			'/inventory/production-features',
			{
				headers: {
					[RequestHeaders.TENANT_ID]: tenantId
				}
			}
		)
	}
}
