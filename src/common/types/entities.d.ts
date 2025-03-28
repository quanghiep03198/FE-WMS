import { warehouseTypes } from '@/app/(features)/_layout.warehouse/_constants/-warehouse.constant'
import { WarehouseStorageTypes } from '@/app/(features)/_layout.warehouse/_constants/-warehouse.enum'
import { ProductionApprovalStatus, TransferOrderApprovalStatus } from '../constants/enums'

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
	record_time: Date
	epc: string
	mo_no: string
	rfid_status: 'A' | 'B' | null
	rfid_use: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | null
	storage?: any
}

export interface IInOutBoundReport {
	mo_no: string
	mat_code: string
	shoes_style_code_factory: string | null
	order_qty: number
	factory_code: string
	mat_ecolor: string
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
export interface IOutboundReport extends IInOutBoundReport {
	po: string
	missing_qty: number
	daily_outbound_qty: number
}

export interface IMonthlyInventoryReport {
	brand_name: string
	po: string
	mo_no: string
	order_qty: number
	or_no: string
	shoes_style_code_factory: string | null
	cust_shoestyle: string
	init_inv_qty: number
	total_instock_qty: number
	total_outstock_qty: number
	actual_inv_qty: number
	final_inv_qty: number
	// prettier-ignore
	size_data: Array<{
		size: string			// * Size code
		ms_qty: number			// * Monthly stock quantity
		int_qty: number		// * Initial quantity
		ist_qty: number		// * Instock quantity
		mn_ist_qty: number	// * Manual instock quantity
		ost_qty: number		// * Outstock quantity
		mn_ost_qty: number	// * Manual outstock quantity
		fnl_qty: number		// * Final quantity
	}>
}

// #region Deprecated

/**
 * @deprecated
 */
export interface ITransferOrder extends IBaseEntity {
	custbrand_id: string
	brand_name: string
	transfer_order_code: string // need to be rename
	kg_no: string
	mo_no: string
	or_no: string
	or_custpo: string
	shoestyle_codefactory: string
	or_warehouse_num: string | null
	or_warehouse_name: string | null
	or_storage_num: string | null
	or_storage_name: string | null
	new_warehouse_num: string | null
	new_warehouse_name: string | null
	new_storage_num: string | null
	new_storage_name: string | null
	status_approve: TransferOrderApprovalStatus
	employee_name_approve: string | null
	approve_date: Date | null
}

export interface IPackingReport {
	brand_name: string
	po: string
	shoes_style_code_factory: string
	mat_ecolor: string
	size_data: string
	po_qty: number
	weighed_qty: number
	unweighed_qty: number
}

/**
 * @deprecated
 */
export interface ICustomerBrand {
	brand_name: string
	custbrand_id: string
}

/**
 * @deprecated
 */
export interface IProductionImportOrder extends IBaseEntity {
	active_date: Date | string
	cofactory_code: string
	status_approve: boolean
	type_inventorylist: string
	sno_no: string
	dept_code: string
	dept_name: string
	warehouse_code: string
	warehouse_name: string
	sno_location: string
	remark: string | null
}

/**
 * @deprecated
 */
export interface ITransferOrderDetail extends ITransferOrder {
	seqno: number
	trans_num: number
	sno_qty: number
	or_qtyperpacking: number
	kg_nostart: number
	kg_noend: number
}

/**
 * @deprecated
 */
export interface ITransferOrderData extends ITransferOrder {
	cofactory_code: string
}

/**
 * @deprecated
 */
export interface IInOutBoundOrder extends IBaseEntity {
	status_approve: ProductionApprovalStatus
	sno_no: string // Order code
	sno_date: Date | string // Import/Export date
	sno_car_number: string // Container truck number
	sno_ship_order: string // shipping order code
	sno_container: string // Container code
	sno_sealnumber: string
	sno_qty: string // Import/Export quantity
	sno_total_boxes: number // Packaging total
	dept_name: string
	employee_name: string
	company_code?: string
}
