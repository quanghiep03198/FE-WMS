import { UserFormValueDTO } from '@/app/admin/_layout.user-management/-schemas/user-form-value.schema'
import { IUserManagement } from '@/common/types/entities'
import axiosInstance from '@/configs/axios.config'

export class UserManagement {
	static async getUsers() {
		return await axiosInstance.get<void, ResponseBody<IUserManagement[]>>('/admin/user-management')
	}

	static async softDeleteUser(id: number) {
		return await axiosInstance.delete<void, ResponseBody<unknown>>(`/admin/user-management/delete/${id}`)
	}

	static async updateUser(data: UserFormValueDTO) {
		return await axiosInstance.patch(`/admin/user-management/update/${data.keyid}`, data)
	}
}
