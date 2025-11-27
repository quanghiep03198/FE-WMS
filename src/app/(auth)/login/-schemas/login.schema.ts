import { isEmpty } from 'lodash-es'
import { infer as Infer, object, string } from 'zod'

export const loginSchema = object({
	username: string().refine((value) => !isEmpty(value), { message: 'ns_auth:validation.require_account' }),
	password: string().refine((value) => !isEmpty(value), { message: 'ns_auth:validation.require_password' })
})

export type LoginFormValues = Infer<typeof loginSchema>
