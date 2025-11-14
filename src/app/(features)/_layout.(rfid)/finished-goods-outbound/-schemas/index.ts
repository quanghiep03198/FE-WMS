import { z } from 'zod'

export const standardOutboundValidator = z.object({
	po: z
		.string({ message: 'ns_validation:required' })
		.nonempty({ message: 'ns_validation:required' })
		.refine((value) => !value.startsWith('-'), { message: 'ns_validation:invalid_value' })
		.refine((value) => !value.endsWith('-'), { message: 'ns_validation:invalid_value' })
		.refine((value) => /^[0-9-]+$/.test(value), { message: 'ns_validation:invalid_value' }),
	mo_no: z.array(z.string(), { message: 'ns_validation:required' }).nonempty({ message: 'ns_validation:required' })
})

export const detailedOutboundValidator = z
	.object({
		po: z
			.string({ message: 'ns_validation:required' })
			.nonempty({ message: 'ns_validation:required' })
			.refine((value) => !value.startsWith('-'), { message: 'ns_validation:invalid_value' })
			.refine((value) => !value.endsWith('-'), { message: 'ns_validation:invalid_value' })
			.refine((value) => /^[0-9-]+$/.test(value), { message: 'ns_validation:invalid_value' }),
		mo_no: z.string({ message: 'ns_validation:required' }).nonempty({ message: 'ns_validation:required' }),
		sizes: z.array(
			z.object({
				size_numcode: z
					.string({ message: 'ns_validation:required' })
					.nonempty({ message: 'ns_validation:required' }),
				size_qty: z.number().nullable().optional(),
				qty: z
					.number({ message: 'ns_validation:required' })
					.min(1, { message: 'ns_validation:invalid_value' })
					.positive({ message: 'ns_validation:invalid_value' })
			})
		)
	})
	.superRefine((values, context) => {
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

export type StandardOutboundFormValues = z.infer<typeof standardOutboundValidator>
export type DetailedOutBoundFormValues = z.infer<typeof detailedOutboundValidator>
export type OutboundFormValues = StandardOutboundFormValues | DetailedOutBoundFormValues
