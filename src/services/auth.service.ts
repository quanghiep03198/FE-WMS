import { IUser } from '@/common/types/entities'
import axiosInstance from '@/configs/axios.config'
import { LoginFormValues } from '@/schemas/auth.schema'
import { AxiosRequestConfig } from 'axios'

export class AuthService {
	public static async login(data: LoginFormValues) {
		return await axiosInstance.post<LoginFormValues, ResponseBody<{ token: string }>>('/login', data)
	}
	public static async profile() {
		return await axiosInstance.get<void, ResponseBody<IUser>>('/profile')
	}

	public static async logout() {
		return await axiosInstance.post('/logout')
	}

	public static async refreshToken(id: IUser['user_code'], requestConfig: Pick<AxiosRequestConfig, 'signal'>) {
		return await axiosInstance.get<void, ResponseBody<string>>(`/refresh-token/${id}`, requestConfig)
	}
}
