import type { infer as Infer } from 'zod'
import { object, string } from 'zod'

export const loginSchema = object({
	username: string({ error: 'ns_auth:validation.require_account' }).nonempty({
		error: 'ns_auth:validation.require_account'
	}),
	password: string({ error: 'ns_auth:validation.require_password' }).nonempty({
		error: 'ns_auth:validation.require_password'
	})
})

export type LoginFormValues = Infer<typeof loginSchema>
