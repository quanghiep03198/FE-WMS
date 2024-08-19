import { i18n } from '@/i18n'
import { isEmpty } from 'lodash'
import z from 'zod'

export const loginSchema = z.object({
	username: z.string().refine((value) => !isEmpty(value), { message: i18n.t('ns_auth:validation.require_account') }),
	password: z.string().refine((value) => !isEmpty(value), { message: i18n.t('ns_auth:validation.require_password') })
})

export type LoginFormValues = z.infer<typeof loginSchema>
