import type {
	PartialWarehouseFormValue,
	WarehouseFormValue
} from '@/app/(features)/_layout.warehouse/-schemas/warehouse.schema'
import type { IDepartment } from '@/common/types'
import axiosInstance from '@/configs/axios.config'
import type { IWarehouse } from '@/features/warehouse/types'

export class WarehouseService {
	static async getWarehouseList() {
		return await axiosInstance.get<void, ResponseBody<IWarehouse[]>>(`/warehouse`)
	}

	static getWarehouseByNum(warehouseNum: string) {
		return axiosInstance.get<string, ResponseBody<IWarehouse>>(`/warehouse/${warehouseNum}`)
	}

	/**
	 *
	 * @deprecated
	 * @param companyCode
	 * @returns
	 */
	static async getWarehouseDepartments(companyCode: string) {
		return await axiosInstance.get<string, ResponseBody<IDepartment[]>>(`/warehouse/departments/${companyCode}`)
	}

	static async createWarehouse(payload: WarehouseFormValue) {
		return axiosInstance.post<WarehouseFormValue, ResponseBody<null>>(`/warehouse`, payload)
	}

	static async updateWarehouse({ id, payload }: { id: number; payload: PartialWarehouseFormValue }) {
		return axiosInstance.patch<PartialWarehouseFormValue, ResponseBody<null>>(`/warehouse/${id}`, payload)
	}

	static async deleteWarehouse(selectedRecords: Array<number>) {
		return await axiosInstance.delete<{ id: number[] }, ResponseBody<null>>(`/warehouse`, {
			data: { id: selectedRecords }
		})
	}
}
