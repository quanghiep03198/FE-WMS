import { IManufacturingOrder } from '@/common/types/entities'
import axiosInstance from '@/configs/axios.config'

export class OrderService {
	static async searchCommandNumber(params: { q: string }) {
		return await axiosInstance.get<unknown, ResponseBody<Record<'mo_no', string>[]>>('/order/command-number/search', {
			params
		})
	}

	static async searchPurchaseOrder(params: { q: string }) {
		return await axiosInstance.get<unknown, ResponseBody<Array<{ po: string; is_completed: boolean }>>>(
			'/order/purchase-order/search',
			{
				params
			}
		)
	}

	static async getCommandNumberDetail(commandNumber: string) {
		return await axiosInstance.get<
			unknown,
			ResponseBody<{ orders: Array<IManufacturingOrder>; sizes: Array<{ size_numcode: string; size_qty: number }> }>
		>(`/order/detail/${commandNumber}`)
	}
}
