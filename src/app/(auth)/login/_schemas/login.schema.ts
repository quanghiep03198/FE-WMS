import { i18n } from '@/i18n'
import z from 'zod'

export const loginSchema = z.object({
	username: z.string({ required_error: i18n.t('ns_auth:validation.require_account') }),
	password: z.string({ required_error: i18n.t('ns_auth:validation.require_password') })
})

export type LoginFormValues = z.infer<typeof loginSchema>
