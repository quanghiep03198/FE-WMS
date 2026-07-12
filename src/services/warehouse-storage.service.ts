import type {
	PartialStorageFormValue,
	StorageFormValue
} from '@/app/(features)/_layout.warehouse/-schemas/warehouse.schema'
import axiosInstance from '@/configs/axios.config'
import type { IWarehouseStorage } from '@/features/warehouse/types'

export class WarehouseStorageService {
	static async getWarehouseStorages(warehouseNum: string): Promise<ResponseBody<IWarehouseStorage[]>> {
		return await axiosInstance.get<void, ResponseBody<IWarehouseStorage[]>>(
			`/warehouse/storage-detail/${warehouseNum}`
		)
	}

	static async createWarehouseStorage(payload: StorageFormValue) {
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
