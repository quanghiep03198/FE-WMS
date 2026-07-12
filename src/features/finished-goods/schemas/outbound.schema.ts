import { array, number, object, string, type infer as Infer } from 'zod'

export const standardOutboundValidator = object({
	po: string({ message: 'ns_validation:required' })
		.nonempty({ message: 'ns_validation:required' })
		.refine((value) => !value.startsWith('-'), { message: 'ns_validation:invalid_value' })
		.refine((value) => !value.endsWith('-'), { message: 'ns_validation:invalid_value' })
		.refine((value) => /^[0-9-]+$/.test(value), { message: 'ns_validation:invalid_value' }),
	mo_no: array(string(), { message: 'ns_validation:required' }).nonempty({ message: 'ns_validation:required' })
})

export const detailedOutboundValidator = object({
	po: string({ message: 'ns_validation:required' })
		.nonempty({ message: 'ns_validation:required' })
		.refine((value) => !value.startsWith('-'), { message: 'ns_validation:invalid_value' })
		.refine((value) => !value.endsWith('-'), { message: 'ns_validation:invalid_value' })
		.refine((value) => /^[0-9-]+$/.test(value), { message: 'ns_validation:invalid_value' }),
	mo_no: string({ message: 'ns_validation:required' }).nonempty({ message: 'ns_validation:required' }),
	sizes: array(
		object({
			size_numcode: string({ message: 'ns_validation:required' }).nonempty({ message: 'ns_validation:required' }),
			size_qty: number().nullable().optional(),
			qty: number({ message: 'ns_validation:required' })
				.min(1, { message: 'ns_validation:invalid_value' })
				.positive({ message: 'ns_validation:invalid_value' })
		})
	)
}).superRefine((values, context) => {
	values.sizes.forEach((item, index) => {
		if (item.qty > item.size_qty)
			context.addIssue({
				code: 'too_big',
				message: 'ns_validation:invalid_value',
				origin: 'int',
				maximum: item.size_qty,
				type: 'number',
				inclusive: true,
				path: [`sizes.${index}.qty`]
			})
		if (values.sizes.findIndex((otherItem) => otherItem.size_numcode === item.size_numcode) !== index)
			context.addIssue({
				code: 'custom',
				message: 'Do not select the same size',
				fatal: true,
				path: [`sizes.${index}.size_numcode`]
			})
	})
})

export type StandardOutboundFormValues = Infer<typeof standardOutboundValidator>
export type DetailedOutBoundFormValues = Infer<typeof detailedOutboundValidator>
export type OutboundFormValues = StandardOutboundFormValues | DetailedOutBoundFormValues
