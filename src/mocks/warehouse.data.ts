import { IWarehouse } from '@/common/types/entities'

export const warehouses: IWarehouse[] = Array.from(new Array(1000)).map((_, index) => ({
	id: String(index + 1),
	warehouse_name: 'Warehouse ' + String(index + 1),
	type_warehouse: 'A',
	warehouse_num: 'VA1PW' + String(index + 1),
	dept_code: 'VA1PW01',
	area: Math.round(Math.random() * 5000),
	is_disable: false,
	is_default: false,
	employee_code: null,
	employee_name: null,
	company_code: 'VA1',
	dept_name: null,
	remark: null
}))
