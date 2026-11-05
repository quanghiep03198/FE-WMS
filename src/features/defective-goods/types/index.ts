import type { IBaseEntity } from '@common/types/entities'
import type { IDepartment } from '@features/department/types'
import type {
	CombinationStrategy,
	DefectiveCategory,
	DefectiveGoodsSource,
	DefectiveLocation
} from '../constants/enums'

export interface IDefectiveGoods extends Omit<Required<IBaseEntity>, 'created' | 'updated'> {
	epc: string
	brand_name: string
	defective_category: DefectiveCategory
	color_sn: string
	mo_no?: string
	po?: string
	storage_location: string
	factory_shoes_style: string
	size_numcode: string
	defective_location: DefectiveLocation
	defective_description: string
	shoe_source: DefectiveGoodsSource
	unit: DefectiveGoodsUnit
	assembly_line: Nullish<IDepartment>
	sewing_line: Nullish<IDepartment>
	combination_strategy: CombinationStrategy
}

export type DefectiveGoodsUnit = 'pcs' | 'prs'

type SizeLedger = Array<{ size_numcode: string; qty: number }>

export interface IDefectiveGoodsInventory extends Partial<IDefectiveGoods> {
	size_ledger: SizeLedger
}

export interface IDefectiveGoodsInboundReport extends Partial<IDefectiveGoods> {
	size_ledger: SizeLedger
}
export interface IDefectiveGoodsOutboundReport extends Partial<IDefectiveGoods> {
	size_ledger: SizeLedger
}
