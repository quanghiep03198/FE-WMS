import { z } from 'zod'
import { FALLBACK_ORDER_VALUE } from '../_apis/rfid.api'

// const currentYear = new Date().getFullYear() - 1911
// const validYears = [currentYear - 1, currentYear, currentYear + 1].map((year) => year.toString().padStart(3, '0'))

export enum FactoryCodeOrderRef {
	VA1 = 'A',
	VB1 = 'B',
	VB2 = 'C',
	CA1 = 'D'
}

export const exchangeEpcSchema = z
	.object({
		mo_no: z.string().nonempty({ message: 'ns_validation:required' }),
		mo_noseq: z.string().nonempty({ message: 'ns_validation:required' }),
		mat_code: z.string().nonempty({ message: 'ns_validation:required' }),
		or_no: z.string().nonempty({ message: 'ns_validation:required' }),
		mo_no_actual: z.string().nonempty({ message: 'ns_validation:required' }),
		size_numcode: z.string().nonempty({ message: 'ns_validation:required' }),
		size_numcode_match: z.string().nonempty({ message: 'ns_validation:required' }),
		mat_ecolor: z.string().nonempty({ message: 'ns_validation:required' }),
		mat_ecolor_match: z.string().nonempty({ message: 'ns_validation:required' }),
		shoes_style_code_factory: z.string().nonempty({ message: 'ns_validation:required' }),
		shoes_style_code_factory_match: z.string().nonempty({ message: 'ns_validation:required' }),
		cust_shoes_style: z.string().nonempty({ message: 'ns_validation:required' }),
		or_cust_po: z.string().nonempty({ message: 'ns_validation:required' }),
		size_code: z.string().nonempty({ message: 'ns_validation:required' }),
		quantity: z
			.number()
			.positive()
			.transform((value) => Number(value)),
		scanned_size_qty: z
			.number()
			.positive()
			.default(0)
			.transform((value) => Number(value)),
		size_qty: z
			.number()
			.positive()
			.default(0)
			.transform((value) => Number(value))
	})
	.refine((values) => values.quantity <= values.scanned_size_qty && values.quantity <= values.size_qty, {
		message: 'ns_validation:invalid_value',
		path: ['quantity']
	})
	.refine((values) => values.shoes_style_code_factory === values.shoes_style_code_factory_match, {
		message: 'ns_validation:invalid_value',
		path: ['shoes_style_code_factory_match']
	})
	.refine((values) => values.mat_ecolor === values.mat_ecolor_match, {
		message: 'ns_validation:invalid_value',
		path: ['mat_ecolor_match']
	})
	.refine((values) => values.size_numcode === values.size_numcode_match, {
		message: 'ns_validation:invalid_value',
		path: ['size_numcode_match']
	})

export const exchangeOrderSchema = z
	.object({
		mo_no: z.string().nonempty({ message: 'ns_validation:required' }),
		mo_no_actual: z.string().trim().nonempty({ message: 'ns_validation:required' }),
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
