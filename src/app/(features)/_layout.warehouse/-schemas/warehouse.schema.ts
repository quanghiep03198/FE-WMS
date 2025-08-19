import { z } from 'zod'
import { WarehouseStorageTypes, WarehouseTypes } from '../-constants/warehouse.enum'

export const warehouseFormSchema = z.object({
	warehouse_name: z
		.string({ message: 'ns_validation:required' })
		.trim()
		.nonempty({ message: 'ns_validation:required' }),
	employee_code: z
		.string({ message: 'ns_validation:required' })
		.trim()
		.nonempty({ message: 'ns_validation:required' }),
	type_warehouse: z
		.string({ message: 'ns_validation:required' })
		.nonempty({ message: 'ns_validation:required' })
		.and(
			z.nativeEnum(WarehouseTypes, {
				message: 'ns_validation:invalid_value'
			})
		),
	company_code: z.string({ message: 'ns_validation:required' }).trim().nonempty({ message: 'ns_validation:required' }),
	dept_code: z.string({ message: 'ns_validation:required' }).trim().nonempty({ message: 'ns_validation:required' }),
	user_code_created: z.string().nullable().optional(),
	user_name_created: z.string().nullable().optional(),
	user_code_updated: z.string().nullable().optional(),
	user_name_updated: z.string().nullable().optional(),
	area: z.number({ message: 'ns_validation:required' }).nonnegative({ message: 'ns_validation:nonnegative' }),
	is_disable: z.boolean().default(false),
	is_default: z.boolean().default(false),
	remark: z.string().nullable().optional()
})

export const storageFormSchema = z.object({
	storage_name: z.string().trim().nonempty({ message: 'ns_validation:required' }),
	type_storage: z
		.string()
		.trim()
		.nonempty({ message: 'ns_validation:required' })
		.and(
			z.nativeEnum(WarehouseStorageTypes, {
				message: 'Invalid storage type'
			})
		),
	company_code: z.string().trim().nonempty({ message: 'ns_validation:required' }),
	warehouse_num: z.string().trim().nonempty({ message: 'ns_validation:required' }),
	warehouse_name: z.string().trim().nonempty({ message: 'ns_validation:required' }),
	user_code_created: z.string().optional().nullable(),
	user_name_created: z.string().optional().nullable(),
	user_code_updated: z.string().optional().nullable(),
	user_name_updated: z.string().optional().nullable(),
	is_disable: z.boolean().optional(),
	is_default: z.boolean().optional(),
	remark: z.string().nullable().optional()
})

export type WarehouseFormValue = z.infer<typeof warehouseFormSchema>
export type PartialWarehouseFormValue = Partial<WarehouseFormValue>
export type StorageFormValue = z.infer<typeof storageFormSchema>
export type PartialStorageFormValue = Partial<StorageFormValue>
