import axiosInstance from '@/configs/axios.config'
import { BaseAbstractService } from './base.abstract.service'
import { IWarehouseStorageArea } from '@/common/types/entities'
import { PartialStorageFormValue, StorageFormValue } from '@/schemas/warehouse.schema'

export class WarehouseStorageService extends BaseAbstractService {
	protected static readonly BASE_ENDPOINT = '/warehouse/storage-detail'

	/**
	 * Get list of warehouse storage detail
	 * @param warehouseNum
	 * @returns
	 */
	static async getWarehouseStorages(warehouseNum: string) {
		return await axiosInstance.get<string, ResponseBody<IWarehouseStorageArea[]>>(
			WarehouseStorageService.BASE_ENDPOINT + '/' + warehouseNum
		)
	}

	static async createWarehouseStorage(payload: StorageFormValue) {
		return axiosInstance.post<Required<StorageFormValue>, ResponseBody<null>>(
			WarehouseStorageService.BASE_ENDPOINT,
			payload
		)
	}

	static async updateWarehouseStorage(storageNum: string, payload: PartialStorageFormValue) {
		console.log(storageNum)
		return axiosInstance.patch<PartialStorageFormValue, ResponseBody<null>>(
			WarehouseStorageService.BASE_ENDPOINT + '/' + storageNum,
			payload
		)
	}

	static async deleteWarehouseStorage(selectedRecords: Array<string>) {
		console.log(selectedRecords)
		return axiosInstance.delete(WarehouseStorageService.BASE_ENDPOINT, { data: { id: selectedRecords } })
	}
}
