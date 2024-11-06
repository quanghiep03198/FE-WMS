import { SearchFormValues } from '@/app/(features)/_layout.transfer-management/_schemas/search-customer-brand.schema'
import { UpdateTransferOrderDetailValues } from '@/app/(features)/_layout.transfer-management/_schemas/transfer-order.schema'
import { ICustomerBrand, ITransferOrder, ITransferOrderData, ITransferOrderDetail } from '@/common/types/entities'
import axiosInstance from '@/configs/axios.config'
import { flatten } from 'flat'
import { DateRange } from 'react-day-picker'

export type CreateTransferOrderPayload = Pick<
	ITransferOrderData,
	'mo_no' | 'or_no' | 'or_custpo' | 'shoestyle_codefactory'
>[]
export type TransferOrderDatalistParams = SearchFormValues & { time_range?: DateRange }

export class TransferOrderService {
	static async getTransferOrderList() {
		return await axiosInstance.get<void, ResponseBody<ITransferOrder[]>>('/order/transfer-order')
	}

	static async getTransferOrderDatalist(params: TransferOrderDatalistParams) {
		return await axiosInstance.get<void, ResponseBody<ITransferOrderData[]>>('/order/transfer-order/datalist', {
			params: flatten(params)
		})
	}

	static async getTransferOrderDetail(transferOrderCode: string) {
		return await axiosInstance.get<void, ResponseBody<ITransferOrderDetail>>(
			`/order/transfer-order/detail/${transferOrderCode}`
		)
	}

	static async addTransferOrder(payload: CreateTransferOrderPayload) {
		return await axiosInstance.post<CreateTransferOrderPayload, ResponseBody<ITransferOrderData[]>>(
			'/order/transfer-order',
			{ payload }
		)
	}

	static async updateTransferOrder(transferOrderCode: string, payload: Partial<ITransferOrder>) {
		return await axiosInstance.patch<any, ResponseBody<null>>(
			`/order/transfer-order/update/${transferOrderCode}`,
			payload
		)
	}

	static async updateMultiTransferOrder(payload: Partial<ITransferOrder>[]) {
		return await axiosInstance.patch<any, ResponseBody<null>>(`/order/transfer-order/update-multi`, { payload })
	}

	static async deleteTransferOrder(selectedRows) {
		return await axiosInstance.delete<any, ResponseBody<null>>('/order/transfer-order', {
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
			`/order/transfer-order/detail/${transferOrderCode}`,
			payload
		)
	}

	static async searchOrderCustomer(search: string) {
		return await axiosInstance.get<string, ResponseBody<ICustomerBrand[]>>(
			'/order/transfer-order/search-customer-brand',
			{
				params: { search }
			}
		)
	}
}
