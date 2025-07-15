import { RequestHeaders } from '@/common/constants/enums'
import {
	IInboundInventory,
	IMonthlyInventoryReport,
	IOutboundEstimation,
	IProductionInventoryFeature,
	IProductSizeInventory
} from '@/common/types/entities'
import axiosInstance from '@/configs/axios.config'
import { AxiosRequestConfig } from 'axios'

export class InventoryService {
	static async getInventoryAuditReport(tenantId: string, params: { 'month.eq': string }) {
		return await axiosInstance.get<void, ResponseBody<IMonthlyInventoryReport[]>>('/inventory/audit', {
			headers: { [RequestHeaders.TENANT_ID]: tenantId },
			params: params
		})
	}

	static async downloadInventoryAuditReport(tenantId: string, filter: { 'month.eq': string; 'mo_no.in': string[] }) {
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

	static async getProductionInventoryReport(
		tenantId: string,
		params: Record<'brand_name' | 'shoes_style' | 'color', string>
	) {
		return await axiosInstance.get<
			void,
			ResponseBody<{
				sizes: IProductSizeInventory[]
				inbound: IInboundInventory[]
				outbound: IOutboundEstimation[]
			}>
		>('/inventory/summary', {
			headers: { [RequestHeaders.TENANT_ID]: tenantId },
			params: {
				'brand_name.eq': params.brand_name,
				'shoes_style.eq': params.shoes_style,
				'color.eq': params.color
			}
		})
	}

	static async downloadProductionInventoryReport(tenantId: string) {
		return await axiosInstance.get('/inventory/summary/export', {
			headers: { [RequestHeaders.TENANT_ID]: tenantId },
			responseType: 'blob'
		})
	}

	static async getProductionInventoryFeatures(tenantId: string) {
		return await axiosInstance.get<void, ResponseBody<IProductionInventoryFeature[]>>(
			'/inventory/production-features',
			{
				headers: {
					[RequestHeaders.TENANT_ID]: tenantId
				}
			}
		)
	}
}
