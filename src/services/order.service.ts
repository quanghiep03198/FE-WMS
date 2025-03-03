import axiosInstance from '@/configs/axios.config'

export class OrderService {
	static async searchCommandNumber(params: { q: string }) {
		return await axiosInstance.get<unknown, ResponseBody<Record<'mo_no', string>[]>>('/order/search', {
			params
		})
	}

	static async getCommandNumberDetail(commandNumber: string) {
		return await axiosInstance.get<unknown, ResponseBody<any>>(`/order/detail/${commandNumber}`)
	}
}
