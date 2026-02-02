import { email, object, string, type infer as Infer } from 'zod'

export const updateProfileFormValues = object({
	display_name: string({ error: 'ns_validation:required' }).optional(),
	email: email({ error: 'ns_validation:required' }).optional(),
	employee_code: string().optional()
})

export type UpdateProfileFormValues = Infer<typeof updateProfileFormValues>
