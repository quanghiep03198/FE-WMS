export declare type BaseUpdateUpdateQuery = Pick<
	IMonthlyInventoryAudit,
	'actual_po' | 'mo_no' | 'factory_shoes_style' | 'cust_shoes_style' | 'inv_type' | 'inv_year_month'
> & { size_numcode: string }
export interface IMonthlyInventoryAudit {
	brand_name: string
	actual_po: string
	po: string
	mo_no: string
	order_qty: number
	or_no: string
	color_sn: string
	factory_shoes_style: string | null
	storage: string
	cust_shoes_style: string
	init_inv_qty: number
	total_instock_qty: number
	total_outstock_qty: number
	actual_inv_qty: number
	final_inv_qty: number
	inv_type: 'FG' | 'IH' // Finished goods | Insole house
	inv_year_month: string
	total_number_of_storage: number
	total_storage_capacity: number
	// prettier-ignore
	detail: Array<{
		size: string // * Size code
		order_qty_by_size: number // * Order quantity by size 
		initial_stock_qty: number // * Initial stock quantity
		instock_qty: number // * Instock quantity
		outstock_qty: number // * Outstock quantity
		actual_instock_qty: number // * Actual instock quantity
		actual_outstock_qty: number // * Actual outstock quantity
		final_stock_qty: number // * Final stock quantity
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
