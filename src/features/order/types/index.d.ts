import type { IBaseEntity } from '@common/types/entities'

export interface IPurchaseOrderDetail {
	po: string
	mo_no: string
	brand_name: string
	shoes_style: string
	color_sn: string
	ship_id: string
	ship_dest_country: string
	ship_type: string
	size_numcode: string
	qty: number
}
export interface IManufacturingOrder extends IBaseEntity {
	mo_no: string
	mat_code: string
	mo_noseq: string
	or_no: string
	or_custpo: string
	color_sn: string
	factory_shoes_style: string
	cust_shoes_style: string
	size_code: string
	size_sumqty: number
}
