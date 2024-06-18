import { IWarehouse } from '@/common/types/entities'

export const warehouses = Array.apply(null, Array(1000)).map((_, index) => ({
	id: String(index + 1),
	warehouse_name: 'Warehouse ' + index,
	type_warehouse: 'A',
	warehouse_num: 'VA1PW01',
	dept_code: 'VA1PW01',
	area: 5000,
	is_disable: false,
	is_default: false,
	employee_code: null,
	employee_name: null
})) as unknown as IWarehouse[]
