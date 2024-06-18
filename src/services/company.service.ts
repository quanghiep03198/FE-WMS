import axiosInstance from '@/configs/axios.config'
import { BaseAbstractService } from './base.abstract.service'
import { ICompany } from '@/common/types/entities'

export class CompanyService extends BaseAbstractService {
	protected static readonly BASE_ENDPOINT = '/companies'

	static async getCompanies() {
		return await axiosInstance.get<void, ResponseBody<ICompany[]>>(this.BASE_ENDPOINT)
	}
}
