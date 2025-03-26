import { z } from 'zod'

export const outboundValidator = z.object({
	mo_no: z
		.array(z.string(), { required_error: 'ns_validation:required' })
		.nonempty({ message: 'ns_validation:required' }),
	po: z.string({ required_error: 'ns_validation:required' }).nonempty({ message: 'ns_validation:required' })
})

export type OutboundFormValues = z.infer<typeof outboundValidator>
