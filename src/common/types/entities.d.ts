import { warehouseTypes } from '@/app/(features)/_layout.warehouse/_constants/-warehouse.constant'
import { WarehouseStorageTypes } from '@/app/(features)/_layout.warehouse/_constants/-warehouse.enum'
import { InventoryType } from '../constants/enums'

// #region In use Entities

export interface IBaseEntity {
	id: string
	updated?: Date | string
	created?: Date | string
	remark?: string | null
	[key: string]: any
}

export interface ITenancy {
	id: Tenant
	default?: boolean
	factory: Array<FactoryCode> | FactoryCode
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
	dept_code_upper: string
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

export interface IElectronicProductCode {
	epc: string
	mo_no: string
	shoes_style_code_factory?: string
	color_sn?: string
	size_numcode?: string
	factory_code_produce?: string
	// record_time?: Date
	// rfid_status: 'A' | 'B' | null
	// rfid_use: 'A' | 'C' | 'D' | null
	// storage?: any
}

export interface IInOutBoundReport {
	mo_no: string
	mat_code: string
	shoes_style_code_factory: string | null
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

export interface IMonthlyInventoryReport {
	brand_name: string
	actual_po: string
	po: string
	mo_no: string
	order_qty: number
	or_no: string
	color_sn: string
	shoes_style_code_factory: string | null
	cust_shoestyle: string
	init_inv_qty: number
	total_instock_qty: number
	total_outstock_qty: number
	actual_inv_qty: number
	final_inv_qty: number
	inv_type: InventoryType
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
