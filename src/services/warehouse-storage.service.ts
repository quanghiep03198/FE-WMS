import { IWarehouseStorage } from '@/common/types/entities'
import axiosInstance from '@/configs/axios.config'
import { PartialStorageFormValue, StorageFormValue } from '@/schemas/warehouse.schema'

export class WarehouseStorageService {
	static async getWarehouseStorages(warehouseNum: string) {
		return await axiosInstance.get<string, ResponseBody<IWarehouseStorage[]>>(
			`/warehouse/storage-detail/${warehouseNum}`
		)
	}

	static async createWarehouseStorage(payload: StorageFormValue) {
		return axiosInstance.post<Required<StorageFormValue>, ResponseBody<null>>(`/warehouse/storage-detail`, payload)
	}

	static async updateWarehouseStorage(storageNum: string, payload: PartialStorageFormValue) {
		console.log(storageNum)
		return axiosInstance.patch<PartialStorageFormValue, ResponseBody<null>>(
			`/warehouse/storage-detail/${storageNum}`,
			payload
		)
	}

	static async deleteWarehouseStorage(selectedRecords: Array<string>) {
		console.log(selectedRecords)
		return axiosInstance.delete(`/warehouse/storage-detail`, { data: { id: selectedRecords } })
	}
}
