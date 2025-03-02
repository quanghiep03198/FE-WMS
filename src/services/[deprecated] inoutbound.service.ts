import { IInOutBoundOrder } from '@/common/types/entities'
import axiosInstance from '@/configs/axios.config'
import { AxiosRequestConfig } from 'axios'

export class IOService {
	static getProduction(params: AxiosRequestConfig['params']) {
		return axiosInstance.get<AxiosRequestConfig['params'], ResponseBody<Pagination<IInOutBoundOrder>>>(
			`/production`,
			{ params }
		)
	}
}
