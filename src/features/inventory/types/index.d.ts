export declare type BaseUpdateUpdateQuery = Pick<IMonthlyInventoryAudit, 'mo_no' | 'year_month'> & {
	size_numcode: string
}
export interface IMonthlyInventoryAudit {
	brand_name: string
	actual_po: string
	po: string
	mo_no: string
	order_qty: number
	or_no: string
	color_sn: string
	factory_shoes_style: string | null
	storage_locations: Array<string>
	inventory_closure_status: 'pending' | 'completed'
	cust_shoes_style: string
	beginning_inventory_qty: number
	total_stocked_in_qty: number
	total_shipped_out_qty: number
	total_supplemental_qty: number
	final_inventory_qty: number
	inv_type: 'FG' | 'IH' // Finished goods | Insole house
	year_month: string
	total_number_of_storage: number
	total_storage_capacity: number
	// prettier-ignore
	inventory_variation: Array<{
		size_numcode: string // * Size code
		order_qty: number // * Order quantity by size 
		beginning_inventory_qty: number // * Initial stock quantity
		stocked_in_qty: number // * Instock quantity
		shipped_out_qty: number // * Outstock quantity
		supplemental_stocked_in_qty: number // * Actual instock quantity
		supplemental_shipped_out_qty: number // * Actual outstock quantity
		final_inventory_qty: number // * Final stock quantity
	}>
}

export type SizeQuantity = Array<{ size_numcode: string; qty: number }>

export interface IProductSizeInventory {
	shoes_style: string
	color: string
	total_qty: number
	inv_sizes: SizeQuantity
}
interface IBaseInventory {
	shoes_style: string
	color: string
	inv_sizes: SizeQuantity
}

export interface IOutboundEstimation extends IBaseInventory {
	po: string
	po_qty: number
	outbound_date: Date
	outbound_qty: number
	last_outbound_time: Date
}

export interface IInboundInventory extends IBaseInventory {
	mo_no: string
	mo_qty: number
	inbound_qty: number
	inspected_qty: number
	last_inbound_time: Date
}
export interface IProductionInventoryFeature {
	brand_name: string
	product_variants: Array<{
		shoes_style: string
		colors: Array<Record<'color', string>>
	}>
}
