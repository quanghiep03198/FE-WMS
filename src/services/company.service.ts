import { ICompany } from '@/common/types/entities'
import axiosInstance from '@/configs/axios.config'

export class CompanyService {
	static async getCompanies() {
		return await axiosInstance.get<void, ResponseBody<ICompany[]>>(`/companies`)
	}
}
