import { z } from 'zod'

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
		or_no: z.string().nonempty({ message: 'ns_validation:required' }),
		or_cust_po: z.string().nonempty({ message: 'ns_validation:required' }),
		mo_no: z.string().nonempty({ message: 'ns_validation:required' }),
		mo_noseq: z.string().nonempty({ message: 'ns_validation:required' }),
		mat_code: z.string().nonempty({ message: 'ns_validation:required' }),
		cust_shoes_style: z.string().nonempty({ message: 'ns_validation:required' }),
		shoes_style_code_factory: z.string().nonempty({ message: 'ns_validation:required' }),
		color_sn: z.string().nonempty({ message: 'ns_validation:required' }),
		size_code: z.string().nonempty({ message: 'ns_validation:required' }),
		size_numcode: z.string().nonempty({ message: 'ns_validation:required' }),
		size_qty: z
			.number()
			.default(0)
			.transform((value) => Number(value)),
		mo_no_actual: z.string().nonempty({ message: 'ns_validation:required' }),
		shoes_style_code_factory_actual: z.string().nonempty({ message: 'ns_validation:required' }),
		color_sn_actual: z.string().nonempty({ message: 'ns_validation:required' }),
		size_numcode_actual: z.string().nonempty({ message: 'ns_validation:required' }),
		scanned_size_qty: z
			.number()
			.positive()
			.default(0)
			.transform((value) => Number(value)),
		quantity: z
			.number()
			.positive()
			.transform((value) => Number(value))
	})
	.refine((values) => values.quantity <= values.scanned_size_qty, {
		message: 'ns_validation:invalid_value',
		path: ['quantity']
	})
	.refine((values) => values.shoes_style_code_factory === values.shoes_style_code_factory_actual, {
		message: 'ns_validation:invalid_value',
		path: ['shoes_style_code_factory_actual']
	})
	.refine((values) => values.color_sn === values.color_sn_actual, {
		message: 'ns_validation:invalid_value',
		path: ['color_sn_actual']
	})
	.refine((values) => values.size_numcode === values.size_numcode_actual, {
		message: 'ns_validation:invalid_value',
		path: ['size_numcode_actual']
	})

export const exchangeOrderSchema = z.object({
	mo_no: z.string().nonempty({ message: 'ns_validation:required' }),
	mo_no_actual: z.string().trim().nonempty({ message: 'ns_validation:required' }),
	shoes_style_code_factory: z.string().nonempty({ message: 'ns_validation:required' }),
	color_sn: z.string().nonempty({ message: 'ns_validation:required' })
})

export type ExchangeEpcFormValue = z.infer<typeof exchangeEpcSchema>
export type ExchangeOrderFormValue = z.infer<typeof exchangeOrderSchema>
export type ExchangeEpcPayload = Omit<ExchangeEpcFormValue, 'count' | 'exchange_all'>
