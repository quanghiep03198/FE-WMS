import { z } from 'zod'

export const updateEpcFormSchema = z
	.object({
		color_sn: z.string({ required_error: 'ns_validation:required' }).nonempty({ message: 'ns_validation:required' }),
		color_sn_actual: z
			.string({ required_error: 'ns_validation:required' })
			.nonempty({ message: 'ns_validation:required' }),
		cust_shoes_style: z
			.string({ required_error: 'ns_validation:required' })
			.nonempty({ message: 'ns_validation:required' }),
		mat_code: z.string({ required_error: 'ns_validation:required' }).nonempty({ message: 'ns_validation:required' }),
		mo_no: z.string({ required_error: 'ns_validation:required' }).nonempty({ message: 'ns_validation:required' }),
		mo_no_actual: z
			.string({ required_error: 'ns_validation:required' })
			.nonempty({ message: 'ns_validation:required' }),
		mo_noseq: z.string({ required_error: 'ns_validation:required' }).nonempty({ message: 'ns_validation:required' }),
		or_cust_po: z
			.string({ required_error: 'ns_validation:required' })
			.nonempty({ message: 'ns_validation:required' }),
		or_no: z.string({ required_error: 'ns_validation:required' }).nonempty({ message: 'ns_validation:required' }),
		quantity: z
			.number({ required_error: 'ns_validation:required' })
			.nonnegative({ message: 'ns_validation:nonnegative' }),
		factory_shoes_style: z
			.string({ required_error: 'ns_validation:required' })
			.nonempty({ message: 'ns_validation:required' }),
		factory_shoes_style_actual: z
			.string({ required_error: 'ns_validation:required' })
			.nonempty({ message: 'ns_validation:required' }),
		size_code: z.string({ required_error: 'ns_validation:required' }).nonempty({ message: 'ns_validation:required' }),
		size_numcode: z
			.string({ required_error: 'ns_validation:required' })
			.nonempty({ message: 'ns_validation:required' }),
		size_numcode_actual: z
			.string({ required_error: 'ns_validation:required' })
			.nonempty({ message: 'ns_validation:required' }),
		size_qty: z
			.number({ required_error: 'ns_validation:required' })
			.nonnegative({ message: 'ns_validation:nonnegative' })
			.default(0)
	})
	.refine((values) => values.quantity <= values.size_qty, {
		message: 'ns_validation:invalid_value',
		path: ['quantity']
	})

export type UpdateEpcFormValues = z.infer<typeof updateEpcFormSchema>
