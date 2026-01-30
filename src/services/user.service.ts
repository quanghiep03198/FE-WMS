import { IUser } from '@/common/types/entities'
import axiosInstance from '@/configs/axios.config'
import { AxiosRequestConfig } from 'axios'

export class UserService {
	static async getUsers() {
		return await axiosInstance.get<void, ResponseBody<IUser[]>>('/user')
	}

	static async createUser(payload: unknown) {
		return await axiosInstance.post<void, unknown, unknown>('/user', payload)
	}

	static async updateUserStatus(username: string) {
		return await axiosInstance.delete(`/user/update-status/${username}`)
	}

	static async profile(config?: AxiosRequestConfig): Promise<IUser> {
		return await axiosInstance.get('/user/profile', config)
	}

	static async updatePassword(newPassword: string) {
		return await axiosInstance.patch(`/user/change-password`, newPassword)
	}
}
