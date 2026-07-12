import axiosInstance from '@/configs/axios.config'
import type { ICompany } from '@common/types/entities'

export class CompanyService {
	static async getCompanies() {
		return await axiosInstance.get<void, ResponseBody<ICompany[]>>(`/companies`)
	}
}
