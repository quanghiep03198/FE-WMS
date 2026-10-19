import axiosInstance from '@configs/axios.config'
import type { AxiosRequestConfig } from 'axios'
import type {
	IInboundInventory,
	IMonthlyInventoryAudit,
	IOutboundEstimation,
	IProductionInventoryFeature
} from '../types'

export class InventoryService {
	static async getInventoryAuditReport(params: { 'month:eq': string }) {
		return await axiosInstance.get<void, ResponseBody<{ values: IMonthlyInventoryAudit[]; isPlaceholder: boolean }>>(
			'/inventory/audit',
			{
				params: params
			}
		)
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
		return await axiosInstance.put<void, ResponseBody<void>>(`/inventory/audit/checkout/${month}`)
	}

	static async getProductionInventoryReport(
		params: Record<'brand_name' | 'factory_shoes_style' | 'color_sn', string>
	) {
		return await axiosInstance.get<
			void,
			ResponseBody<{
				sizes: Array<{ size_numcode: string; qty: number }>
				inbound: Array<IInboundInventory>
				outbound: Array<IOutboundEstimation>
			}>
		>('/inventory/summary', {
			params: {
				'brand_name:eq': params.brand_name,
				'factory_shoes_style:eq': params.factory_shoes_style,
				'color_sn:eq': params.color_sn
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
