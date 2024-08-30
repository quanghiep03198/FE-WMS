import { isBefore, isEqual } from 'date-fns'
import { z } from 'zod'

export const importOrderSchema = z.object({
	sno_no: z.string().trim().min(1, { message: 'ns_validation:required' }),
	sno_date: z
		.date({ required_error: 'ns_validation:required' })
		.refine((value) => isBefore(value, new Date()) || isEqual(value, new Date()), {
			message: 'ns_validation:invalid_value'
		}),
	type_inventorylist: z.string().trim().min(1, { message: 'ns_validation:required' }),
	dept_code: z.string().trim().min(1, { message: 'ns_validation:required' }),
	warehouse_num: z.string().trim().min(1, { message: 'ns_validation:required' }),
	storage_num: z.string().trim().min(1, { message: 'ns_validation:required' })
})

export type ImportOrderValue = z.infer<typeof importOrderSchema>
