import axiosInstance from '@configs/axios.config'
import type { CreateWarehouseFormValue, UpdateWarehouseFormValue } from '@features/warehouse/schemas/warehouse.schema'
import type { IWarehouse } from '@features/warehouse/types'

export class WarehouseService {
	static async getAll() {
		return await axiosInstance.get<void, ResponseBody<IWarehouse[]>>(`/warehouse`)
	}

	static getSummary() {
		return axiosInstance.get<void, ResponseBody<{ total_storage_capacity: number; total_number_of_storage: number }>>(
			`/warehouse/summary`
		)
	}

	static getOne(name: string) {
		return axiosInstance.get<string, ResponseBody<Required<IWarehouse>>>(`/warehouse/${name}`)
	}

	static async create(payload: CreateWarehouseFormValue) {
		return axiosInstance.post<CreateWarehouseFormValue, ResponseBody<unknown>>(`/warehouse`, payload)
	}

	static async update({ _id, ...payload }: UpdateWarehouseFormValue) {
		return axiosInstance.patch<UpdateWarehouseFormValue, ResponseBody<unknown>>(`/warehouse/${_id}`, payload)
	}

	static async delete(selectedRecords: Array<string>) {
		return await axiosInstance.delete<{ ids: string[] }, ResponseBody<unknown>>(`/warehouse`, {
			data: { ids: selectedRecords }
		})
	}
}
