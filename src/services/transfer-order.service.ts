import { UpdateTransferOrderDetailValues } from '@/app/(features)/_layout.transfer-management/_schemas/-transfer-order.schema'
import { ICustomerBrand, ITransferOrder, ITransferOrderData, ITransferOrderDetail } from '@/common/types/entities'
import axiosInstance from '@/configs/axios.config'

type CreateTransferOrderPayload = Pick<ITransferOrderData, 'mo_no' | 'or_no' | 'or_custpo' | 'shoestyle_codefactory'>[]

export class TransferOrderService {
	static async getTransferOrderList() {
		return await axiosInstance.get<void, ResponseBody<ITransferOrder[]>>('/transfer-order')
	}

	static async getTransferOrderDatalist(params: { time_range?: string; brand?: string }) {
		return await axiosInstance.get<void, ResponseBody<ITransferOrderData[]>>('/transfer-order/search-datalist', {
			params: { ...params }
		})
	}

	static async getTransferOrderDetail(transferOrderCode: string) {
		return await axiosInstance.get<void, ResponseBody<ITransferOrderDetail>>(
			`/transfer-order/detail/${transferOrderCode}`
		)
	}

	static async addTransferOrder(payload: CreateTransferOrderPayload) {
		return await axiosInstance.post<CreateTransferOrderPayload, ResponseBody<ITransferOrderData[]>>(
			'/transfer-order',
			{ payload }
		)
	}

	static async updateTransferOrder(transferOrderCode: string, payload: Partial<ITransferOrder>) {
		return await axiosInstance.patch<any, ResponseBody<null>>(`/transfer-order/update/${transferOrderCode}`, payload)
	}

	static async updateMultiTransferOrder(payload: Partial<ITransferOrder>[]) {
		return await axiosInstance.patch<any, ResponseBody<null>>(`/transfer-order/update-multi`, { payload })
	}

	static async deleteTransferOrder(selectedRows) {
		return await axiosInstance.delete<any, ResponseBody<null>>('/transfer-order', {
			data: { transfer_order_code: selectedRows }
		})
	}

	static async updateTransferOrderDetail({
		transferOrderCode,
		payload
	}: {
		transferOrderCode: string
		payload: UpdateTransferOrderDetailValues
	}) {
		return await axiosInstance.patch<any, ResponseBody<ITransferOrderData[]>>(
			`transfer-order/detail/${transferOrderCode}`,
			payload
		)
	}

	static async searchOrderCustomer(search: string) {
		return await axiosInstance.get<string, ResponseBody<ICustomerBrand[]>>('/transfer-order/search-brand', {
			params: { search }
		})
	}
}
