import { IProductionImportOrder } from '@/common/types/entities'
import axiosInstance from '@/configs/axios.config'

export type ProductionImportResponse = ResponseBody<{ data: IProductionImportOrder[]; count: number }>

export class ProductionImportService {
	static async getProductionImportData(): Promise<ProductionImportResponse> {
		return await axiosInstance.get('/order/production-import')
	}

	static async getProductionImportDetails(orderCode: string) {
		return await axiosInstance.get(`/order/production-import/details/${orderCode}`)
	}

	static async getProductionImportDatalist() {
		return await axiosInstance.get<void, ResponseBody<any>>('/order/production-import/get-data-import')
	}
	static async addImportOrder(payload) {
		return await axiosInstance.post<void, ResponseBody<any>>('/order/production-import', payload)
	}
	static async deleteImportOrder(selectedRecords) {
		return await axiosInstance.delete<{ id: string[] }, ResponseBody<null>>(`/order/production-import`, {
			data: { id: selectedRecords }
		})
	}
}
