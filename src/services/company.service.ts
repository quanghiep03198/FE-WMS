import { ICompany, IDepartment } from '@/common/types/entities';
import axiosInstance from '@/configs/axios.config';

export class CompanyService {
	public static async getDepartments(): Promise<Array<ICompany & { departments: IDepartment[] }>> {
		const data = await axiosInstance.get<void, Array<ICompany & { departments: IDepartment[] }>>('/companies');
		return data;
	}
}
