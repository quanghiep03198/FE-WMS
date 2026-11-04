import axiosInstance from '@configs/axios.config'
import { omitBy } from 'lodash-es'
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
	static async searchManufacturingOrder(params: { q: Nullish<string> }) {
		return await axiosInstance.get<unknown, ResponseBody<Record<'mo_no', string>[]>>(
			'/order/manufacturing-order/search',
			{
				params: { q: (params.q ??= '') }
			}
		)
	}

	static async searchPurchaseOrder(params: { q: Nullish<string>; filter_all_brands: boolean }) {
		return await axiosInstance.get<unknown, ResponseBody<Array<IPurchaseOrderResult>>>(
			'/order/purchase-order/search',
			{ params: omitBy(params, (value) => typeof value !== 'string' && typeof value !== 'boolean') }
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
