import { warehouseTypes } from '../constants/constants'
import { ProductionApproveStatus } from '../constants/enums'

export interface IBaseEntity {
	id: string
	keyid?: string
	updated?: Date | string
	created?: Date | string
	remark?: string | null
	[key: string]: any
}

export interface IUser extends IBaseEntity {
	user_code: string
	display_name: string
	password: string
	employee_code: string
	company_code: string
	company_name: string
	picture: string
	has_accessibility: boolean | null
	isadmin: boolean | null
}

export interface ICompany extends IBaseEntity {
	company_code: string
	company_name: string
	factory_code: string
}

export interface IDepartment extends IBaseEntity {
	ERP_dept_code: string
	MES_dept_name: string
	company_code: string
	dept_code_upper: string
}

export interface IWarehouse extends IBaseEntity {
	company_code: string
	warehouse_num: string
	warehouse_name: string
	type_warehouse: keyof typeof warehouseTypes & string
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
	type_storage: WarehouseStorageTypeEnum | string
}

export interface IEmployee extends IBaseEntity {
	id: number
	employee_name: string
	employee_code: string
}

export interface IProduction extends IBaseEntity {
	company_code
	date
	no
	ship_order
	container
	seal_number
	car_number
	total_boxes
	dept_name
	employee_name
	updated
	remark
	status_approve
	month_close: string
}

export interface IElectronicProductCode {
	record_time: Date
	epc_code: string
	mo_no: string
	rfid_status: 'A' | 'B' | null
	rfid_use: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | null
	storage: any
}

export interface IInOutBoundOrder extends IBaseEntity {
	status_approve: ProductionApproveStatus
	sno_no: string // Order code
	sno_date: Date | string // Import/Export date
	sno_car_number: string // Container truck number
	sno_ship_order: string // shipping order code
	sno_container: string // Container code
	sno_seal_number: string
	sno_qty: string // Import/Export quantity
	sno_total_boxes: number // Packaging total
	dept_name: string
	employee_name: string
	company_code: string
}
