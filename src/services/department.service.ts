import { IDepartment } from '@/common/types/entities'
import axiosInstance from '@/configs/axios.config'

export class DepartmentService {
	static async getShapingDepartments() {
		return await axiosInstance.get<void, ResponseBody<IDepartment[]>>('/department/shaping-product-line')
	}

	static async getWarehouseDepartments() {
		return await axiosInstance.get<void, ResponseBody<IDepartment[]>>('/department/warehouse')
	}
}
