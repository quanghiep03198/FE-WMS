import type { IBaseEntity } from '@/common/types/entities'
import type { DefectiveCategory, DefectiveGoodsSource, DefectiveLocation } from '../constants/enums'

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
