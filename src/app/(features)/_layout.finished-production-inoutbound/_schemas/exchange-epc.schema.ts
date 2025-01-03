import { z } from 'zod'
import { FALLBACK_ORDER_VALUE } from '../_apis/rfid.api'

const currentYear = new Date().getFullYear() - 1911
const validYears = [currentYear - 1, currentYear, currentYear + 1].map((year) => year.toString().padStart(3, '0'))

export enum FactoryCodeOrderRef {
	VA1 = 'A',
	VB1 = 'B',
	VB2 = 'C',
	CA1 = 'D'
}

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

export const exchangeOrderSchema = z
	.object({
		mo_no: z.string().min(1, { message: 'Please select an order code' }),
		mo_no_actual: z.string().trim().min(1, { message: 'Please select an order code' }),
		multi: z.boolean().default(true),
		count: z.number().positive().optional(), // Maximum quantity
		quantity: z.number().optional(), // Quantity to exchange
		exchange_all: z.boolean().default(false)
	})
	.refine(
		(values) => {
			if (values.mo_no !== FALLBACK_ORDER_VALUE) return true
			return values.quantity > 0 && values.quantity <= values.count
		},
		{
			message: 'Please select valid quantity',
			path: ['quantity']
		}
	)

export type ExchangeEpcFormValue = z.infer<typeof exchangeEpcSchema>
export type ExchangeOrderFormValue = z.infer<typeof exchangeOrderSchema>
export type ExchangeEpcPayload = Omit<ExchangeEpcFormValue, 'count' | 'exchange_all'>
