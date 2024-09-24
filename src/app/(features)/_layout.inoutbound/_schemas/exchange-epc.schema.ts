import { z } from 'zod'

export const exchangeEpcSchema = z
	.object({
		mo_no: z.string().min(1, { message: 'Please select an order code' }),
		mo_no_actual: z.string().min(1, { message: 'Please select an order code' }),
		size_numcode: z.string().min(1, { message: 'Please select an order code' }),
		mat_code: z.string().min(1, { message: 'Please select an order code' }),
		count: z.number().positive().default(0),
		quantity: z.number().positive()
	})
	.refine(
		(values) => {
			return values.quantity <= values.count
		},
		{
			message: 'Please select valid quantity',
			path: ['quantity']
		}
	)

export type ExchangeEpcFormValue = z.infer<typeof exchangeEpcSchema>
