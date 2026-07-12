// import { CreateDefectiveGoodsFormValues } from '@/app/(features)/_layout.b-grade-goods-inbound/-schemas/defective-goods.schema'
import axiosInstance from '@/configs/axios.config'
import type {
	DefectiveGoodsInboundFormValues,
	DefectiveGoodsOutboundFormValues
} from '@/features/defective-goods/schemas/defective-goods-inoutbound.schema'
import type {
	CreateDefectiveGoodsFormValues,
	DefectiveGoodQueryParams,
	UpdateDefectiveGoodsFormValues
} from '@/features/defective-goods/schemas/defective-goods.schema'
import { RequestHeaders } from '@common/constants/enums'
import { omitBy } from 'lodash-es'
import type {
	IDefectiveGoods,
	IDefectiveGoodsInboundReport,
	IDefectiveGoodsInventory,
	IDefectiveGoodsOutboundReport
} from '../types'

/**
 * @classdesc Service for managing defective goods operations.
 */
export class DefectiveGoodsService {
	static async getDefectiveGoods(params: Partial<DefectiveGoodQueryParams>) {
		return await axiosInstance.get<void, ResponseBody<Pagination<IDefectiveGoods>>>('/defective-goods', {
			params
		})
	}

	static async getCanInoutboundEpc({ action, ...params }: Partial<IDefectiveGoods> & { take?: number }) {
		const filterQueries = omitBy(params, (value) => value === undefined || value === null || value === '')
		return await axiosInstance.get<void, ResponseBody<IDefectiveGoods[]>>(
			`/defective-goods/inoutbound-epcs/${action}`,
			{
				params: filterQueries
			}
		)
	}

	static async getDefectiveGoodsInventory(tenantId: string) {
		return await axiosInstance.get<void, ResponseBody<IDefectiveGoodsInventory[]>>('/defective-goods/inventory', {
			headers: {
				[RequestHeaders.TENANT_ID]: tenantId
			}
		})
	}

	static async createDefectiveGoods(payload: CreateDefectiveGoodsFormValues) {
		return await axiosInstance.post<unknown, ResponseBody<unknown>, CreateDefectiveGoodsFormValues>(
			'/defective-goods/create',
			payload
		)
	}

	static async updateDefectiveGoods(id: number, payload: UpdateDefectiveGoodsFormValues) {
		return await axiosInstance.patch(`/defective-goods/update/${id}`, payload)
	}

	static async deleteDefectiveGoods(id: number) {
		return await axiosInstance.delete<void, ResponseBody<unknown>>(`/defective-goods/delete/${id}`)
	}

	static async deleteManyDefectiveGoods(
		payload: { including_ids: number[] | 'all'; excluding_ids: number[] } & DefectiveGoodQueryParams
	) {
		return await axiosInstance.post<
			unknown,
			ResponseBody<unknown>,
			{ including_ids: number[] | 'all'; excluding_ids: number[] } & DefectiveGoodQueryParams
		>(`/defective-goods/delete`, payload)
	}

	static async updateInboundStatus(payload: DefectiveGoodsInboundFormValues) {
		return await axiosInstance.patch<DefectiveGoodsInboundFormValues, ResponseBody<unknown>>(
			'/defective-goods/inbound',
			payload
		)
	}

	static async getInboundReport(tenantId: string, params: { 'date:eq': string }) {
		return await axiosInstance.get<void, ResponseBody<IDefectiveGoodsInboundReport[]>>(
			'/defective-goods/daily-inbound',
			{
				headers: {
					[RequestHeaders.TENANT_ID]: tenantId
				},
				params
			}
		)
	}

	static async getOutboundReport(tenantId: string, params: { 'date:eq': string }) {
		return await axiosInstance.get<void, ResponseBody<IDefectiveGoodsOutboundReport[]>>(
			'/defective-goods/daily-outbound',
			{
				headers: {
					[RequestHeaders.TENANT_ID]: tenantId
				},
				params
			}
		)
	}

	static async downloadInboundReport(tenantId: string, filter: { 'date:eq': string }) {
		return await axiosInstance.get<void, Blob>(`/defective-goods/export-daily-inbound`, {
			headers: { [RequestHeaders.TENANT_ID]: tenantId },
			params: filter,
			responseType: 'blob'
		})
	}

	static async downloadOutboundReport(tenantId: string, filter: { 'date:eq': string }) {
		return await axiosInstance.get<void, Blob>(`/defective-goods/export-daily-outbound`, {
			headers: { [RequestHeaders.TENANT_ID]: tenantId },
			params: filter,
			responseType: 'blob'
		})
	}

	static async updateOutboundStatus(payload: DefectiveGoodsOutboundFormValues) {
		return await axiosInstance.patch<DefectiveGoodsOutboundFormValues, ResponseBody<unknown>>(
			'/defective-goods/outbound',
			payload
		)
	}

	static async downloadDefectiveGoodsInventoryReport(tenantId: string) {
		return await axiosInstance.get<void, Blob>('/defective-goods/export-inventory-report', {
			responseType: 'blob',
			headers: {
				[RequestHeaders.TENANT_ID]: tenantId
			}
		})
	}
}
