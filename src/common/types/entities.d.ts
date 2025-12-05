import { warehouseTypes } from '@/app/(features)/_layout.warehouse/_constants/-warehouse.constant'
import { WarehouseStorageTypes } from '@/app/(features)/_layout.warehouse/_constants/-warehouse.enum'
import { RecordStatus } from '../constants/enums'

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

export interface ITenancy {
	id: Tenant
	default?: boolean
	factory: Array<string> | string
	alias: string
	host: string
}
export interface IUser extends IBaseEntity, Pick<ICompany, 'company_code' | 'company_name'> {
	username: string
	display_name: string
	password: string
	employee_code: string
	picture: string
	has_accessibility: boolean | null
	isadmin: boolean | null
}

export interface ICompany extends IBaseEntity {
	company_code: string
	company_name: string
	factory_code: string
}

export interface IDepartment extends IBaseEntity, Pick<ICompany, 'company_code'> {
	dept_code: string
	dept_name: string
}

export interface IWarehouse extends IBaseEntity {
	company_code: string
	warehouse_num: string
	warehouse_name: string
	type_warehouse: keyof typeof warehouseTypes
	area: number
	dept_code: string
	dept_name: string
	remark: string | null
	is_disable: boolean
	is_default: boolean
	employee_code: string | null
	employee_name: string | null
}

export interface IWarehouseStorage
	extends IBaseEntity,
		Pick<IWarehouse, 'warehouse_num' | 'warehouse_name' | 'is_disabled' | 'is_default' | 'remark'> {
	storage_name: string
	storage_num: string
	type_storage: WarehouseStorageTypes | string
}

export interface IEmployee extends IBaseEntity {
	id: number
	employee_name: string
	employee_code: string
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

export interface IElectronicProductCode {
	epc: string
	mo_no: string
	factory_shoes_style?: string
	color_sn?: string
	size_numcode?: string
	factory_code_produce?: string
	station_no?: string
	scannable?: boolean
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

export interface IPackingReport {
	brand_name: string
	po: string
	factory_shoes_style: string
	color_sn: string
	size_data: string
	po_qty: number
	target_box_qty: number
	target_item_qty: number
	weighed_box_qty: number
	unweighed_box_qty: number
}

export interface IPackingManifest extends Omit<IPackingReport, 'color_sn' | 'factory_shoes_style'> {
	shoes_style: string
	color: string
	standard_weight: number
	actual_avg_weight: number | null
	factory_code_produce: string
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
	shoe_style: string
	color: string
	mo_qty: number
	accumulated_inbound_qty: number
	missing_qty: number
	progress: number
	inbound_history: Array<{
		size_numcode: string
		qty: number
		inbound_date: string | Date
	}>
}

export interface IOutboundHistory {
	po: string
	po_qty: number
	outbound_qty: number
	brand_name: string
	shoe_style: string
	color_sn: string
	outbound_date: Date
}

export interface IProductSpecification {
	brand_name: string
	product_variants: Array<{
		factory_shoes_style: string
		cust_shoes_style: string
		specs: Array<{
			color_sn: string
			sizes: Array<{ size: string }>
		}>
	}>
}

export interface IRFIDReaderDevice {
	station_no: string
	device_ant: string
	device_sn: string
	ip_address: string
	ip_port: string
	is_active: RecordStatus
	created: string | Date
	last_used_time: string | Date | null
}

export interface IDefectiveGoods extends IBaseEntity {
	epc: string
	brand_name: string
	defective_category: DefectiveType
	color_sn: string
	mo_no?: string
	po?: string
	storage_location: string
	factory_shoes_style: string
	size: string
	defective_location: DefectiveLocation
	defective_description: string
	assembly_line: string | null
	sewing_line: string | null
	ri_cancel: boolean
}

export interface IMonthlyInventoryComparison {
	comparison_date: string
	current_period: string
	previous_period: string
	curr_period_inventory_qty: number
	prev_period_inventory_qty: number
	curr_month_initial_qty: number
	curr_month_inbound: number
	curr_month_outbound: number
	prev_month_initial_qty: number
	prev_month_inbound: number
	prev_month_outbound: number
	inventory_difference: number
	inventory_percentage_change: number
	inbound_difference: number
	inbound_percentage_change: number
	outbound_difference: number
	outbound_percentage_change: number
	curr_month_turnover: number
	prev_month_turnover: number
	inventory_turnover_difference: number
	turnover_percentage_change: number
}

export interface IAnnuallyInOutboundStatistics {
	year: number
	month: number
	inbound_qty: number
	outbound_qty: number
	net_flow: number
	inbound_outbound_ratio: number
	total_transactions: number
	period_range: string
}

export interface IAssemblyProductionVolumn {
	brand_name: string
	work_date: string
	volumn: number
}

export interface IDefectiveGoodsInventory
	extends Omit<IDefectiveGoods, 'defective_location' | 'defective_description'> {
	size_data: Array<{ size_numcode: string; qty: number }>
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
