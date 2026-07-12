// #region In use Entities

export interface IBaseEntity {
	id: number
	updated?: Date | string
	created?: Date | string
	remark?: string | null
	user_code_created?: string
	user_code_updated?: string
	[key: string]: any
}

export interface ICompany extends IBaseEntity {
	company_code: string
	company_name: string
	factory_code: string
}

export interface IManufacturingOrder extends IBaseEntity {
	mo_no: string
	mat_code: string
	mo_noseq: string
	or_no: string
	or_custpo: string
	color_sn: string
	shoestyle_codefactory: string
	cust_shoes_style: string
	size_code: string
	size_sumqty: number
}

export interface IArchivedFilterFeature {
	factory_shoes_style: string
	colorways: Array<{
		color_sn: string
		batches: Array<{
			mo_no: string
			sizes: Array<string>
		}>
	}>
}

export interface IProductionInventoryFeature {
	brand_name: string
	product_variants: Array<{
		shoes_style: string
		colors: Array<Record<'color', string>>
	}>
}

export interface IInOutBoundReport {
	mo_no: string
	mat_code: string
	factory_shoes_style: string | null
	order_qty: number
	factory_code: string
	color_sn: string
	accumulated_qty: number
	size_data: Array<{
		size_numcode: string
		qty: number
	}>
}

export interface IInboundReport extends IInOutBoundReport {
	shaping_dept_name: string
	storage: string
	daily_inbound_qty: number
}

export interface IOutboundReport extends Omit<IInOutBoundReport, 'size_data'> {
	po: string
	missing_qty: number
	daily_outbound_qty: number
	detail: Array<{
		mo_no: string
		color_sn: string
		sizes: Array<{
			size_numcode: string
			qty: number
		}>
	}>
	overall: Array<{ size_numcode: string; po_size_qty: number; daily_qty: number; missing_qty: number }>
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
		size: string							// * Size code
		order_qty_by_size: number			// * Order quantity by size 
		initial_stock_qty: number			// * Initial stock quantity
		instock_qty: number					// * Instock quantity
		outstock_qty: number					// * Outstock quantity
		actual_instock_qty: number			// * Actual instock quantity
		actual_outstock_qty: number		// * Actual outstock quantity
		final_stock_qty: number				// * Final stock quantity
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

export interface IInboundHistory {
	factory_code_produce: string
	mo_no: string
	brand_name: string
	factory_shoes_style: string
	cust_shoes_style: string
	color: string
	mo_qty: number
	accumulated_inbound_qty: number
	missing_qty: number
	progress: `${number}%`
	order_size_run: Array<{
		size_numcode: string
		qty: number
	}>
	inbound_history_by_size: Array<{
		size_numcode: string
		qty: number
	}>
	daily_inbound_history: Array<{
		size_numcode: string
		qty: number
		inbound_date: Date
	}>
	progress: `${number}%`
}

export interface IOutboundHistory {
	po: string
	po_qty: number
	accumulated_outbound_qty: number
	missing_qty: number
	brand_name: string
	factory_shoes_style: string
	cust_shoes_style: string
	color_sn: string
	outbound_history: Array<{
		outbound_date: string
		mo_no: string
		sizes: Array<{
			size_numcode: string
			qty: number
		}>
	}>
	overall: Array<{
		size_numcode: string
		po_size_qty: number
		acc_qty: number
		missing_qty: number
	}>
	progress: `${number}%`
}

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
