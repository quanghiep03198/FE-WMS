export interface IBaseEntity {
	id: string
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
	department_code: string
	department_name: string
}

export interface IWarehouse extends IBaseEntity {
	company_code: string
	warehouse_num: string
	warehouse_name: string
	type_warehouse: 'A' | 'B' | 'C' | 'D' | 'E'
	area: string | number
	dept_code: string
	dept_name: string
	remark: string | null
	is_disable: boolean
	is_default: boolean
	employee_code: string | null
	employee_name: string | null
}
