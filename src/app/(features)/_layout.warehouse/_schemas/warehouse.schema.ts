import { isEmpty } from 'lodash'
import { z } from 'zod'
import { WarehouseStorageTypes, WarehouseTypes } from '../_constants/warehouse.enum'

export const warehouseFormSchema = z.object({
	warehouse_name: z
		.string({ required_error: 'ns_validation:required' })
		.trim()
		.min(1, { message: 'ns_validation:required' }),
	employee_code: z
		.string({ required_error: 'ns_validation:required' })
		.trim()
		.min(1, { message: 'ns_validation:required' }),
	type_warehouse: z
		.string({ required_error: 'ns_validation:required' })
		.min(1, { message: 'ns_validation:required' })
		.and(
			z.nativeEnum(WarehouseTypes, {
				message: 'ns_validation:invalid_value'
			})
		),
	company_code: z
		.string({ required_error: 'ns_validation:required' })
		.trim()
		.min(1, { message: 'ns_validation:required' }),
	dept_code: z
		.string({ required_error: 'ns_validation:required' })
		.trim()
		.min(1, { message: 'ns_validation:required' }),
	area: z.number({ required_error: 'ns_validation:required' }).nonnegative({ message: 'ns_validation:nonnegative' }),
	is_disable: z.boolean().default(false),
	is_default: z.boolean().default(false),
	remark: z.string().optional()
})

export const storageFormSchema = z.object({
	storage_name: z
		.string()
		.trim()
		.refine((value) => !isEmpty(value), { message: 'ns_validation:required' }),
	type_storage: z
		.string()
		.trim()
		.min(1, { message: 'ns_validation:required' })
		.and(
			z.nativeEnum(WarehouseStorageTypes, {
				required_error: 'ns_validation:required',
				message: 'Invalid storage type'
			})
		),
	company_code: z.string().trim().min(1, { message: 'ns_validation:required' }),
	warehouse_num: z.string().trim().min(1, { message: 'ns_validation:required' }),
	warehouse_name: z.string().trim().min(1, { message: 'ns_validation:required' }),
	remark: z.string().optional().nullable(),
	is_disable: z.boolean().optional(),
	is_default: z.boolean().optional()
})

export type WarehouseFormValue = z.infer<typeof warehouseFormSchema>
export type PartialWarehouseFormValue = Partial<WarehouseFormValue>
export type StorageFormValue = z.infer<typeof storageFormSchema>
export type PartialStorageFormValue = Partial<StorageFormValue>
