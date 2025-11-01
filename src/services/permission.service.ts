import { IPermission } from '@/common/types/entities'
import axiosInstance from '@/configs/axios.config'

export class PermissionService {
	static async getPermission() {
		return await axiosInstance.get<void, ResponseBody<IPermission[]>>('/permissions')
	}

	static async softDeletePermission(id: number) {
		return await axiosInstance.delete<void, ResponseBody<unknown>>(`permissions/soft-delete/${id}`)
	}
}
