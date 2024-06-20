import { IDepartment, IWarehouse } from '@/common/types/entities'
import axiosInstance from '@/configs/axios.config'
import { BaseAbstractService } from './base.abstract.service'
import { PartialWarehouseFormValue, WarehouseFormValue, warehouseFormSchema } from '@/schemas/warehouse.schema'
import { AxiosRequestConfig } from 'axios'
import { z } from 'zod'

export class WarehouseService extends BaseAbstractService {
	protected static readonly BASE_ENDPOINT = '/warehouse'

	static async getWarehouseList(params: AxiosRequestConfig['params']) {
		return await axiosInstance.get<Pick<Pagination, 'page' | 'limit'>, ResponseBody<IWarehouse[]>>(
			WarehouseService.BASE_ENDPOINT,
			{ params }
		)
	}

	static async getWarehouseStorageDetail(warehouseNum: string) {
		return await axiosInstance.get(
			this.createEndpoint(WarehouseService.BASE_ENDPOINT, 'storage-details', warehouseNum)
		)
	}

	static async getWarehouseDepartments(companyCode: string) {
		return await axiosInstance.get<string, ResponseBody<IDepartment[]>>(
			this.createEndpoint(WarehouseService.BASE_ENDPOINT, 'departments', companyCode)
		)
	}

	static async createWarehouse(payload: WarehouseFormValue) {
		return axiosInstance.post<WarehouseFormValue, ResponseBody<null>>(WarehouseService.BASE_ENDPOINT, payload)
	}

	static async updateWarehouse(id: string, payload: PartialWarehouseFormValue) {
		return axiosInstance.patch<PartialWarehouseFormValue, ResponseBody<any>>(
			this.createEndpoint(WarehouseService.BASE_ENDPOINT, id),
			payload
		)
	}

	static async deleteWarehouse(selectedRecords: Array<string>) {
		return await axiosInstance.delete(WarehouseService.BASE_ENDPOINT, { data: { id: selectedRecords } })
	}
}
