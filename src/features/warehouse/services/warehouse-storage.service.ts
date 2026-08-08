import axiosInstance from '@configs/axios.config'
import type { PartialStorageFormValue, StorageFormValue } from '@features/warehouse/schemas/storage-location.schema'
import type { IWarehouseStorage } from '@features/warehouse/types'

export class WarehouseStorageService {
	static async getWarehouseStorages(warehouseNum: string): Promise<ResponseBody<IWarehouseStorage[]>> {
		return await axiosInstance.get<void, ResponseBody<IWarehouseStorage[]>>(
			`/warehouse/storage-detail/${warehouseNum}`
		)
	}

	static async getWarehouseStorageSummary() {
		return await axiosInstance.get<
			void,
			ResponseBody<{ total_storage_capacity: number; total_number_of_storage: number }>
		>(`/warehouse/storage-detail/summary`)
	}

	static async createWarehouseStorage(payload: Required<StorageFormValue>) {
		return axiosInstance.post<Required<StorageFormValue>, ResponseBody<null>>(`/warehouse/storage-detail`, payload)
	}

	static async updateWarehouseStorage(id: number, payload: PartialStorageFormValue) {
		return axiosInstance.patch<PartialStorageFormValue, ResponseBody<null>>(
			`/warehouse/storage-detail/${id}`,
			payload
		)
	}

	static async deleteWarehouseStorage(selectedRecords: Array<number>) {
		return axiosInstance.delete(`/warehouse/storage-detail`, { data: { id: selectedRecords } })
	}
}
