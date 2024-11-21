import { z } from 'zod'

export const searchFormSchema = z.object({
	time_range: z
		.object({
			from: z.date(),
			to: z.date()
		})
		.optional(),
	brand: z.string().optional()
})

export type SearchFormValues = z.infer<typeof searchFormSchema>
