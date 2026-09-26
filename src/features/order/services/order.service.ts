import axiosInstance from '@configs/axios.config'
import type { IManufacturingOrder, IPurchaseOrder } from '../types'

export interface IPurchaseOrderResult {
	po: string
	brand_name: string
	factory_shoes_style: string
	color_sn: string
	po_qty: number
	accumulated_outbound_qty: number
	is_completed: boolean
}

export class OrderService {
	static async searchManufacturingOrder(params: { q: string }) {
		return await axiosInstance.get<unknown, ResponseBody<Record<'mo_no', string>[]>>(
			'/order/manufacturing-order/search',
			{
				params
			}
		)
	}

	static async searchPurchaseOrder(params: { q: string; filter_all_brands: boolean }) {
		return await axiosInstance.get<unknown, ResponseBody<Array<IPurchaseOrderResult>>>(
			'/order/purchase-order/search',
			{
				params
			}
		)
	}

	static async getOneManufacturingOrder(manufacturingOrder: string) {
		return await axiosInstance.get<
			unknown,
			ResponseBody<IManufacturingOrder & { sizes: Array<{ size_numcode: string; size_qty: number }> }>
		>(`/order/manufacturing-order/${manufacturingOrder}`)
	}

	static async getOnePurchaseOrder(purchaseOrder: string) {
		return await axiosInstance.get<unknown, ResponseBody<IPurchaseOrder>>(`/order/purchase-order/${purchaseOrder}`)
	}
}
