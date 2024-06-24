import { IDepartment, IWarehouse, IWarehouseStorageArea } from '@/common/types/entities'
import axiosInstance from '@/configs/axios.config'
import { PartialWarehouseFormValue, StorageFormValue, WarehouseFormValue } from '@/schemas/warehouse.schema'
import { BaseAbstractService } from './base.abstract.service'

export class WarehouseService extends BaseAbstractService {
	protected static readonly BASE_WAREHOUSE_ENDPOINT = '/warehouse'
	protected static readonly BASE_STORAGE_ENDPOINT = '/warehouse/storage-detail'

	static async getWarehouseList() {
		return await axiosInstance.get<void, ResponseBody<IWarehouse[]>>(WarehouseService.BASE_WAREHOUSE_ENDPOINT)
	}

	static getWarehouseByNum(warehouseNum: string) {
		return axiosInstance.get<string, ResponseBody<IWarehouse>>(
			WarehouseService.BASE_WAREHOUSE_ENDPOINT + '/' + warehouseNum
		)
	}

	static async getWarehouseDepartments(companyCode: string) {
		return await axiosInstance.get<string, ResponseBody<IDepartment[]>>(
			WarehouseService.BASE_WAREHOUSE_ENDPOINT + '/' + 'departments' + '/' + companyCode
		)
	}

	static async createWarehouse(payload: WarehouseFormValue) {
		return axiosInstance.post<WarehouseFormValue, ResponseBody<null>>(
			WarehouseService.BASE_WAREHOUSE_ENDPOINT,
			payload
		)
	}

	static async updateWarehouse({ id, payload }: { id: string; payload: PartialWarehouseFormValue }) {
		return axiosInstance.patch<PartialWarehouseFormValue, ResponseBody<null>>(
			WarehouseService.BASE_WAREHOUSE_ENDPOINT + '/' + id,
			payload
		)
	}

	static async deleteWarehouse(selectedRecords: Array<string>) {
		return await axiosInstance.delete(WarehouseService.BASE_WAREHOUSE_ENDPOINT, { data: { id: selectedRecords } })
	}
}
