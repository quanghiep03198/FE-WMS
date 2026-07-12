import { number, object, string, type infer as Infer } from 'zod'

// const currentYear = new Date().getFullYear() - 1911
// const validYears = [currentYear - 1, currentYear, currentYear + 1].map((year) => year.toString().padStart(3, '0'))

export enum FactoryCodeOrderRef {
	VA1 = 'A',
	VB1 = 'B',
	VB2 = 'C',
	CA1 = 'D'
}

export const exchangeEpcSchema = object({
	or_no: string().nonempty({ message: 'ns_validation:required' }),
	or_cust_po: string().nonempty({ message: 'ns_validation:required' }),
	mo_no: string().nonempty({ message: 'ns_validation:required' }),
	mo_noseq: string().nonempty({ message: 'ns_validation:required' }),
	mat_code: string().nonempty({ message: 'ns_validation:required' }),
	cust_shoes_style: string().nonempty({ message: 'ns_validation:required' }),
	factory_shoes_style: string().nonempty({ message: 'ns_validation:required' }),
	color_sn: string().nonempty({ message: 'ns_validation:required' }),
	size_code: string().nonempty({ message: 'ns_validation:required' }),
	size_numcode: string().nonempty({ message: 'ns_validation:required' }),
	size_qty: number()
		.default(0)
		.transform((value) => Number(value)),
	mo_no_actual: string().nonempty({ message: 'ns_validation:required' }),
	factory_shoes_style_actual: string().nonempty({ message: 'ns_validation:required' }),
	color_sn_actual: string().nonempty({ message: 'ns_validation:required' }),
	size_numcode_actual: string().nonempty({ message: 'ns_validation:required' }),
	scanned_size_qty: number()
		.positive()
		.default(0)
		.transform((value) => Number(value)),
	quantity: number()
		.positive()
		.transform((value) => Number(value))
})
	.refine((values) => values.quantity <= values.scanned_size_qty, {
		message: 'ns_validation:invalid_value',
		path: ['quantity']
	})
	.refine((values) => values.factory_shoes_style === values.factory_shoes_style_actual, {
		message: 'ns_validation:invalid_value',
		path: ['factory_shoes_style_actual']
	})
	.refine((values) => values.color_sn === values.color_sn_actual, {
		message: 'ns_validation:invalid_value',
		path: ['color_sn_actual']
	})
	.refine((values) => values.size_numcode === values.size_numcode_actual, {
		message: 'ns_validation:invalid_value',
		path: ['size_numcode_actual']
	})

export const exchangeOrderSchema = object({
	mo_no: string().nonempty({ message: 'ns_validation:required' }),
	mo_no_actual: string().trim().nonempty({ message: 'ns_validation:required' }),
	factory_shoes_style: string().nonempty({ message: 'ns_validation:required' }),
	color_sn: string().nonempty({ message: 'ns_validation:required' })
})

export type ExchangeEpcFormValue = Infer<typeof exchangeEpcSchema>
export type ExchangeOrderFormValue = Infer<typeof exchangeOrderSchema>
export type ExchangeEpcPayload = Omit<ExchangeEpcFormValue, 'count' | 'exchange_all'>
