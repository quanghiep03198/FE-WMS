import {
	PermissionValueDTO,
	UpdatePermissionDTO
} from '@/app/admin/_layout.permission-management/-schemas/permission-form-value.schema'
import { IPermission } from '@/common/types/entities'
import axiosInstance from '@/configs/axios.config'

export class PermissionService {
	static async getPermission() {
		return await axiosInstance.get<void, ResponseBody<IPermission[]>>('/permissions')
	}

	static async insertPermission(payload: Omit<PermissionValueDTO, 'keyid'>) {
		return await axiosInstance.post(`/permissions/store`, payload)
	}

	static async updatePermission(id: number, payload: UpdatePermissionDTO) {
		return await axiosInstance.patch(`permissions/update/${id}`, payload)
	}

	static async softDeletePermission(id: number) {
		return await axiosInstance.delete<void, ResponseBody<unknown>>(`permissions/soft-delete/${id}`)
	}
}
