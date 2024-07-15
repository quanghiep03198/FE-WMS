import { format } from 'date-fns'

const customerBrands = ['UGG', 'Decker']

const cofactoryRefs = ['A', 'B', 'C', 'K']

export const transferOrders = Array.from(new Array(1000)).map((_, index) => ({
	id: String(index + 1),
	custbrand_id: crypto.randomUUID().split('-').slice(0, 1).join(''),
	brand_name: customerBrands[Math.floor(Math.random() * customerBrands.length)],
	transfer_order:
		'TN' +
		cofactoryRefs[Math.floor(Math.random() * cofactoryRefs.length)] +
		format(new Date(), 'yy') +
		format(new Date(), 'MM') +
		String(index + 1),
	mo_no: crypto.randomUUID().split('-').slice(0, 1).join(''),
	or_no: crypto.randomUUID().split('-').slice(0, 1).join(''),
	kg_no: crypto.randomUUID().split('-').slice(0, 1).join(''),
	or_custpo: crypto.randomUUID().split('-').slice(0, 1).join(''),
	shoestyle_codefactory: crypto.randomUUID().split('-').slice(0, 1).join(''),
	or_warehouse_num: null,
	or_warehouse_name: null,
	or_storage_num: null,
	or_storage_name: null,
	new_warehouse_num: null,
	new_warehouse_name: null,
	new_storage_num: null,
	new_storage_name: null,
	status_approve: null,
	employee_name_approve: null,
	approve_date: new Date(),
	remark: null
}))
