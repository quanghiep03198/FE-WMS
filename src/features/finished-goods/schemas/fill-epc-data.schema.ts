import { number, object, string, type infer as Infer } from 'zod'

export const updateEpcFormSchema = object({
	color_sn: string({ message: 'ns_validation:required' }).nonempty({ message: 'ns_validation:required' }),
	color_sn_actual: string({ message: 'ns_validation:required' }).nonempty({ message: 'ns_validation:required' }),
	cust_shoes_style: string({ message: 'ns_validation:required' }).nonempty({ message: 'ns_validation:required' }),
	mat_code: string({ message: 'ns_validation:required' }).nonempty({ message: 'ns_validation:required' }),
	mo_no: string({ message: 'ns_validation:required' }).nonempty({ message: 'ns_validation:required' }),
	mo_no_actual: string({ message: 'ns_validation:required' }).nonempty({ message: 'ns_validation:required' }),
	mo_noseq: string({ message: 'ns_validation:required' }).nonempty({ message: 'ns_validation:required' }),
	or_cust_po: string({ message: 'ns_validation:required' }).nonempty({ message: 'ns_validation:required' }),
	or_no: string({ message: 'ns_validation:required' }).nonempty({ message: 'ns_validation:required' }),
	quantity: number({ message: 'ns_validation:required' }).nonnegative({ message: 'ns_validation:nonnegative' }),
	factory_shoes_style: string({ message: 'ns_validation:required' }).nonempty({ message: 'ns_validation:required' }),
	factory_shoes_style_actual: string({ message: 'ns_validation:required' }).nonempty({
		message: 'ns_validation:required'
	}),
	size_code: string({ message: 'ns_validation:required' }).nonempty({ message: 'ns_validation:required' }),
	size_numcode: string({ message: 'ns_validation:required' }).nonempty({ message: 'ns_validation:required' }),
	size_numcode_actual: string({ message: 'ns_validation:required' }).nonempty({ message: 'ns_validation:required' }),
	size_qty: number({ message: 'ns_validation:required' })
		.nonnegative({ message: 'ns_validation:nonnegative' })
		.default(0)
})

export type UpsertEpcFormValues = Infer<typeof updateEpcFormSchema>
