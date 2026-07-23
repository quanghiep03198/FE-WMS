import { boolean, enum as enums, number, object, string, type infer as Infer } from 'zod'
import { WarehouseTypes } from '../constants/warehouse.enum'

export const warehouseFormSchema = object({
	warehouse_name: string({ message: 'ns_validation:required' }).trim().nonempty({ message: 'ns_validation:required' }),
	employee_code: string({ message: 'ns_validation:required' }).trim().nonempty({ message: 'ns_validation:required' }),
	type_warehouse: string({ message: 'ns_validation:required' })
		.nonempty({ message: 'ns_validation:required' })
		.and(
			enums(WarehouseTypes, {
				message: 'ns_validation:invalid_value'
			})
		),
	company_code: string({ message: 'ns_validation:required' }).trim().nonempty({ message: 'ns_validation:required' }),
	dept_code: string({ message: 'ns_validation:required' }).trim().nonempty({ message: 'ns_validation:required' }),
	user_code_created: string().nullable().optional(),
	user_name_created: string().nullable().optional(),
	user_code_updated: string().nullable().optional(),
	user_name_updated: string().nullable().optional(),
	area: number({ message: 'ns_validation:required' }).nonnegative({ message: 'ns_validation:nonnegative' }),
	is_disable: boolean().default(false),
	is_default: boolean().default(false),
	remark: string().nullable().optional()
})
export type WarehouseFormValue = Infer<typeof warehouseFormSchema>
export type PartialWarehouseFormValue = Partial<WarehouseFormValue>
