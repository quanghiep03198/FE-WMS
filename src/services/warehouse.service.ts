import {
	PartialWarehouseFormValue,
	WarehouseFormValue
} from '@/app/(features)/_layout.warehouse/_schemas/-warehouse.schema'
import { IDepartment, IWarehouse } from '@/common/types/entities'
import axiosInstance from '@/configs/axios.config'

export class WarehouseService {
	static async getWarehouseList() {
		return await axiosInstance.get<void, ResponseBody<IWarehouse[]>>(`/warehouse`)
	}

	static getWarehouseByNum(warehouseNum: string) {
		return axiosInstance.get<string, ResponseBody<IWarehouse>>(`/warehouse/${warehouseNum}`)
	}

	static async getWarehouseDepartments(companyCode: string) {
		return await axiosInstance.get<string, ResponseBody<IDepartment[]>>(`/warehouse/departments/${companyCode}`)
	}

	static async createWarehouse(payload: WarehouseFormValue) {
		return axiosInstance.post<WarehouseFormValue, ResponseBody<null>>(`/warehouse`, payload)
	}

	static async updateWarehouse({ id, payload }: { id: string; payload: PartialWarehouseFormValue }) {
		return axiosInstance.patch<PartialWarehouseFormValue, ResponseBody<null>>(`/warehouse/${id}`, payload)
	}

	static async deleteWarehouse(selectedRecords: Array<string>) {
		return await axiosInstance.delete<{ id: string[] }, ResponseBody<null>>(`/warehouse`, {
			data: { id: selectedRecords }
		})
	}
}
