import { ITenant } from '@/common/types/entities'
import axiosInstance from '@/configs/axios.config'

export class TenancyService {
	static async getTenantsByFactory() {
		return await axiosInstance.get<void, ResponseBody<ITenant[]>>('/tenants')
	}

	static async getDefaultTenantByFactory() {
		return await axiosInstance.get<void, ResponseBody<ITenant>>('/tenants/default')
	}
}
