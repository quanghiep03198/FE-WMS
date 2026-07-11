// import { CreateDefectiveGoodsFormValues } from '@/app/(features)/_layout.b-grade-goods-inbound/-schemas/defective-goods.schema'
import type {
	CreateDefectiveGoodsFormValues,
	DefectiveGoodQueryParams,
	UpdateDefectiveGoodsFormValues
} from '@/app/(features)/_layout.(defective-goods)/defective-goods-epc-combination/-schemas/defective-goods.schema'
import type {
	DefectiveGoodsInboundFormValues,
	DefectiveGoodsOutboundFormValues
} from '@/app/(features)/_layout.(defective-goods)/defective-goods-inoutbound/-schemas'
import { RequestHeaders } from '@/common/constants/enums'
import type { IBaseEntity } from '@/common/types/entities'
import axiosInstance from '@/configs/axios.config'
import type { DefectiveCategory, DefectiveGoodsSource, DefectiveLocation } from '@/features/defective-goods/constants'
import { omitBy } from 'lodash-es'

export interface IDefectiveGoods extends IBaseEntity {
	epc: string
	brand_name: string
	defective_category: DefectiveCategory
	color_sn: string
	mo_no?: string
	po?: string
	storage_location: string
	factory_shoes_style: string
	size: string
	defective_location: DefectiveLocation
	defective_description: string
	shoe_source: DefectiveGoodsSource
	unit: 'pcs' | 'prs'
	assembly_line: string | null
	sewing_line: string | null
	ri_cancel: boolean
}

type SizeData = Array<{ size_numcode: string; qty: number }>

export interface IDefectiveGoodsInventory extends Partial<IDefectiveGoods> {
	size_data: SizeData
}

export interface IDefectiveGoodsInboundReport extends Partial<IDefectiveGoods> {
	size_data: SizeData
}
export interface IDefectiveGoodsOutboundReport extends Partial<IDefectiveGoods> {
	size_data: SizeData
}

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
