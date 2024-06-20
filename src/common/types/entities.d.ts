import { WarehouseTypes } from '../constants/constants'

export interface IBaseEntity {
	id: string
	[key: string]: any
}

export interface IUser extends IBaseEntity {
	user_code: string
	display_name: string
	password: string
	employee_code: string
	company_code: string
	picture: string
	has_accessibility: boolean | null
	isadmin: boolean | null
}

export interface ICompany extends IBaseEntity {
	company_code: string
	company_name: string
	display_name: string
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
	type_warehouse: keyof typeof WarehouseTypes & string
	area: string
	dept_code: string
	dept_name: string
	remark: string | null
	is_disable: boolean | number
	is_default: boolean | number
	employee_code: string | null
	employee_name: string | null
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
