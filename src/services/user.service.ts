import {
	CreateUserFormValues,
	UpdateUserFormValues
} from '@/app/(features)/_layout.(admin)/access-management/-schemas/user.schema'
import { UpdatePasswordFormValues } from '@/app/(features)/preferences/_layout.account/-schemas/update-password.schema'
import { UpdateProfileFormValues } from '@/app/(features)/preferences/_layout.account/-schemas/update-profile.schema'
import { IUser } from '@/common/types/entities'
import axiosInstance from '@/configs/axios.config'
import { AxiosRequestConfig } from 'axios'

export class UserService {
	static async getUsers() {
		return await axiosInstance.get<void, ResponseBody<IUser[]>>('/user')
	}

	static async createUser(payload: CreateUserFormValues) {
		return await axiosInstance.post<void, ResponseBody<unknown>, CreateUserFormValues>('/user/create', payload)
	}

	static async updateUser({ username, ...payload }: UpdateUserFormValues) {
		return await axiosInstance.patch<void, ResponseBody<unknown>, UpdateUserFormValues>(
			`/user/update/${username}`,
			payload
		)
	}

	static async updateUserStatus({ username, is_active }: { username: string; is_active: boolean }) {
		return await axiosInstance.patch(`/user/update-status/${username}`, { is_active })
	}

	static async profile(config?: AxiosRequestConfig): Promise<IUser> {
		return await axiosInstance.get('/user/profile', config)
	}

	static async updateProfile(payload: UpdateProfileFormValues) {
		return await axiosInstance.patch(`/user/profile`, payload)
	}

	static async updatePassword(payload: UpdatePasswordFormValues) {
		return await axiosInstance.patch(`/user/change-password`, payload)
	}
}
