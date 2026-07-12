import axiosInstance from '@/configs/axios.config'
import type { IEmployee } from '@/features/employee/types'
import type { AxiosRequestConfig } from 'axios'

export class EmployeeService {
	static searchEmployee(params: AxiosRequestConfig['params']) {
		return axiosInstance.get<AxiosRequestConfig['params'], ResponseBody<IEmployee[]>>(`/employee`, {
			params
		})
	}
}
