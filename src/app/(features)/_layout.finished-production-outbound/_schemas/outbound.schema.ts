import { z } from 'zod'

export const outboundValidator = z.object({
	mo_no: z.array(z.string(), { required_error: 'validation:required' }).nonempty({ message: 'validation:required' }),
	po: z.string({ required_error: 'validation:required' }).nonempty({ message: 'validation:required' })
})

export type OutboundFormValues = z.infer<typeof outboundValidator>
