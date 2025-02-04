import { z } from 'zod'

export const deleteScannedEpcsSchema = z
	.object({
		mo_no: z.string(),
		mat_code: z.string(),
		size_numcode: z.string(),
		quantity: z.number().positive(),
		max_quantity: z.number().positive(),
		delete_all: z.boolean().optional().default(false)
	})
	.refine(
		(values) => {
			return values.quantity <= values.max_quantity
		},
		{
			message: 'Please select valid quantity',
			path: ['quantity']
		}
	)

export type DeleteScannedEpcsFormValues = z.infer<typeof deleteScannedEpcsSchema>
