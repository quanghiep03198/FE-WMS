import type { DefectiveCategory } from '@/app/(features)/_layout.(defective-goods)/-constants'
import { RequestHeaders } from '@/common/constants/enums'
import type {
	IAnnuallyInOutboundStatistics,
	IAssemblyProductionVolumn,
	IMonthlyInventoryComparison
} from '@/common/types/entities'
import axiosInstance from '@/configs/axios.config'

export class StatisticsService {
	static async getMonthlyInventoryComparison(tenantId: string) {
		return await axiosInstance.get<void, ResponseBody<IMonthlyInventoryComparison>>(
			'/statistics/inventory-comparison',
			{
				headers: {
					[RequestHeaders.TENANT_ID]: tenantId
				}
			}
		)
	}

	static async getDefectiveGoodsInventoryComposition(tenantId: string) {
		return await axiosInstance.get<void, ResponseBody<Array<{ defective_category: DefectiveCategory; qty: number }>>>(
			'/statistics/defective-goods-inventory-composition',
			{
				headers: {
					[RequestHeaders.TENANT_ID]: tenantId
				}
			}
		)
	}

	static async getAnnualInoutboundOverview(tenantId: string, params: { 'year:eq': number }) {
		return await axiosInstance.get<void, ResponseBody<IAnnuallyInOutboundStatistics[]>>(
			'/statistics/annual-inoutbound-overview',
			{
				headers: {
					[RequestHeaders.TENANT_ID]: tenantId
				},
				params
			}
		)
	}

	static async getAssemblyProductivity(tenantId: string) {
		return await axiosInstance.get<void, ResponseBody<IAssemblyProductionVolumn[]>>(
			'/statistics/assembly-production-volumn',
			{
				headers: {
					[RequestHeaders.TENANT_ID]: tenantId
				}
			}
		)
	}

	static async getLastSixMonthsNetFlow(tenantId: string) {
		return await axiosInstance.get<void, ResponseBody<IAnnuallyInOutboundStatistics[]>>('/statistics/net-flow', {
			headers: {
				[RequestHeaders.TENANT_ID]: tenantId
			}
		})
	}
}
