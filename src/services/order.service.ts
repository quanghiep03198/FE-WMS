import { RequestHeaders } from '@/common/constants/enums'
import { IManufacturingOrder, IPurchaseOrderDetail } from '@/common/types/entities'
import axiosInstance from '@/configs/axios.config'

export class OrderService {
	static async searchCommandNumber(tenantId: string, params: { q: string }) {
		return await axiosInstance.get<unknown, ResponseBody<Record<'mo_no', string>[]>>('/order/command-number/search', {
			headers: {
				[RequestHeaders.TENANT_ID]: tenantId
			},
			params
		})
	}

	static async searchPurchaseOrder(tenantId: string, params: { q: string }) {
		return await axiosInstance.get<
			unknown,
			ResponseBody<
				Array<{
					po: string
					brand_name: string
					factory_shoes_style: string
					color_sn: string
					po_qty: number
					accumulated_outbound_qty: number
					is_completed: boolean
				}>
			>
		>('/order/purchase-order/search', {
			headers: {
				[RequestHeaders.TENANT_ID]: tenantId
			},
			params
		})
	}

	static async getCommandNumberDetail(commandNumber: string) {
		return await axiosInstance.get<
			unknown,
			ResponseBody<{ orders: Array<IManufacturingOrder>; sizes: Array<{ size_numcode: string; size_qty: number }> }>
		>(`/order/command-number/${commandNumber}`)
	}

	static async getPurchaseOrderSizeRun(purchaseOrder: string) {
		return await axiosInstance.get<unknown, ResponseBody<IPurchaseOrderDetail[]>>(
			`/order/purchase-order/size-run/${purchaseOrder}`
		)
	}
}
