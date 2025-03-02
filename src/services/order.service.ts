import axiosInstance from '@/configs/axios.config'

export class OrderService {
	static async searchCommandNumber(params: { q: string }) {
		return await axiosInstance.get<unknown, ResponseBody<string[]>>('/order/search-order', { params })
	}

	static async getCommandNumberDetail(commandNumber: string) {
		return await axiosInstance.get<unknown, ResponseBody<any>>(`/order/detail/${commandNumber}`)
	}
}
