import { PartialStorageFormValue, StorageFormValue } from '@/app/(features)/_layout.warehouse/_schemas/warehouse.schema'
import { IWarehouseStorage } from '@/common/types/entities'
import axiosInstance from '@/configs/axios.config'

export class WarehouseStorageService {
	static async getWarehouseStorages(warehouseNum: string): Promise<ResponseBody<IWarehouseStorage[]>> {
		return await axiosInstance.get<void, ResponseBody<IWarehouseStorage[]>>(
			`/warehouse/storage-detail/${warehouseNum}`
		)
	}

	static async createWarehouseStorage(payload: StorageFormValue) {
		return axiosInstance.post<Required<StorageFormValue>, ResponseBody<null>>(`/warehouse/storage-detail`, payload)
	}

	static async updateWarehouseStorage(id: string | number, payload: PartialStorageFormValue) {
		return axiosInstance.patch<PartialStorageFormValue, ResponseBody<null>>(
			`/warehouse/storage-detail/${id}`,
			payload
		)
	}

	static async deleteWarehouseStorage(selectedRecords: Array<string>) {
		console.log(selectedRecords)
		return axiosInstance.delete(`/warehouse/storage-detail`, { data: { id: selectedRecords } })
	}
}
