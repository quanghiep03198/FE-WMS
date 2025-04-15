import { z } from 'zod'

export const standardOutboundValidator = z.object({
	po: z.string({ required_error: 'ns_validation:required' }).nonempty({ message: 'ns_validation:required' }),
	mo_no: z
		.array(z.string(), { required_error: 'ns_validation:required' })
		.nonempty({ message: 'ns_validation:required' })
})

export const detailedOutboundValidator = z
	.object({
		po: z.string({ required_error: 'ns_validation:required' }).nonempty({ message: 'ns_validation:required' }),
		mo_no: z.string({ required_error: 'ns_validation:required' }).nonempty({ message: 'ns_validation:required' }),
		sizes: z.array(
			z.object({
				size_numcode: z
					.string({ required_error: 'ns_validation:required' })
					.nonempty({ message: 'ns_validation:required' }),
				size_qty: z.number().nullable().optional(),
				qty: z
					.number({ required_error: 'ns_validation:required' })
					.min(1, { message: 'ns_validation:invalid_value' })
					.positive({ message: 'ns_validation:invalid_value' })
			})
		)
	})
	.superRefine((values, context) => {
		if (!values.sizes.every((item) => item.qty <= item.size_qty)) {
			values.sizes.forEach((item, index) => {
				if (item.qty > item.size_qty)
					context.addIssue({
						code: z.ZodIssueCode.too_big,
						message: 'ns_validation:invalid_value',
						maximum: item.size_qty,
						type: 'number',
						inclusive: true,
						path: [`sizes.${index}.qty`]
					})
			})
		}
	})

export type StandardOutboundFormValues = z.infer<typeof standardOutboundValidator>
export type DetailedOutBoundFormValues = z.infer<typeof detailedOutboundValidator>
export type OutboundFormValues = StandardOutboundFormValues | DetailedOutBoundFormValues
