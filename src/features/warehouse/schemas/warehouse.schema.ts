import { int, number, object, string, type infer as Infer } from 'zod'

export const createWarehouseFormSchema = object({
	name: string({ message: 'ns_validation:required' }).trim().nonempty({ message: 'ns_validation:required' }),
	capacity: int({ message: 'ns_validation:nonnegative' }).gt(0)
})

export const updateWarehouseFormSchema = object({
	_id: string().trim().nonempty(),
	name: string({ message: 'ns_validation:required' }).trim().nonempty({ message: 'ns_validation:required' }),
	capacity: number({ message: 'ns_validation:required' }).int({ message: 'ns_validation:nonnegative' }).gt(0)
})

export type CreateWarehouseFormValue = Infer<typeof createWarehouseFormSchema>
export type UpdateWarehouseFormValue = Infer<typeof updateWarehouseFormSchema>

export type CreateWarehouseFormSchema = typeof createWarehouseFormSchema
export type UpdateWarehouseFormSchema = typeof updateWarehouseFormSchema
