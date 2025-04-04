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
		size_numcode: z
			.string({ required_error: 'ns_validation:required' })
			.nonempty({ message: 'ns_validation:required' }),
		size_qty: z.number().nullable().optional(),
		qty: z
			.number({ required_error: 'ns_validation:required' })
			.min(1, { message: 'ns_validation:invalid_value' })
			.positive({ message: 'ns_validation:invalid_value' })
	})
	.refine(
		(values) => {
			return values.qty <= values.size_qty
		},
		{
			message: 'ns_validation:invalid_value',
			path: ['qty']
		}
	)

export type StandardOutboundFormValues = z.infer<typeof standardOutboundValidator>
export type DetailedOutBoundFormValues = z.infer<typeof detailedOutboundValidator>
export type OutboundFormValues = StandardOutboundFormValues | DetailedOutBoundFormValues
