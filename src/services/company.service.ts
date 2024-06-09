import axiosInstance from '@/configs/axios.config'

export class CompanyService {
	public static async getCompanies() {
		return await axiosInstance.get<void, ResponseBody<any>>('/companies')
	}
}
