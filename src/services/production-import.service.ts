import { IProductionImportOrder } from '@/common/types/entities'
import axiosInstance from '@/configs/axios.config'

export class ProductionImportService {
	static async getProductionImportData(): Promise<ResponseBody<IProductionImportOrder[]>> {
		return await axiosInstance.get('/production-import')
	}

	static async getProductionImportDetails(orderCode: string) {
		return await axiosInstance.get(`/production-import/details/${orderCode}`)
	}

	static async getProductionImportDatalist() {
		return await axiosInstance.get<void, ResponseBody<any>>('/production-import/search-datalist')
	}
}
