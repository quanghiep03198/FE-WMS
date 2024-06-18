import { IDepartment, IWarehouse } from '@/common/types/entities'
import axiosInstance from '@/configs/axios.config'
import { BaseAbstractService } from './base.abstract.service'
import { WarehouseFormValue } from '@/schemas/warehouse.schema'
import { AxiosRequestConfig } from 'axios'

export class WarehouseService extends BaseAbstractService {
	protected static readonly BASE_ENDPOINT = '/warehouse'

	static async getWarehouseList(queryParams: AxiosRequestConfig['params']) {
		const params = Object.keys(queryParams).length === 0 ? { page: 1, limit: 10 } : queryParams
		return await axiosInstance.get<Pick<Pagination, 'page' | 'limit'>, ResponseBody<Pagination<IWarehouse>>>(
			WarehouseService.BASE_ENDPOINT,
			{ params }
		)
	}

	static async getWarehouseDepartments(companyCode: string) {
		const endpoint = this.createEndpoint(WarehouseService.BASE_ENDPOINT, 'departments', companyCode)
		return await axiosInstance.get<string, ResponseBody<IDepartment[]>>(endpoint)
	}

	static async createWarehouse(payload: WarehouseFormValue) {
		return axiosInstance.post(WarehouseService.BASE_ENDPOINT, payload)
	}
	static async updateWarehouse(id: string, payload: WarehouseFormValue) {
		return axiosInstance.patch(this.createEndpoint(WarehouseService.BASE_ENDPOINT, id), payload)
	}

	static async deleteWarehouse(selectedRecords: Array<string>) {
		return await axiosInstance.delete(WarehouseService.BASE_ENDPOINT, { data: { id: selectedRecords } })
	}
}
