import { IDepartment, IWarehouse, IWarehouseStorage } from '@/common/types/entities'
import axiosInstance from '@/configs/axios.config'
import { PartialWarehouseFormValue, StorageFormValue, WarehouseFormValue } from '@/schemas/warehouse.schema'
import { BaseAbstractService } from './base.abstract.service'

export class WarehouseService extends BaseAbstractService {
	static BASE_ENDPOINT: string = '/warehouse'

	static getBaseEndpoint() {
		console.log(WarehouseService.BASE_ENDPOINT)
	}

	static async getWarehouseList() {
		return await axiosInstance.get<void, ResponseBody<IWarehouse[]>>(WarehouseService.BASE_ENDPOINT)
	}

	static getWarehouseByNum(warehouseNum: string) {
		return axiosInstance.get<string, ResponseBody<IWarehouse>>(WarehouseService.BASE_ENDPOINT + '/' + warehouseNum)
	}

	static async getWarehouseDepartments(companyCode: string) {
		return await axiosInstance.get<string, ResponseBody<IDepartment[]>>(
			WarehouseService.BASE_ENDPOINT + '/' + 'departments' + '/' + companyCode
		)
	}

	static async createWarehouse(payload: WarehouseFormValue) {
		return axiosInstance.post<WarehouseFormValue, ResponseBody<null>>(WarehouseService.BASE_ENDPOINT, payload)
	}

	static async updateWarehouse({ id, payload }: { id: string; payload: PartialWarehouseFormValue }) {
		return axiosInstance.patch<PartialWarehouseFormValue, ResponseBody<null>>(
			WarehouseService.BASE_ENDPOINT + '/' + id,
			payload
		)
	}

	static async deleteWarehouse(selectedRecords: Array<string>) {
		return await axiosInstance.delete(WarehouseService.BASE_ENDPOINT, { data: { id: selectedRecords } })
	}
}
