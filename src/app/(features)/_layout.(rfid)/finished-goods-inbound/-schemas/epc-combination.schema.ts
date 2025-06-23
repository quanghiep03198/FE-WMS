import { z } from 'zod'

export const epcCombinationSchema = z
	.object({
		or_no: z.string({ required_error: 'ns_validation:required' }).nonempty({ message: 'ns_validation:required' }),
		or_cust_po: z
			.string({ required_error: 'ns_validation:required' })
			.nonempty({ message: 'ns_validation:required' }),
		shoes_style_code_factory: z
			.string({ required_error: 'ns_validation:required' })
			.nonempty({ message: 'ns_validation:required' }),
		shoes_style_code_factory_actual: z
			.string({ required_error: 'ns_validation:required' })
			.nonempty({ message: 'ns_validation:required' }),
		mo_no: z.string({ required_error: 'ns_validation:required' }).nonempty({ message: 'ns_validation:required' }),
		mo_no_actual: z
			.string({ required_error: 'ns_validation:required' })
			.nonempty({ message: 'ns_validation:required' }),
		mo_noseq: z.string({ required_error: 'ns_validation:required' }).nonempty({ message: 'ns_validation:required' }),
		color_sn: z.string({ required_error: 'ns_validation:required' }).nonempty({ message: 'ns_validation:required' }),
		color_sn_actual: z
			.string({ required_error: 'ns_validation:required' })
			.nonempty({ message: 'ns_validation:required' }),
		cust_shoes_style: z
			.string({ required_error: 'ns_validation:required' })
			.nonempty({ message: 'ns_validation:required' }),
		size_numcode: z
			.string({ required_error: 'ns_validation:required' })
			.nonempty({ message: 'ns_validation:required' }),
		size_numcode_actual: z
			.string({ required_error: 'ns_validation:required' })
			.nonempty({ message: 'ns_validation:required' }),
		size_code: z.string({ required_error: 'ns_validation:required' }).nonempty({ message: 'ns_validation:required' }),
		size_qty: z
			.number({ required_error: 'ns_validation:required' })
			.nonnegative({ message: 'ns_validation:nonnegative' })
			.default(0),
		quantity: z
			.number({ required_error: 'ns_validation:required' })
			.nonnegative({ message: 'ns_validation:nonnegative' })
	})
	.refine((values) => values.quantity <= values.size_qty, {
		message: 'ns_validation:invalid_value',
		path: ['quantity']
	})

export type EpcCombinationFormValues = z.infer<typeof epcCombinationSchema>
