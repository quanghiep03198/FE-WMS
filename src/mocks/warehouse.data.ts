import { WarehouseStorageTypes } from '@/app/(features)/_layout.warehouse/_constants/-warehouse.enum'
import { IWarehouse, IWarehouseStorage } from '@/common/types/entities'

const warehouseTypes = ['A', 'B', 'C', 'D', 'E']
const storageTypes = Object.values(WarehouseStorageTypes)

export const warehouses: IWarehouse[] = Array.from(new Array(20)).map((_, index) => ({
	id: String(index + 1),
	warehouse_name: 'Warehouse ' + String(index + 1),
	type_warehouse: warehouseTypes[Math.floor(Math.random() * warehouseTypes.length)] as any,
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

export const storageLocation: IWarehouseStorage[] = Array.from(new Array(20)).map((_, index) => ({
	id: String(index + 1),
	storage_name: `Area 0${index + 1}`,
	storage_num: `A1.${index}`,
	type_storage: storageTypes[Math.floor(Math.random() * storageTypes.length)],
	warehouse_num: 'VA1PW' + String(index + 1),
	warehouse_name: 'Warehouse ' + String(index + 1),
	is_disabled: false,
	is_default: false,
	remark: null
}))

console.log(JSON.stringify(storageLocation))
