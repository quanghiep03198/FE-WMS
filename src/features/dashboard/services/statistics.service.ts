import axiosInstance from '@configs/axios.config'
import type {
	IAnnuallyInOutboundStatistics,
	IAssemblyProductionVolumn,
	IMonthlyInventoryComparison
} from '@features/dashboard/types'
import type { DefectiveCategory } from '@features/defective-goods/constants/enums'

export class StatisticsService {
	static async getMonthlyInventoryComparison() {
		return await axiosInstance.get<void, ResponseBody<IMonthlyInventoryComparison>>(
			'/statistics/inventory-comparison'
		)
	}

	static async getDefectiveGoodsInventoryComposition() {
		return await axiosInstance.get<void, ResponseBody<Array<{ defective_category: DefectiveCategory; qty: number }>>>(
			'/statistics/defective-goods-inventory-composition'
		)
	}

	static async getAnnualInoutboundOverview(params: { 'year:eq': number }) {
		return await axiosInstance.get<void, ResponseBody<IAnnuallyInOutboundStatistics[]>>(
			'/statistics/annual-inoutbound-overview',
			{ params }
		)
	}

	static async getAssemblyProductivity() {
		return await axiosInstance.get<void, ResponseBody<IAssemblyProductionVolumn[]>>(
			'/statistics/assembly-production-volumn'
		)
	}

	static async getLastSixMonthsNetFlow() {
		return await axiosInstance.get<void, ResponseBody<IAnnuallyInOutboundStatistics[]>>('/statistics/net-flow')
	}
}
