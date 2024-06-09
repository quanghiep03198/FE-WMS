import { IWarehouse } from '@/common/types/entities'
import axiosInstance from '@/configs/axios.config'

export class WarehouseService {
	async getWarehouseList() {
		return await axiosInstance.get<void, ResponseBody<IWarehouse[]>>('/warehouse')
	}
}
