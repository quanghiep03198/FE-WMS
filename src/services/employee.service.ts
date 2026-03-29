import type { IEmployee } from '@/common/types/entities'
import axiosInstance from '@/configs/axios.config'
import type { AxiosRequestConfig } from 'axios'

export class EmployeeService {
	static searchEmployee(params: AxiosRequestConfig['params']) {
		return axiosInstance.get<AxiosRequestConfig['params'], ResponseBody<IEmployee[]>>(`/employee`, {
			params
		})
	}
}
