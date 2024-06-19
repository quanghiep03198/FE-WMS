import { IUser } from '@/common/types/entities'
import axiosInstance from '@/configs/axios.config'
import { LoginFormValues } from '@/schemas/auth.schema'
import { AxiosRequestConfig } from 'axios'
import { BaseAbstractService } from './base.abstract.service'
import { StorageService } from './storage.service'

export class AuthService extends BaseAbstractService {
	static async login(data: LoginFormValues) {
		return await axiosInstance.post<LoginFormValues, ResponseBody<{ token: string }>>('/login', data)
	}
	static async profile() {
		return await axiosInstance.get<void, ResponseBody<IUser>>('/profile')
	}

	static async logout() {
		return await axiosInstance.post('/logout')
	}

	static async refreshToken(id: IUser['user_code'], requestConfig: Pick<AxiosRequestConfig, 'signal'>) {
		return await axiosInstance.get<void, ResponseBody<string>>(`/refresh-token/${id}`, requestConfig)
	}
}
