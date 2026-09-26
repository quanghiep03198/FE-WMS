import type { IBaseEntity } from '@common/types/entities'

export interface IPurchaseOrder extends IBaseEntity {
	po: string
	brand_name: string
	factory_shoes_style: string
	cust_shoes_style: string
	color_sn: string
	shipping_method: string
	shipping_destination: string
	packing: Record<string, Record<string, number>>
	shipping_progress: Record<string, { order_qty: number; shipped_out_qty: number }>
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
