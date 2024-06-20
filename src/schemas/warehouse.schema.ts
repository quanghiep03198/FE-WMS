import { z } from 'zod'

export const warehouseFormSchema = z.object({
	warehouse_name: z.string({ required_error: 'This field is required' }),
	type_warehouse: z.string({ required_error: 'This field is required' }),
	company_code: z.string({ required_error: 'This field is required' }),
	dept_code: z.string({ required_error: 'This field is required' }),
	area: z.string({ required_error: 'This field is required' }),
	employee_code: z.string({ required_error: 'This field is required' }),
	is_disabled: z.boolean().or(z.number()).optional(),
	is_default: z.boolean().or(z.number()).optional()
})

export type WarehouseFormValue = z.infer<typeof warehouseFormSchema>
export type PartialWarehouseFormValue = z.infer<ReturnType<typeof warehouseFormSchema.partial>>
