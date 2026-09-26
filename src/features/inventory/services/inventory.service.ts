import axiosInstance from '@configs/axios.config'
import type { AxiosRequestConfig } from 'axios'
import type {
	IInboundInventory,
	IMonthlyInventoryAudit,
	IOutboundEstimation,
	IProductionInventoryFeature,
	IProductSizeInventory
} from '../types'

export class InventoryService {
	static async getInventoryAuditReport(params: { 'month:eq': string }) {
		return await axiosInstance.get<void, ResponseBody<IMonthlyInventoryAudit[]>>('/inventory/audit', {
			params: params
		})
	}

	static async downloadInventoryAuditReport(filter: { 'month:eq': string; 'mo_no:in': string }) {
		return await axiosInstance.get<void, Blob>('/inventory/audit/export', {
			params: filter,
			responseType: 'blob'
		})
	}

	static async updateInventoryAuditReport(signal: AbortSignal, params: AxiosRequestConfig['params'], payload: any) {
		return await axiosInstance.patch('/inventory/audit/update', payload, {
			signal,
			params
		})
	}

	public static async checkoutMonthlyInventory(month: string) {
		return await axiosInstance.put(`/inventory/audit/checkout/${month}`)
	}

	static async getProductionInventoryReport(params: Record<'brand_name' | 'shoes_style' | 'color', string>) {
		return await axiosInstance.get<
			void,
			ResponseBody<{
				sizes: IProductSizeInventory[]
				inbound: IInboundInventory[]
				outbound: IOutboundEstimation[]
			}>
		>('/inventory/summary', {
			params: {
				'brand_name:eq': params.brand_name,
				'shoes_style:eq': params.shoes_style,
				'color:eq': params.color
			}
		})
	}

	static async downloadProductionInventoryReport() {
		return await axiosInstance.get('/inventory/summary/export', {
			responseType: 'blob'
		})
	}

	static async getProductionInventoryFeatures() {
		return await axiosInstance.get<void, ResponseBody<IProductionInventoryFeature[]>>(
			'/inventory/production-features'
		)
	}
}
