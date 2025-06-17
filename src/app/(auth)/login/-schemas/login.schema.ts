import { isEmpty } from 'lodash'
import z from 'zod'

export const loginSchema = z.object({
	username: z.string().refine((value) => !isEmpty(value), { message: 'ns_auth:validation.require_account' }),
	password: z.string().refine((value) => !isEmpty(value), { message: 'ns_auth:validation.require_password' })
})

export type LoginFormValues = z.infer<typeof loginSchema>
