import { z } from 'zod'

export const outboundValidator = z.object({
	po: z.string({ required_error: 'validation:required' }).nonempty({ message: 'validation:required' })
})

export type OutboundFormValues = z.infer<typeof outboundValidator>
