import { z } from 'zod'

export const exchangeEpcSchema = z
	.object({
		mo_no: z.string().min(1, { message: 'Please select an order code' }),
		mo_no_actual: z.string().min(1, { message: 'Please select an order code' }),
		size_numcode: z.string().min(1, { message: 'Please select an order code' }),
		mat_code: z.string().min(1, { message: 'Please select an order code' }),
		count: z.number().positive(),
		quantity: z.number().positive(),
		exchange_all: z.boolean().default(false),
		multi: z.boolean().default(false)
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

export const exchangeOrderSchema = z.object({
	mo_no: z.string().min(1, { message: 'Please select an order code' }),
	mo_no_actual: z.string().min(1, { message: 'Please select an order code' }),
	multi: z.boolean().default(true)
})

export type ExchangeEpcFormValue = z.infer<typeof exchangeEpcSchema>
export type ExchangeEpcPayload = Omit<ExchangeEpcFormValue, 'count' | 'exchange_all'>

export type ExchangeOrderFormValue = z.infer<typeof exchangeOrderSchema>
