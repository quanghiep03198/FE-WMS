import axiosInstance from '@configs/axios.config'
import type { IDepartment } from '../types'

export class DepartmentService {
	static async getShapingDepartments() {
		return await axiosInstance.get<void, ResponseBody<IDepartment[]>>('/department/assembly')
	}

	static async getSewingDepartments() {
		return await axiosInstance.get<void, ResponseBody<IDepartment[]>>('/department/sewing')
	}

	static async getWarehouseDepartments() {
		return await axiosInstance.get<void, ResponseBody<IDepartment[]>>('/department/warehouse')
	}
}
