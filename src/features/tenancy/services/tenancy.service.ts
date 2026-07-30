import axiosInstance from '@configs/axios.config'
import type { ITenancy } from '@features/tenancy/types'

export class TenancyService {
	static async getAllTenants() {
		return await axiosInstance.get<void, ResponseBody<ITenancy[]>>('/tenants')
	}

	static async getTenantsByFactory() {
		return await axiosInstance.get<void, ResponseBody<ITenancy>>('/tenants/by-factory')
	}
}
