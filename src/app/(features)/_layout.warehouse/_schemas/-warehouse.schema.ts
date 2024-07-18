import { z } from 'zod'
import { WarehouseStorageTypes, WarehouseTypes } from '../_constants/-warehouse.enum'

export const warehouseFormSchema = z.object({
	warehouse_name: z.string({ required_error: 'This field is required' }),
	employee_code: z.string({ required_error: 'This field is required' }),
	type_warehouse: z.nativeEnum(WarehouseTypes, {
		required_error: 'This field is required',
		message: 'Invalid warehouse type'
	}),
	company_code: z.string({ required_error: 'This field is required' }),
	dept_code: z.string({ required_error: 'This field is required' }),
	area: z.string({ required_error: 'This field is required' }).min(0, 'Area must be greater than 0'),
	is_disable: z.boolean().default(false),
	is_default: z.boolean().default(false),
	remark: z.string().optional()
})

export const storageFormSchema = z.object({
	storage_name: z.string({ required_error: 'This field is required' }),
	type_storage: z.nativeEnum(WarehouseStorageTypes, {
		required_error: 'This field is required',
		message: 'Invalid storage type'
	}),
	company_code: z.string(),
	warehouse_num: z.string(),
	warehouse_name: z.string(),
	remark: z.string().optional(),
	is_disable: z.boolean().optional(),
	is_default: z.boolean().optional()
})

export type WarehouseFormValue = z.infer<typeof warehouseFormSchema>
export type PartialWarehouseFormValue = z.infer<ReturnType<typeof warehouseFormSchema.partial>>
export type StorageFormValue = z.infer<typeof storageFormSchema>
export type PartialStorageFormValue = z.infer<ReturnType<typeof storageFormSchema.partial>>
