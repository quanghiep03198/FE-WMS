import { boolean, enum as enums, number, object, string, type infer as Infer } from 'zod'
import { WarehouseStorageTypes } from '../constants/warehouse.enum'

export const storageFormSchema = object({
	storage_name: string().trim().nonempty({ message: 'ns_validation:required' }),
	storage_capacity: number({ message: 'ns_validation:required' })
		.int()
		.nonnegative()
		.transform((value) => Math.abs(value)),
	type_storage: string()
		.trim()
		.nonempty({ message: 'ns_validation:required' })
		.and(
			enums(WarehouseStorageTypes, {
				message: 'Invalid storage type'
			})
		),
	company_code: string().trim().nonempty({ message: 'ns_validation:required' }),
	warehouse_num: string().trim().nonempty({ message: 'ns_validation:required' }),
	warehouse_name: string().trim().nonempty({ message: 'ns_validation:required' }),
	user_code_created: string().optional().nullable(),
	user_name_created: string().optional().nullable(),
	user_code_updated: string().optional().nullable(),
	user_name_updated: string().optional().nullable(),
	is_disable: boolean().optional(),
	is_default: boolean().optional(),
	remark: string().nullable().optional()
})
export type StorageFormValue = Required<Infer<typeof storageFormSchema>>
export type PartialStorageFormValue = Partial<StorageFormValue>
