import axiosInstance from '@configs/axios.config'
import type {
	CreateStorageLocationFormValue,
	UpdateStorageLocationFormValue
} from '@features/warehouse/schemas/storage-location.schema'

export class StorageLocationService {
	static async getWarehouseStorageSummary() {
		return await axiosInstance.get<
			void,
			ResponseBody<{ total_storage_capacity: number; total_number_of_storage: number }>
		>(`/storage-location/summary`)
	}

	static async createWarehouseStorage(payload: Required<CreateStorageLocationFormValue>) {
		return await axiosInstance.post<Required<CreateStorageLocationFormValue>, ResponseBody<null>>(
			`/storage-location`,
			payload
		)
	}

	static async updateWarehouseStorage(id: string, payload: Pick<UpdateStorageLocationFormValue, 'name'>) {
		return await axiosInstance.patch<Pick<UpdateStorageLocationFormValue, 'name'>, ResponseBody<null>>(
			`/storage-location/${id}`,
			payload
		)
	}

	static async deleteWarehouseStorage(selectedRecords: Array<string>) {
		return await axiosInstance.delete(`/storage-location`, { data: { ids: selectedRecords } })
	}
}
