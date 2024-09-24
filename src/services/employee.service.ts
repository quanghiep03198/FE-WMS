import { IEmployee } from '@/common/types/entities'
import axiosInstance from '@/configs/axios.config'
import { AxiosRequestConfig } from 'axios'

export class EmployeeService {
	static searchEmployee(params: AxiosRequestConfig['params']) {
		return axiosInstance.get<AxiosRequestConfig['params'], ResponseBody<IEmployee[]>>(`/employee`, {
			params
		})
	}
}
